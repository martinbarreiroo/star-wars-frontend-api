import axios from "axios"

// SWAPI base URL
const SWAPI_BASE_URL = "https://swapi.dev/api"

// Create a more permissive axios client for SWAPI
const swapiClient = axios.create({
  baseURL: SWAPI_BASE_URL,
  timeout: 15000, // Increased timeout
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  // Add these to help with CORS
  withCredentials: false,
})

// Add response interceptor for better error handling
swapiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ SWAPI Success: ${response.config.url}`)
    return response
  },
  (error) => {
    console.error(`❌ SWAPI Error: ${error.config?.url}`, {
      status: error.response?.status,
      message: error.message,
      code: error.code,
    })

    if (error.code === "ECONNABORTED") {
      console.warn("SWAPI request timeout")
    } else if (error.response?.status === 404) {
      console.warn("SWAPI resource not found")
    } else if (!error.response) {
      console.warn("SWAPI network error - possibly CORS or connectivity issue")
    }
    return Promise.reject(error)
  },
)

// Type definitions for SWAPI responses (matching exact API structure)
export interface SwapiCharacter {
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  homeworld: string // URL
  films: string[] // URLs
  species: string[] // URLs
  vehicles: string[] // URLs
  starships: string[] // URLs
  created: string
  edited: string
  url: string
}

export interface SwapiVehicle {
  name: string
  model: string
  manufacturer: string
  cost_in_credits: string
  length: string
  max_atmosphering_speed: string
  crew: string
  passengers: string
  cargo_capacity: string
  consumables: string
  vehicle_class: string
  pilots: string[] // URLs
  films: string[] // URLs
  created: string
  edited: string
  url: string
}

export interface SwapiStarship {
  name: string
  model: string
  manufacturer: string
  cost_in_credits: string
  length: string
  max_atmosphering_speed: string
  crew: string
  passengers: string
  cargo_capacity: string
  consumables: string
  hyperdrive_rating: string
  MGLT: string
  starship_class: string
  pilots: string[] // URLs
  films: string[] // URLs
  created: string
  edited: string
  url: string
}

export interface SwapiSpecies {
  name: string
  classification: string
  designation: string
  average_height: string
  skin_colors: string
  hair_colors: string
  eye_colors: string
  average_lifespan: string
  homeworld: string // URL
  language: string
  people: string[] // URLs
  films: string[] // URLs
  created: string
  edited: string
  url: string
}

export interface SwapiPlanet {
  name: string
  rotation_period: string
  orbital_period: string
  diameter: string
  climate: string
  gravity: string
  terrain: string
  surface_water: string
  population: string
  residents: string[] // URLs
  films: string[] // URLs
  created: string
  edited: string
  url: string
}

export interface SwapiFilm {
  title: string
  episode_id: number
  opening_crawl: string
  director: string
  producer: string
  release_date: string
  characters: string[] // URLs
  planets: string[] // URLs
  starships: string[] // URLs
  vehicles: string[] // URLs
  species: string[] // URLs
  created: string
  edited: string
  url: string
}

export interface SwapiSearchResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Map of film URLs to titles for caching (based on SWAPI structure)
const FILM_TITLES: Record<string, string> = {
  "https://swapi.dev/api/films/1/": "A New Hope",
  "https://swapi.dev/api/films/2/": "The Empire Strikes Back",
  "https://swapi.dev/api/films/3/": "Return of the Jedi",
  "https://swapi.dev/api/films/4/": "The Phantom Menace",
  "https://swapi.dev/api/films/5/": "Attack of the Clones",
  "https://swapi.dev/api/films/6/": "Revenge of the Sith",
}

class SwapiService {
  private filmCache = new Map<string, string>()
  private planetCache = new Map<string, string>()
  private isOnline = true
  private lastOnlineCheck = 0
  private readonly ONLINE_CHECK_INTERVAL = 30000 // 30 seconds

  constructor() {
    // Pre-populate film cache with known films
    Object.entries(FILM_TITLES).forEach(([url, title]) => {
      this.filmCache.set(url, title)
    })
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
    try {
      console.log(`🚀 Making SWAPI request to: ${endpoint}`, params)

      // Build URL with params
      const url = new URL(endpoint, SWAPI_BASE_URL)
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })

      console.log(`📡 Full SWAPI URL: ${url.toString()}`)

      const response = await swapiClient.get<T>(endpoint, { params })

      // Reset online status on successful request
      if (!this.isOnline) {
        console.log("🟢 SWAPI is back online")
        this.isOnline = true
      }

      console.log(`✅ SWAPI response received for ${endpoint}`)
      return response.data
    } catch (error: any) {
      console.error(`❌ SWAPI request failed for ${endpoint}:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        code: error.code,
        url: error.config?.url,
      })

      // Handle different types of errors
      if (error.code === "ECONNABORTED") {
        console.warn(`⏰ SWAPI timeout for ${endpoint}`)
      } else if (error.response?.status === 404) {
        console.warn(`🔍 SWAPI resource not found: ${endpoint}`)
      } else if (!error.response) {
        console.warn(`🌐 SWAPI network error for ${endpoint}:`, error.message)
        // Mark as offline temporarily to avoid repeated failures
        this.isOnline = false
        this.lastOnlineCheck = Date.now()
      } else {
        console.warn(`⚠️ SWAPI error for ${endpoint}:`, error.response?.status, error.response?.statusText)
      }
      return null
    }
  }

  async searchCharacters(name: string): Promise<SwapiCharacter | null> {
    try {
      console.log(`🔍 Searching SWAPI for character: "${name}"`)
      const response = await this.makeRequest<SwapiSearchResponse<SwapiCharacter>>("/people/", { search: name })

      if (!response || !response.results || response.results.length === 0) {
        console.log(`❌ No SWAPI results found for character: "${name}"`)
        return null
      }

      console.log(`📊 Found ${response.results.length} SWAPI character results for: "${name}"`)

      // Find exact or close match
      const exactMatch = response.results.find((char) => char.name.toLowerCase() === name.toLowerCase())
      if (exactMatch) {
        console.log(`🎯 Exact SWAPI match found: "${exactMatch.name}"`)
        return exactMatch
      }

      // If no exact match, try partial match
      const partialMatch = response.results.find(
        (char) =>
          char.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(char.name.toLowerCase()),
      )

      if (partialMatch) {
        console.log(`🎯 Partial SWAPI match found: "${partialMatch.name}" for search: "${name}"`)
        return partialMatch
      }

      // Return first result if no good match found
      console.log(`🎯 Using first SWAPI result: "${response.results[0].name}" for search: "${name}"`)
      return response.results[0]
    } catch (error) {
      console.error(`💥 Error searching SWAPI characters for "${name}":`, error)
      return null
    }
  }

  async searchVehicles(name: string): Promise<SwapiVehicle | null> {
    try {
      console.log(`🔍 Searching SWAPI for vehicle: "${name}"`)
      const response = await this.makeRequest<SwapiSearchResponse<SwapiVehicle>>("/vehicles/", { search: name })

      if (!response || !response.results || response.results.length === 0) {
        console.log(`❌ No SWAPI vehicle results found for: "${name}"`)
        return null
      }

      console.log(`📊 Found ${response.results.length} SWAPI vehicle results for: "${name}"`)

      const exactMatch = response.results.find((vehicle) => vehicle.name.toLowerCase() === name.toLowerCase())
      if (exactMatch) {
        console.log(`🎯 Exact SWAPI vehicle match found: "${exactMatch.name}"`)
        return exactMatch
      }

      const partialMatch = response.results.find(
        (vehicle) =>
          vehicle.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(vehicle.name.toLowerCase()),
      )

      if (partialMatch) {
        console.log(`🎯 Partial SWAPI vehicle match found: "${partialMatch.name}" for search: "${name}"`)
        return partialMatch
      }

      return response.results[0]
    } catch (error) {
      console.error(`💥 Error searching SWAPI vehicles for "${name}":`, error)
      return null
    }
  }

  async searchStarships(name: string): Promise<SwapiStarship | null> {
    try {
      console.log(`🔍 Searching SWAPI for starship: "${name}"`)
      const response = await this.makeRequest<SwapiSearchResponse<SwapiStarship>>("/starships/", { search: name })

      if (!response || !response.results || response.results.length === 0) {
        console.log(`❌ No SWAPI starship results found for: "${name}"`)
        return null
      }

      console.log(`📊 Found ${response.results.length} SWAPI starship results for: "${name}"`)

      const exactMatch = response.results.find((ship) => ship.name.toLowerCase() === name.toLowerCase())
      if (exactMatch) {
        console.log(`🎯 Exact SWAPI starship match found: "${exactMatch.name}"`)
        return exactMatch
      }

      const partialMatch = response.results.find(
        (ship) =>
          ship.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(ship.name.toLowerCase()),
      )

      if (partialMatch) {
        console.log(`🎯 Partial SWAPI starship match found: "${partialMatch.name}" for search: "${name}"`)
        return partialMatch
      }

      return response.results[0]
    } catch (error) {
      console.error(`💥 Error searching SWAPI starships for "${name}":`, error)
      return null
    }
  }

  async searchSpecies(name: string): Promise<SwapiSpecies | null> {
    try {
      console.log(`🔍 Searching SWAPI for species: "${name}"`)
      const response = await this.makeRequest<SwapiSearchResponse<SwapiSpecies>>("/species/", { search: name })

      if (!response || !response.results || response.results.length === 0) {
        console.log(`❌ No SWAPI species results found for: "${name}"`)
        return null
      }

      console.log(`📊 Found ${response.results.length} SWAPI species results for: "${name}"`)

      const exactMatch = response.results.find((species) => species.name.toLowerCase() === name.toLowerCase())
      if (exactMatch) {
        console.log(`🎯 Exact SWAPI species match found: "${exactMatch.name}"`)
        return exactMatch
      }

      const partialMatch = response.results.find(
        (species) =>
          species.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(species.name.toLowerCase()),
      )

      if (partialMatch) {
        console.log(`🎯 Partial SWAPI species match found: "${partialMatch.name}" for search: "${name}"`)
        return partialMatch
      }

      return response.results[0]
    } catch (error) {
      console.error(`💥 Error searching SWAPI species for "${name}":`, error)
      return null
    }
  }

  async searchPlanets(name: string): Promise<SwapiPlanet | null> {
    try {
      console.log(`🔍 Searching SWAPI for planet: "${name}"`)
      const response = await this.makeRequest<SwapiSearchResponse<SwapiPlanet>>("/planets/", { search: name })

      if (!response || !response.results || response.results.length === 0) {
        console.log(`❌ No SWAPI planet results found for: "${name}"`)
        return null
      }

      console.log(`📊 Found ${response.results.length} SWAPI planet results for: "${name}"`)

      const exactMatch = response.results.find((planet) => planet.name.toLowerCase() === name.toLowerCase())
      if (exactMatch) {
        console.log(`🎯 Exact SWAPI planet match found: "${exactMatch.name}"`)
        return exactMatch
      }

      const partialMatch = response.results.find(
        (planet) =>
          planet.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(planet.name.toLowerCase()),
      )

      if (partialMatch) {
        console.log(`🎯 Partial SWAPI planet match found: "${partialMatch.name}" for search: "${name}"`)
        return partialMatch
      }

      return response.results[0]
    } catch (error) {
      console.error(`💥 Error searching SWAPI planets for "${name}":`, error)
      return null
    }
  }

  async getFilmTitle(filmUrl: string): Promise<string> {
    // Check cache first
    if (this.filmCache.has(filmUrl)) {
      return this.filmCache.get(filmUrl)!
    }

    // Check predefined film titles
    if (FILM_TITLES[filmUrl]) {
      this.filmCache.set(filmUrl, FILM_TITLES[filmUrl])
      return FILM_TITLES[filmUrl]
    }

    try {
      // Extract the film ID from the URL
      const filmId = filmUrl.split("/").filter(Boolean).pop()

      if (!filmId) {
        console.warn(`Invalid film URL: ${filmUrl}`)
        return "Unknown Film"
      }

      const response = await this.makeRequest<SwapiFilm>(`/films/${filmId}/`)

      if (response?.title) {
        this.filmCache.set(filmUrl, response.title)
        return response.title
      }

      return "Unknown Film"
    } catch (error) {
      console.error(`Error fetching film from ${filmUrl}:`, error)
      return "Unknown Film"
    }
  }

  async getPlanetName(planetUrl: string): Promise<string> {
    // Check cache first
    if (this.planetCache.has(planetUrl)) {
      return this.planetCache.get(planetUrl)!
    }

    try {
      // Extract the planet ID from the URL
      const planetId = planetUrl.split("/").filter(Boolean).pop()

      if (!planetId) {
        console.warn(`Invalid planet URL: ${planetUrl}`)
        return "Unknown Planet"
      }

      const response = await this.makeRequest<SwapiPlanet>(`/planets/${planetId}/`)

      if (response?.name) {
        this.planetCache.set(planetUrl, response.name)
        return response.name
      }

      return "Unknown Planet"
    } catch (error) {
      console.error(`Error fetching planet from ${planetUrl}:`, error)
      return "Unknown Planet"
    }
  }

  async resolveFilmTitles(filmUrls: string[]): Promise<string[]> {
    if (!filmUrls || filmUrls.length === 0) {
      return []
    }

    try {
      const filmPromises = filmUrls.map((url) => this.getFilmTitle(url))
      const results = await Promise.allSettled(filmPromises)

      return results.map((result) => (result.status === "fulfilled" ? result.value : "Unknown Film"))
    } catch (error) {
      console.error("Error resolving film titles:", error)
      return filmUrls.map(() => "Unknown Film")
    }
  }

  // Method to check if SWAPI is available
  async checkAvailability(): Promise<boolean> {
    try {
      console.log("🔍 Checking SWAPI availability...")
      // Try to fetch Luke Skywalker as a test
      const response = await this.makeRequest<SwapiCharacter>("/people/1/")
      const isAvailable = response !== null
      console.log(`🎯 SWAPI availability check result: ${isAvailable ? "✅ Available" : "❌ Unavailable"}`)
      return isAvailable
    } catch (error) {
      console.error("💥 SWAPI availability check failed:", error)
      return false
    }
  }

  // Method to reset online status
  resetOnlineStatus() {
    console.log("🔄 Resetting SWAPI online status")
    this.isOnline = true
    this.lastOnlineCheck = 0
  }

  // Clear all caches
  clearCaches() {
    console.log("🧹 Clearing SWAPI caches")
    this.filmCache.clear()
    this.planetCache.clear()
  }
}

export const swapiService = new SwapiService()
