// app/api/create-checkout-session/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { storeFormDataToFile } from "@/lib/fileStorage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Global session store
const globalSessionStore = new Map();

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { EMAIL_ADDRESS, id_service, ...formData } = body;

    // Get service details
    const res = await fetch(
        `https://api.filingfmca.com/v1/fmca/service-detail/${id_service}`,
        {
            headers: {
                "X-API-Key": process.env.FMCSA_API_KEY!,
            },
        }
    );

    const json = await res.json();
    const service = json.data;

    function stripHtml(html: string) {
        return html.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: EMAIL_ADDRESS, // ✅ pass dynamic client email here!
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: service.service_name,
                        description: stripHtml(service.description).substring(0, 500),
                    },
                    unit_amount: Math.round(Number(service.price) * 100),
                },
                quantity: 1,
            },
        ],
        success_url: `https://filingfmca.com/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://filingfmca.com/payment-failed`,
        // Store service ID and USDOT in metadata
        metadata: {
            id_service: id_service.toString(),
            usdot: formData.USDOT || formData.usdot || formData.DOT_NUMBER || formData.dot_number,
        },
    });

    // Store form data to file using USDOT number
    const usdot = formData.USDOT || formData.usdot || formData.DOT_NUMBER || formData.dot_number;
    storeFormDataToFile(usdot, formData);
    
    // Store USDOT in global session store
    globalSessionStore.set(session.id, { usdot, formData });
    console.log('💾 Stored session data:', session.id, usdot);

    return NextResponse.json({ url: session.url });
}
