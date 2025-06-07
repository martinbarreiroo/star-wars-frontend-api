// Update to use the new types and add databank integration
import type { SwapiResponse, ServiceResponse, DatabankCharacter, EnhancedCharacter } from "./types"

class SwapiProxyService {
  private baseUrl = "/api/swapi"
  private databankUrl = "https://starwars-databank-server.vercel.app/api/v1"

  /**
   * Get all people from SWAPI with pagination
   */
  async getPeople(page = 1): Promise<ServiceResponse<SwapiResponse>> {
    try {
      console.log(`🔍 Fetching SWAPI people (page ${page})`)

      const response = await fetch(`${this.baseUrl}/people?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API route responded with status: ${response.status}. ${errorText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "API route returned error")
      }

      console.log("✅ SWAPI fetch successful:", result.data)

      return {
        data: result.data,
        success: true,
      }
    } catch (error: any) {
      console.error("❌ SWAPI fetch failed:", error)

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
      const encodedName = encodeURIComponent(name)

      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${this.databankUrl}/characters/name/${encodedName}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; StarWarsApp/1.0)",
        },
        signal: controller.signal,
        cache: "no-store",
      })

      clearTimeout(timeoutId)

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

      if (!swapiResult.success) {
        return {
          data: { characters: [], pagination: { count: 0, next: null, previous: null, currentPage: 1, totalPages: 1 } },
          success: false,
          error: swapiResult.error,
        }
      }

      // Enhance each character with databank info (but don't fail if databank is down)
      const enhancedCharacters: EnhancedCharacter[] = await Promise.all(
        swapiResult.data.results.map(async (character) => {
          const databankResult = await this.getDatabankCharacter(character.name)

          const enhanced: EnhancedCharacter = {
            ...character,
            description: databankResult.success ? databankResult.data?.description : undefined,
            image: databankResult.success ? databankResult.data?.image : undefined,
            databankId: databankResult.success ? databankResult.data?._id : undefined,
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
      }
    } catch (error: any) {
      console.error("❌ Enhanced characters fetch failed:", error)
      return {
        data: { characters: [], pagination: { count: 0, next: null, previous: null, currentPage: 1, totalPages: 1 } },
        success: false,
        error: error.message || "Failed to fetch enhanced characters",
      }
    }
  }
}

export const swapiProxyService = new SwapiProxyService()
export default swapiProxyService
