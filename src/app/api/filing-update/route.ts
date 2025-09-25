import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { form_user_data, stripe_user_data } = body;

    if (!form_user_data || !stripe_user_data) {
      return NextResponse.json(
        { error: "Missing form_user_data or stripe_user_data" },
        { status: 400 }
      );
    }

    const payload = {
      form_user_data,
      stripe_user_data,
    };
  
    const apiRes = await fetch(
      "https://api.filingfmca.com/v1/fmca/filing-update",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.FMCSA_API_KEY!,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!apiRes.ok) {
      const text = await apiRes.text();
      console.error("❌ External API error:", text);
      
      // Check if it's a duplicate session error
      if (apiRes.status === 409 && text.includes("Duplicate session detected")) {
        return NextResponse.json(
          { 
            error: "Duplicate session detected", 
            status: "already_processed",
            redirect_to: "already-paid"
          },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: `External API error: ${text}` },
        { status: apiRes.status }
      );
    }

    const result = await apiRes.json();
    console.log("✅ External API success:", result);

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("❌ Route error:", err);
    return NextResponse.json(
      { error: err },
      { status: 500 }
    );
  }
}
