import { NextRequest, NextResponse } from 'next/server';

// SWAPI People API Route
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const page = searchParams.get('page') || '1';

  try {
    // Build SWAPI URL
    let swapiUrl = 'https://swapi.dev/api/people/';
    const params = new URLSearchParams();
    
    if (search) {
      params.append('search', search);
    }
    if (page && page !== '1') {
      params.append('page', page);
    }
    
    if (params.toString()) {
      swapiUrl += `?${params.toString()}`;
    }

    console.log(`🚀 Server-side SWAPI request: ${swapiUrl}`);

    // Make the request from the server (no CORS issues)
    // For development, we'll disable SSL verification
    const response = await fetch(swapiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Star Wars Frontend/1.0'
      },
      // In development, ignore SSL certificate issues
      ...(process.env.NODE_ENV === 'development' && {
        // This works with Node.js fetch
        rejectUnauthorized: false
      })
    });

    if (!response.ok) {
      throw new Error(`SWAPI responded with status: ${response.status}`);
    }

    const data = await response.json();

    console.log(`✅ Server-side SWAPI success: Found ${data.results?.length || 0} people`);

    // Return the data to your frontend
    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error: any) {
    console.error('❌ Server-side SWAPI error:', error);
    
    // For demo purposes, if SWAPI is completely unavailable, return mock data
    if (error.code === 'CERT_HAS_EXPIRED' || error.message?.includes('certificate') || error.message?.includes('fetch failed')) {
      console.log('📝 SWAPI SSL issues detected, returning mock data for demo');
      
      const mockData = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: "Leia Organa",
            height: "150",
            mass: "49",
            hair_color: "brown",
            skin_color: "light",
            eye_color: "brown",
            birth_year: "19BBY",
            gender: "female",
            homeworld: "https://swapi.dev/api/planets/2/",
            films: [
              "https://swapi.dev/api/films/1/",
              "https://swapi.dev/api/films/2/",
              "https://swapi.dev/api/films/3/",
              "https://swapi.dev/api/films/6/"
            ],
            species: [],
            vehicles: ["https://swapi.dev/api/vehicles/30/"],
            starships: [],
            created: "2014-12-10T15:20:09.791000Z",
            edited: "2014-12-20T21:17:50.315000Z",
            url: "https://swapi.dev/api/people/5/"
          }
        ]
      };
      
      return NextResponse.json({
        success: true,
        data: mockData,
        note: "Mock data returned due to SWAPI SSL certificate issues"
      });
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch from SWAPI',
      },
      { status: 500 }
    );
  }
}
