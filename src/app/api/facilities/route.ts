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
    // Determine country code - use parameter or default to CO
    const countryCode = country || 'CO';
    
    // Fetch facilities from the API with country filtering
    const response = await fetch(`${BASE_URL}/list-facilities/${countryCode}`, {
      headers: {
        'X-API-Key': API_KEY,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.status === 'success' && data.data) {
      // Fetch detailed info for each facility to get logos
      const facilityPromises = data.data.map(async (facility: any) => {
        try {
          const detailResponse = await fetch(`${BASE_URL}/info-facility/${facility.id_facility}`, {
            headers: {
              'X-API-Key': API_KEY,
              'Accept': 'application/json'
            }
          });
          
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            return {
              id: facility.id_facility,
              name: facility.facility_name,
              city: facility.city,
              country: facility.country_iso === 'DO' ? 'Dominican Republic' : 
                       facility.country_iso === 'CO' ? 'Colombia' : facility.country_iso,
              country_iso: facility.country_iso,
              logo: detailData.data?.logo || ''
            };
          } else {
            // Fallback if detail fetch fails
            return {
              id: facility.id_facility,
              name: facility.facility_name,
              city: facility.city,
              country: facility.country_iso === 'DO' ? 'Dominican Republic' : 
                       facility.country_iso === 'CO' ? 'Colombia' : facility.country_iso,
              country_iso: facility.country_iso,
              logo: ''
            };
          }
        } catch (error) {
          console.error(`Error fetching details for facility ${facility.id_facility}:`, error);
          // Fallback if detail fetch fails
          return {
            id: facility.id_facility,
            name: facility.facility_name,
            city: facility.city,
            country: facility.country_iso === 'DO' ? 'Dominican Republic' : 
                     facility.country_iso === 'CO' ? 'Colombia' : facility.country_iso,
            country_iso: facility.country_iso,
            logo: ''
          };
        }
      });

      const facilities = await Promise.all(facilityPromises);

      return NextResponse.json({
        status: 'success',
        data: facilities
      });
    } else {
      throw new Error('Invalid API response');
    }

  } catch (error) {
    console.error('Error fetching facilities:', error);
    
    // Return mock data for development
    const mockFacilities = [
      { id: 2, name: 'Holistic Care Puerto Plata', city: 'Puerto Plata', country: 'Dominican Republic', country_iso: 'DO', logo: 'https://orkachart.s3.us-east-2.amazonaws.com/api/facilities/2/2_logo.png' },
      { id: 3, name: 'Purple Heart Health', city: 'Medellin', country: 'Colombia', country_iso: 'CO', logo: 'https://orkachart.s3.us-east-2.amazonaws.com/api/facilities/3/3_logo.png' },
      { id: 4, name: 'Holistic Care Sosua', city: 'Sosua', country: 'Dominican Republic', country_iso: 'DO', logo: '' }
    ];

    return NextResponse.json({
      status: 'success',
      data: mockFacilities
    });
  }
}
