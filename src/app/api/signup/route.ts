import { NextResponse } from 'next/server';

const API_KEY = '9a4f2d1b-3c6e-4a7b-8f2d-0e1c2b3a4d5f';
const BASE_URL = 'https://api.orkachart.com/v1/leads';

export async function POST(request: Request) {
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
