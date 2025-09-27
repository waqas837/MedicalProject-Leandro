import { NextResponse } from 'next/server';

const API_KEY = process.env.ORKACHART_API_KEY;
const BASE_URL = process.env.ORKACHART_BASE_URL || 'https://api.orkachart.com/v1/leads';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get('country') || 'CO';

  if (!API_KEY) {
    console.error('ORKACHART_API_KEY is not configured');
    return NextResponse.json({
      status: 'error',
      message: 'API configuration error'
    }, { status: 500 });
  }

  try {
    const response = await fetch(`${BASE_URL}/list-insurances/${countryCode}`, {
      headers: {
        'X-API-Key': API_KEY,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    return NextResponse.json({
      status: 'success',
      data: data.data
    });

  } catch (error) {
    console.error('Error fetching insurances:', error);
    
    // Return mock data for development
    const mockInsurances = [
      { id: 1, code: 'INS001', company: 'Sample Insurance Co.', country_iso: countryCode },
      { id: 2, code: 'INS002', company: 'Health Plus Insurance', country_iso: countryCode }
    ];

    return NextResponse.json({
      status: 'success',
      data: mockInsurances
    });
  }
}
