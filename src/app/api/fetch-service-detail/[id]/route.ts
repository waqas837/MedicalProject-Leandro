import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const serviceId = resolvedParams.id;

    const res = await fetch(
      `https://api.filingfmca.com/v1/fmca/service-detail/${serviceId}`,
      {
        headers: {
          "X-API-Key": process.env.FMCSA_API_KEY!,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch service details: ${res.status}`);
    }

    const data = await res.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error("Error fetching service details:", error);
    return NextResponse.json(
      { error: "Failed to fetch service details" },
      { status: 500 }
    );
  }
}
