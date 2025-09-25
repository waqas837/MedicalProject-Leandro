import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Validate required fields
    const requiredFields = [
      'DOT_NUMBER', 'LEGAL_NAME', 'ID_NAME', 'ID_LASTNAME', 
      'ID_NUMBER', 'ID_IMAGE', 'SIGNATURE', 'SIGNATURE_DATE', 'signingPersons'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate ID match verification
    if (!formData.ID_MATCH_VERIFIED) {
      return NextResponse.json(
        { error: 'ID name must match a company officer' },
        { status: 400 }
      );
    }

    // Construct payload for external API - flattened structure
    const payload = {
      DOT_NUMBER: formData.DOT_NUMBER,
      LEGAL_NAME: formData.LEGAL_NAME,
      ID_NAME: formData.ID_NAME,
      ID_LASTNAME: formData.ID_LASTNAME,
      ID_DOB: formData.ID_DOB,
      ID_NUMBER: formData.ID_NUMBER,
      ID_IMAGE: formData.ID_IMAGE,
      ID_MATCH_VERIFIED: formData.ID_MATCH_VERIFIED,
      MATCHED_OFFICER: formData.MATCHED_OFFICER,
      ID_SCAN_DATA: formData.ID_SCAN_DATA,
      signingPersons: formData.signingPersons,
      SIGNATURE_DATE: formData.SIGNATURE_DATE,
      SIGNATURE: formData.SIGNATURE
    };

    // Call external API with proper headers
    const apiRes = await fetch(
      "https://api.filingfmca.com/v1/fmca/filing-modify",
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
      
      // Try to parse the error response
      let errorMessage = "Failed to submit to external API";
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorData.message || text;
      } catch {
        // If not JSON, use the raw text
        errorMessage = text || errorMessage;
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          status: apiRes.status,
          details: text
        },
        { status: apiRes.status }
      );
    }

    const result = await apiRes.json();

    return NextResponse.json({ 
      success: true, 
      message: 'ID & Signature update submitted successfully',
      data: result 
    });

  } catch (error) {
    console.error('Error processing ID-only update:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
