import Stripe from 'stripe';
import { headers } from 'next/headers';
import { getFormDataFromFile, deleteFormDataFile } from '@/lib/fileStorage';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function GET(req: Request) {
  return new Response('Webhook endpoint is working!', { status: 200 });
}

export async function POST(req: Request) {
  try {
    console.log(">>>>>>>>>> Webhook hit <<<<<<<<<<");
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('❌ No Stripe signature found');
      return new Response('No signature', { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return new Response('Webhook Error', { status: 400 });
    }

    console.log('✅ Webhook received:', event.type);

    // Handle failed payment
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('❌ Payment failed for PaymentIntent:', paymentIntent.id);

      // Get the associated checkout session
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
        limit: 1,
      });

      if (sessions.data.length === 0) {
        console.warn('⚠️ No session found for PaymentIntent:', paymentIntent.id);
        return new Response('No session found', { status: 404 });
      }

      const session = sessions.data[0];

      // Get USDOT from session metadata
      const usdot = session.metadata?.usdot;
      console.log('📋 USDOT from Checkout Session:', usdot);

      if (!usdot) {
        console.error('❌ No USDOT found in session metadata');
        return new Response('No USDOT found', { status: 400 });
      }

      // Get full form data from file
      const formData = getFormDataFromFile(usdot);
     ;

      if (!formData) {
        console.error('❌ No form data found for USDOT:', usdot);
        return new Response('No form data found', { status: 404 });
      }

      // Prepare payload to your API
      const dataToSubmit = {
        ...formData,
        id_status: '6', // Failed payment
      };
      
      console.log('🚀 FINAL DATA TO SUBMIT:', dataToSubmit);

      try {
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/filing-update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form_user_data: dataToSubmit,
            stripe_user_data: {
              id: session.id,
              payment_status: 'failed',
              amount_total: paymentIntent.amount,
              currency: paymentIntent.currency,
              customer_email: paymentIntent.receipt_email,
            },
          }),
        });

        if (apiResponse.ok) {
          console.log('✅ Declined payment data submitted successfully');
        } else {
          console.error('❌ API call failed with status:', apiResponse.status);
        }
        
        // Delete the temporary file after API call (success or failure)
        deleteFormDataFile(usdot);
        console.log('🗑️ Deleted temporary file for USDOT:', usdot);
      } catch (apiError) {
        console.error('❌ Error submitting declined payment data:', apiError);
      }
    }

    // Optionally handle successful payments
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('✅ Payment succeeded for PaymentIntent:', paymentIntent.id);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return new Response('Webhook Error', { status: 500 });
  }
}
