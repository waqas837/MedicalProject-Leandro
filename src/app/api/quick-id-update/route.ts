import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData } = body;

    if (!formData) {
      return NextResponse.json(
        { error: "Missing form data" },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = [
      'DOT_NUMBER',
      'LEGAL_NAME',
      'ID_NAME',
      'ID_LASTNAME',
      'ID_NUMBER',
      'ID_IMAGE',
      'SIGNATURE',
      'SIGNATURE_DATE'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate signing persons have required info
    if (!formData.signingPersons || formData.signingPersons.length === 0) {
      return NextResponse.json(
        { error: "Missing signing persons information" },
        { status: 400 }
      );
    }

    for (const person of formData.signingPersons) {
      if (!person.name || !person.title || !person.phone) {
        return NextResponse.json(
          { error: "Missing required signing person information" },
          { status: 400 }
        );
      }
    }

    // Prepare payload for external API
    const payload = {
      type: "quick_id_update",
      company_info: {
        dot_number: formData.DOT_NUMBER,
        legal_name: formData.LEGAL_NAME,
      },
      id_verification: {
        id_name: formData.ID_NAME,
        id_lastname: formData.ID_LASTNAME,
        id_dob: formData.ID_DOB,
        id_number: formData.ID_NUMBER,
        id_image: formData.ID_IMAGE,
        id_match_verified: formData.ID_MATCH_VERIFIED,
        matched_officer: formData.MATCHED_OFFICER,
      },
      signing_persons: formData.signingPersons.map((person: any) => ({
        name: person.name,
        title: person.title,
        phone: person.phone,
      })),
      signature: {
        signature_data: formData.SIGNATURE,
        signature_date: formData.SIGNATURE_DATE,
      },
      submission_timestamp: new Date().toISOString(),
    };

    // For now, just log the data and return success
    // You can replace this with your actual API call
    console.log("Quick ID Update submission:", payload);

    // TODO: Replace with actual API call to your backend
    // const apiRes = await fetch("YOUR_QUICK_UPDATE_API_ENDPOINT", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${process.env.YOUR_API_KEY}`,
    //   },
    //   body: JSON.stringify(payload),
    // });

    // if (!apiRes.ok) {
    //   const text = await apiRes.text();
    //   console.error("❌ External API error:", text);
    //   return NextResponse.json(
    //     { error: "Failed to submit to external API" },
    //     { status: apiRes.status }
    //   );
    // }

    // const result = await apiRes.json();

    return NextResponse.json({ 
      success: true, 
      message: "Quick ID Update submitted successfully",
      data: payload 
    });

  } catch (err) {
    console.error("❌ Quick ID Update route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
