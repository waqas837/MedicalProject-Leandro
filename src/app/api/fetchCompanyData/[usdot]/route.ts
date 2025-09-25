import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: any }) {
    const usdotTrimmed = await params.usdot?.trim();

    if (!usdotTrimmed) {
        return NextResponse.json({ error: 'USDOT number is required' }, { status: 400 });
    }

    try {
        const res = await fetch(`https://api.filingfmca.com/v1/fmca/lookup-dot-service`, {
            method: 'POST',
            headers: {
                'X-API-Key': process.env.FMCSA_API_KEY || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                DOT_NUMBER: usdotTrimmed,
                id_service: "1"
            }),
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message || 'Failed to fetch' }, { status: res.status });
        }

        const response = NextResponse.json(data);
        
        // Add cache control headers to prevent caching
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        
        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
