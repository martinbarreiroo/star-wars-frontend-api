// Update to use the new types and add databank integration
import type { SwapiResponse, ServiceResponse, DatabankCharacter, EnhancedCharacter } from "./types"

// Mock data for Databank characters
const MOCK_DATABANK_CHARACTERS: Record<string, DatabankCharacter> = {
  "Luke Skywalker": {
    _id: "luke-skywalker",
    name: "Luke Skywalker",
    description:
      "Luke Skywalker was a Tatooine farmboy who rose from humble beginnings to become one of the greatest Jedi the galaxy has ever known.",
    image: "https://lumiere-a.akamaihd.net/v1/images/luke-skywalker-main_92d422b0.jpeg?region=304%2C0%2C1778%2C1000",
  },
  "Darth Vader": {
    _id: "darth-vader",
    name: "Darth Vader",
    description:
      "Once a heroic Jedi Knight, Darth Vader was seduced by the dark side of the Force, became a Sith Lord, and led the Empire's eradication of the Jedi Order.",
    image: "https://lumiere-a.akamaihd.net/v1/images/darth-vader-main_4560aff7.jpeg?region=0%2C67%2C1280%2C720",
  },
  "Leia Organa": {
    _id: "leia-organa",
    name: "Leia Organa",
    description:
      "Princess Leia Organa was one of the greatest leaders of the Rebel Alliance, fearless on the battlefield and dedicated to ending the Empire's tyranny.",
    image: "https://lumiere-a.akamaihd.net/v1/images/leia-organa-feature-image_d0f5e953.jpeg?region=0%2C0%2C1280%2C720",
  },
}

class SwapiProxyService {
  private baseUrl = "/api/swapi"
  private databankUrl = "https://starwars-databank-server.vercel.app/api/v1"
  private useMockData = false

  constructor() {
    // Check if we should use mock data
    this.useMockData = process.env.NODE_ENV === "development"
  }

  /**
   * Get all people from SWAPI with pagination
   */
  async getPeople(page = 1): Promise<ServiceResponse<SwapiResponse>> {
    try {
      console.log(`🔍 Fetching SWAPI people (page ${page})`)

      const response = await fetch(`${this.baseUrl}/people?page=${page}&mock=${this.useMockData}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`API route responded with status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "API route returned error")
      }

      console.log("✅ SWAPI fetch successful:", result.data)

      return {
        data: result.data,
        success: true,
        isMockData: result.isMockData,
      }
    } catch (error: any) {
      console.error("❌ SWAPI fetch failed:", error)

      // Return empty data structure on error
      return {
        data: { count: 0, next: null, previous: null, results: [] },
        success: false,
        error: error.message || "Failed to fetch via API proxy",
      }
    }
  }

  /**
   * Get character details from SW Databank by name
   */
  async getDatabankCharacter(name: string): Promise<ServiceResponse<DatabankCharacter | null>> {
    try {
      // Use mock data if enabled
      if (this.useMockData && MOCK_DATABANK_CHARACTERS[name]) {
        console.log(`🔄 Using mock Databank data for ${name}`)
        return {
          data: MOCK_DATABANK_CHARACTERS[name],
          success: true,
          isMockData: true,
        }
      }

      const encodedName = encodeURIComponent(name)
      const response = await fetch(`${this.databankUrl}/characters/name/${encodedName}`)

      if (!response.ok) {
        if (response.status === 404) {
          return { data: null, success: true } // Character not found in databank
        }
        throw new Error(`Databank API responded with status: ${response.status}`)
      }

      const result = await response.json()

      // The API returns an array, we want the first match
      const character = Array.isArray(result) && result.length > 0 ? result[0] : null

      return {
        data: character,
        success: true,
      }
    } catch (error: any) {
      console.error(`❌ Databank fetch failed for ${name}:`, error)

      // Try to return mock data if available
      if (MOCK_DATABANK_CHARACTERS[name]) {
        console.log(`🔄 Falling back to mock Databank data for ${name}`)
        return {
          data: MOCK_DATABANK_CHARACTERS[name],
          success: true,
          isMockData: true,
        }
      }

      return {
        data: null,
        success: false,
        error: error.message || "Failed to fetch from databank",
      }
    }
  }

  /**
   * Get enhanced characters combining SWAPI and Databank data
   */
  async getEnhancedCharacters(page = 1): Promise<
    ServiceResponse<{
      characters: EnhancedCharacter[]
      pagination: {
        count: number
        next: string | null
        previous: string | null
        currentPage: number
        totalPages: number
      }
    }>
  > {
    try {
      // First get SWAPI characters
      const swapiResult = await this.getPeople(page)

      if (!swapiResult.success || !swapiResult.data.results?.length) {
        throw new Error(swapiResult.error || "Failed to fetch SWAPI data")
      }

      // Enhance each character with databank info
      const enhancedCharacters: EnhancedCharacter[] = await Promise.all(
        swapiResult.data.results.map(async (character) => {
          const databankResult = await this.getDatabankCharacter(character.name)

          const enhanced: EnhancedCharacter = {
            ...character,
            description: databankResult.data?.description,
            image: databankResult.data?.image,
            databankId: databankResult.data?._id,
          }

          return enhanced
        }),
      )

      const totalPages = Math.ceil(swapiResult.data.count / 10) // SWAPI returns 10 per page

      return {
        data: {
          characters: enhancedCharacters,
          pagination: {
            count: swapiResult.data.count,
            next: swapiResult.data.next,
            previous: swapiResult.data.previous,
            currentPage: page,
            totalPages,
          },
        },
        success: true,
        isMockData: swapiResult.isMockData,
      }
    } catch (error: any) {
      console.error("❌ Enhanced characters fetch failed:", error)

      // Return minimal mock data on error
      const mockCharacters = Object.keys(MOCK_DATABANK_CHARACTERS).map((name) => {
        const databankChar = MOCK_DATABANK_CHARACTERS[name]
        return {
          name: databankChar.name,
          height: "unknown",
          mass: "unknown",
          hair_color: "unknown",
          skin_color: "unknown",
          eye_color: "unknown",
          birth_year: "unknown",
          gender: "unknown",
          homeworld: "",
          films: [],
          species: [],
          vehicles: [],
          starships: [],
          created: "",
          edited: "",
          url: "",
          description: databankChar.description,
          image: databankChar.image,
          databankId: databankChar._id,
        } as EnhancedCharacter
      })

      return {
        data: {
          characters: mockCharacters,
          pagination: {
            count: mockCharacters.length,
            next: null,
            previous: null,
            currentPage: 1,
            totalPages: 1,
          },
        },
        success: true,
        isMockData: true,
        error: error.message || "Failed to fetch enhanced characters, using fallback data",
      }
    }
  }
}

export const swapiProxyService = new SwapiProxyService()
export default swapiProxyService
