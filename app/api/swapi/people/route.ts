import { NextRequest, NextResponse } from "next/server";

// SWAPI People API Route
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const page = searchParams.get("page") || "1";

  try {
    // Build SWAPI URL
    let swapiUrl = "https://swapi.dev/api/people/";
    const params = new URLSearchParams();

    if (search) {
      params.append("search", search);
    }
    if (page && page !== "1") {
      params.append("page", page);
    }

    if (params.toString()) {
      swapiUrl += `?${params.toString()}`;
    }

    console.log(`🚀 Server-side SWAPI request: ${swapiUrl}`);

    // Set NODE_TLS_REJECT_UNAUTHORIZED to bypass SSL certificate issues
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // Make the request from the server (no CORS issues)
    const response = await fetch(swapiUrl, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Star Wars Frontend/1.0",
      },
    });

    // Reset SSL verification after the request
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;

    if (!response.ok) {
      throw new Error(`SWAPI responded with status: ${response.status}`);
    }

    const data = await response.json();

    console.log(
      `✅ Server-side SWAPI success: Found ${data.results?.length || 0} people`,
    );

    // Return the data to your frontend
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("❌ Server-side SWAPI error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch from SWAPI",
      },
      { status: 500 },
    );
  }
}
