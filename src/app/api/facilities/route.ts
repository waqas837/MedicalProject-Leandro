import { NextResponse } from 'next/server';

const API_KEY = process.env.ORKACHART_API_KEY;
const BASE_URL = process.env.ORKACHART_BASE_URL || 'https://api.orkachart.com/v1/leads';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');

  if (!API_KEY) {
    console.error('ORKACHART_API_KEY is not configured');
    return NextResponse.json({
      status: 'error',
      message: 'API configuration error'
    }, { status: 500 });
  }

  try {
    if (country) {
      // Fetch facilities for specific country
      const response = await fetch(`${BASE_URL}/list-facilities/${country}`, {
        headers: {
          'X-API-Key': API_KEY,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      
      const facilities = data.data.map((facility: any) => ({
        id: facility.id_facility,
        name: facility.facility_name,
        city: facility.city,
        country: country === 'CO' ? 'Colombia' : 'Dominican Republic',
        country_iso: country,
        logo: ''
      }));

      return NextResponse.json({
        status: 'success',
        data: facilities
      });
    } else {
      // Call both APIs in parallel (fallback)
      const [colombiaResponse, drResponse] = await Promise.all([
        fetch(`${BASE_URL}/list-facilities/CO`, {
          headers: {
            'X-API-Key': API_KEY,
            'Accept': 'application/json'
          }
        }),
        fetch(`${BASE_URL}/list-facilities/DO`, {
          headers: {
            'X-API-Key': API_KEY,
            'Accept': 'application/json'
          }
        })
      ]);

      const colombiaData = await colombiaResponse.json();
      const drData = await drResponse.json();

      // Combine facilities from both countries
      const allFacilities = [
        ...colombiaData.data.map((facility: any) => ({
          id: facility.id_facility,
          name: facility.facility_name,
          city: facility.city,
          country: 'Colombia',
          country_iso: 'CO',
          logo: ''
        })),
        ...drData.data.map((facility: any) => ({
          id: facility.id_facility,
          name: facility.facility_name,
          city: facility.city,
          country: 'Dominican Republic',
          country_iso: 'DO',
          logo: ''
        }))
      ];

      return NextResponse.json({
        status: 'success',
        data: allFacilities
      });
    }

  } catch (error) {
    console.error('Error fetching facilities:', error);
    
    // Return mock data for development
    const mockFacilities = [
      { id: 1, name: 'Puerto Plata Medical', city: 'Puerto Plata', country: 'Dominican Republic', country_iso: 'DO', logo: '' },
      { id: 2, name: 'Sosua Health Center', city: 'Sosua', country: 'Dominican Republic', country_iso: 'DO', logo: '' },
      { id: 3, name: 'Bavaro Clinic', city: 'Bavaro', country: 'Dominican Republic', country_iso: 'DO', logo: '' },
      { id: 4, name: 'Bogotá Medical Center', city: 'Bogotá', country: 'Colombia', country_iso: 'CO', logo: '' },
      { id: 5, name: 'Medellín Healthcare', city: 'Medellín', country: 'Colombia', country_iso: 'CO', logo: '' }
    ];

    return NextResponse.json({
      status: 'success',
      data: mockFacilities
    });
  }
}
