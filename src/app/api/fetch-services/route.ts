import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch(`https://api.filingfmca.com/v1/fmca/services`, {
            headers: {
                'X-API-Key': process.env.FMCSA_API_KEY || '',
            },
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message || 'Failed to fetch' }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
