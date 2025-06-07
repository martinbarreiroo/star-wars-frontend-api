import { type NextRequest, NextResponse } from "next/server"

// Mock data in case SWAPI is down
const MOCK_PEOPLE_DATA = {
  count: 82,
  next: null,
  previous: null,
  results: [
    {
      name: "Luke Skywalker",
      height: "172",
      mass: "77",
      hair_color: "blond",
      skin_color: "fair",
      eye_color: "blue",
      birth_year: "19BBY",
      gender: "male",
      homeworld: "https://swapi.dev/api/planets/1/",
      films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/2/",
        "https://swapi.dev/api/films/3/",
        "https://swapi.dev/api/films/6/",
      ],
      species: [],
      vehicles: ["https://swapi.dev/api/vehicles/14/", "https://swapi.dev/api/vehicles/30/"],
      starships: ["https://swapi.dev/api/starships/12/", "https://swapi.dev/api/starships/22/"],
      created: "2014-12-09T13:50:51.644000Z",
      edited: "2014-12-20T21:17:56.891000Z",
      url: "https://swapi.dev/api/people/1/",
    },
    {
      name: "Darth Vader",
      height: "202",
      mass: "136",
      hair_color: "none",
      skin_color: "white",
      eye_color: "yellow",
      birth_year: "41.9BBY",
      gender: "male",
      homeworld: "https://swapi.dev/api/planets/1/",
      films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/2/",
        "https://swapi.dev/api/films/3/",
        "https://swapi.dev/api/films/6/",
      ],
      species: [],
      vehicles: [],
      starships: ["https://swapi.dev/api/starships/13/"],
      created: "2014-12-10T15:18:20.704000Z",
      edited: "2014-12-20T21:17:50.313000Z",
      url: "https://swapi.dev/api/people/4/",
    },
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
        "https://swapi.dev/api/films/6/",
      ],
      species: [],
      vehicles: ["https://swapi.dev/api/vehicles/30/"],
      starships: [],
      created: "2014-12-10T15:20:09.791000Z",
      edited: "2014-12-20T21:17:50.315000Z",
      url: "https://swapi.dev/api/people/5/",
    },
  ],
}

// SWAPI People API Route
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const page = searchParams.get("page") || "1"
  const useMock = searchParams.get("mock") === "true"

  // Return mock data if requested or if we're in development mode
  if (useMock || process.env.NODE_ENV === "development") {
    console.log("🔄 Using mock SWAPI data")
    return NextResponse.json({
      success: true,
      data: MOCK_PEOPLE_DATA,
    })
  }

  try {
    // Build SWAPI URL
    let swapiUrl = "https://swapi.dev/api/people/"
    const params = new URLSearchParams()

    if (search) {
      params.append("search", search)
    }
    if (page && page !== "1") {
      params.append("page", page)
    }

    if (params.toString()) {
      swapiUrl += `?${params.toString()}`
    }

    console.log(`🚀 Server-side SWAPI request: ${swapiUrl}`)

    // Make the request with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(swapiUrl, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Star Wars Frontend/1.0",
      },
      signal: controller.signal,
      // Use node-fetch specific options
      agent: null,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`SWAPI responded with status: ${response.status}`)
    }

    const data = await response.json()

    console.log(`✅ Server-side SWAPI success: Found ${data.results?.length || 0} people`)

    // Return the data to your frontend
    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error("❌ Server-side SWAPI error:", error)

    // Fallback to mock data on error
    console.log("🔄 Falling back to mock SWAPI data due to error")
    return NextResponse.json({
      success: true,
      data: MOCK_PEOPLE_DATA,
      isMockData: true,
    })
  }
}
