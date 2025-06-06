import axios from "axios"

const SWAPI_BASE_URL = "https://swapi.dev/api"

// Add timeout and better error handling
const swapiClient = axios.create({
  baseURL: SWAPI_BASE_URL,
  timeout: 5000, // 5 second timeout
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

// Add response interceptor for better error handling
swapiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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

export interface SwapiCharacter {
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  homeworld: string
  films: string[]
  species: string[]
  vehicles: string[]
  starships: string[]
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
  pilots: string[]
  films: string[]
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
  pilots: string[]
  films: string[]
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
  homeworld: string
  language: string
  people: string[]
  films: string[]
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
  residents: string[]
  films: string[]
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
  characters: string[]
  planets: string[]
  starships: string[]
  vehicles: string[]
  species: string[]
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

class SwapiService {
  private filmCache = new Map<string, string>()
  private isOnline = true

  private async makeRequest<T>(url: string): Promise<T | null> {
    if (!this.isOnline) {
      console.warn("SWAPI service is offline, skipping request")
      return null
    }

    try {
      const response = await swapiClient.get<T>(url)
      return response.data
    } catch (error: any) {
      // Handle different types of errors
      if (error.code === "ECONNABORTED") {
        console.warn(`SWAPI timeout for ${url}`)
      } else if (error.response?.status === 404) {
        console.warn(`SWAPI resource not found: ${url}`)
      } else if (!error.response) {
        console.warn(`SWAPI network error for ${url}:`, error.message)
        // Mark as offline temporarily to avoid repeated failures
        this.isOnline = false
        setTimeout(() => {
          this.isOnline = true
        }, 30000) // Re-enable after 30 seconds
      } else {
        console.warn(`SWAPI error for ${url}:`, error.response?.status, error.response?.statusText)
      }
      return null
    }
  }

  async searchCharacters(name: string): Promise<SwapiCharacter | null> {
    try {
      const searchUrl = `/people/?search=${encodeURIComponent(name)}`
      const response = await this.makeRequest<SwapiSearchResponse<SwapiCharacter>>(searchUrl)

      if (!response || !response.results) {
        return null
      }

      // Find exact or close match
      const exactMatch = response.results.find((char) => char.name.toLowerCase() === name.toLowerCase())

      if (exactMatch) return exactMatch

      // If no exact match, try partial match
      const partialMatch = response.results.find(
        (char) =>
          char.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(char.name.toLowerCase()),
      )

      return partialMatch || null
    } catch (error) {
      console.error(`Error searching SWAPI characters for "${name}":`, error)
      return null
    }
  }

  async searchVehicles(name: string): Promise<SwapiVehicle | null> {
    try {
      const searchUrl = `/vehicles/?search=${encodeURIComponent(name)}`
      const response = await this.makeRequest<SwapiSearchResponse<SwapiVehicle>>(searchUrl)

      if (!response || !response.results) {
        return null
      }

      const exactMatch = response.results.find((vehicle) => vehicle.name.toLowerCase() === name.toLowerCase())

      if (exactMatch) return exactMatch

      const partialMatch = response.results.find(
        (vehicle) =>
          vehicle.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(vehicle.name.toLowerCase()),
      )

      return partialMatch || null
    } catch (error) {
      console.error(`Error searching SWAPI vehicles for "${name}":`, error)
      return null
    }
  }

  async searchStarships(name: string): Promise<SwapiStarship | null> {
    try {
      const searchUrl = `/starships/?search=${encodeURIComponent(name)}`
      const response = await this.makeRequest<SwapiSearchResponse<SwapiStarship>>(searchUrl)

      if (!response || !response.results) {
        return null
      }

      const exactMatch = response.results.find((ship) => ship.name.toLowerCase() === name.toLowerCase())

      if (exactMatch) return exactMatch

      const partialMatch = response.results.find(
        (ship) =>
          ship.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(ship.name.toLowerCase()),
      )

      return partialMatch || null
    } catch (error) {
      console.error(`Error searching SWAPI starships for "${name}":`, error)
      return null
    }
  }

  async searchSpecies(name: string): Promise<SwapiSpecies | null> {
    try {
      const searchUrl = `/species/?search=${encodeURIComponent(name)}`
      const response = await this.makeRequest<SwapiSearchResponse<SwapiSpecies>>(searchUrl)

      if (!response || !response.results) {
        return null
      }

      const exactMatch = response.results.find((species) => species.name.toLowerCase() === name.toLowerCase())

      if (exactMatch) return exactMatch

      const partialMatch = response.results.find(
        (species) =>
          species.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(species.name.toLowerCase()),
      )

      return partialMatch || null
    } catch (error) {
      console.error(`Error searching SWAPI species for "${name}":`, error)
      return null
    }
  }

  async searchPlanets(name: string): Promise<SwapiPlanet | null> {
    try {
      const searchUrl = `/planets/?search=${encodeURIComponent(name)}`
      const response = await this.makeRequest<SwapiSearchResponse<SwapiPlanet>>(searchUrl)

      if (!response || !response.results) {
        return null
      }

      const exactMatch = response.results.find((planet) => planet.name.toLowerCase() === name.toLowerCase())

      if (exactMatch) return exactMatch

      const partialMatch = response.results.find(
        (planet) =>
          planet.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(planet.name.toLowerCase()),
      )

      return partialMatch || null
    } catch (error) {
      console.error(`Error searching SWAPI planets for "${name}":`, error)
      return null
    }
  }

  async getFilmTitle(filmUrl: string): Promise<string> {
    if (this.filmCache.has(filmUrl)) {
      return this.filmCache.get(filmUrl)!
    }

    try {
      // Extract the film ID from the URL and construct the path
      const filmId = filmUrl.split("/").filter(Boolean).pop()
      const filmPath = `/films/${filmId}/`

      const response = await this.makeRequest<SwapiFilm>(filmPath)

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
      const response = await this.makeRequest<any>("/people/1/")
      return response !== null
    } catch (error) {
      return false
    }
  }

  // Method to reset online status
  resetOnlineStatus() {
    this.isOnline = true
  }
}

export const swapiService = new SwapiService()
