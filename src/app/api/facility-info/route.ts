import { NextResponse } from 'next/server';

const API_KEY = '9a4f2d1b-3c6e-4a7b-8f2d-0e1c2b3a4d5f';
const BASE_URL = 'https://api.orkachart.com/v1/leads';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const facilityId = searchParams.get('id');

  if (!facilityId) {
    return NextResponse.json({
      status: 'error',
      message: 'Facility ID is required'
    }, { status: 400 });
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
