// Server Component example - no CORS issues
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SwapiPerson {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
}

interface SwapiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SwapiPerson[];
}

async function fetchSwapiPeople(search?: string): Promise<SwapiResponse> {
  const url = search 
    ? `https://swapi.dev/api/people/?search=${encodeURIComponent(search)}`
    : 'https://swapi.dev/api/people/';

  console.log(`🚀 Server Component fetching: ${url}`);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    // Optional: Add cache control
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch SWAPI data: ${response.status}`);
  }

  const data = await response.json();
  console.log(`✅ Server Component success: Found ${data.results?.length || 0} people`);
  
  return data;
}

// This is a Server Component - runs on the server, no CORS issues
export default async function SwapiServerDemo({ 
  searchParams 
}: { 
  searchParams: { search?: string } 
}) {
  try {
    const swapiData = await fetchSwapiPeople(searchParams.search);

    return (
      <div className="container mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-yellow-500">
              SWAPI Server Component Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              ✅ This data was fetched server-side (no CORS issues!)
            </p>
            <p className="text-sm text-gray-400">
              Found {swapiData.count} people total, showing {swapiData.results.length}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {swapiData.results.map((person, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-yellow-400 text-lg">
                  {person.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-300">
                <p><strong>Height:</strong> {person.height}cm</p>
                <p><strong>Mass:</strong> {person.mass}kg</p>
                <p><strong>Hair:</strong> {person.hair_color}</p>
                <p><strong>Eyes:</strong> {person.eye_color}</p>
                <p><strong>Birth Year:</strong> {person.birth_year}</p>
                <p><strong>Gender:</strong> {person.gender}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="container mx-auto p-4">
        <Card className="border-red-700">
          <CardContent className="p-6 text-center">
            <p className="text-red-400">
              Failed to fetch SWAPI data: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}
