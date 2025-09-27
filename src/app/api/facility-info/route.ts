import { NextResponse } from 'next/server';

const API_KEY = process.env.ORKACHART_API_KEY;
const BASE_URL = process.env.ORKACHART_BASE_URL || 'https://api.orkachart.com/v1/leads';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const facilityId = searchParams.get('id');

  if (!facilityId) {
    return NextResponse.json({
      status: 'error',
      message: 'Facility ID is required'
    }, { status: 400 });
  }

  if (!API_KEY) {
    console.error('ORKACHART_API_KEY is not configured');
    return NextResponse.json({
      status: 'error',
      message: 'API configuration error'
    }, { status: 500 });
  }

  try {
    const response = await fetch(`${BASE_URL}/info-facility/${facilityId}`, {
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
    console.error('Error fetching facility info:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch facility information'
    }, { status: 500 });
  }
}
