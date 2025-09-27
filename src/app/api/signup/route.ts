import { NextResponse } from 'next/server';

const API_KEY = process.env.ORKACHART_API_KEY;
const BASE_URL = process.env.ORKACHART_BASE_URL || 'https://api.orkachart.com/v1/leads';

export async function POST(request: Request) {
  if (!API_KEY) {
    console.error('ORKACHART_API_KEY is not configured');
    return NextResponse.json({
      status: 'error',
      message: 'API configuration error'
    }, { status: 500 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error submitting signup:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to submit registration'
    }, { status: 500 });
  }
}
