import axios from "axios"

const SWAPI_BASE_URL = "https://swapi.dev/api"

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

  async searchCharacters(name: string): Promise<SwapiCharacter | null> {
    try {
      const response = await axios.get<SwapiSearchResponse<SwapiCharacter>>(
        `${SWAPI_BASE_URL}/people/?search=${encodeURIComponent(name)}`,
      )

      // Find exact or close match
      const exactMatch = response.data.results.find((char) => char.name.toLowerCase() === name.toLowerCase())

      if (exactMatch) return exactMatch

      // If no exact match, try partial match
      const partialMatch = response.data.results.find(
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
      const response = await axios.get<SwapiSearchResponse<SwapiVehicle>>(
        `${SWAPI_BASE_URL}/vehicles/?search=${encodeURIComponent(name)}`,
      )

      const exactMatch = response.data.results.find((vehicle) => vehicle.name.toLowerCase() === name.toLowerCase())

      if (exactMatch) return exactMatch

      const partialMatch = response.data.results.find(
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
      const response = await axios.get<SwapiSearchResponse<SwapiStarship>>(
        `${SWAPI_BASE_URL}/starships/?search=${encodeURIComponent(name)}`,
      )

      const exactMatch = response.data.results.find((ship) => ship.name.toLowerCase() === name.toLowerCase())

      if (exactMatch) return exactMatch

      const partialMatch = response.data.results.find(
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
      const response = await axios.get<SwapiSearchResponse<SwapiSpecies>>(
        `${SWAPI_BASE_URL}/species/?search=${encodeURIComponent(name)}`,
      )

      const exactMatch = response.data.results.find((species) => species.name.toLowerCase() === name.toLowerCase())

      if (exactMatch) return exactMatch

      const partialMatch = response.data.results.find(
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
      const response = await axios.get<SwapiSearchResponse<SwapiPlanet>>(
        `${SWAPI_BASE_URL}/planets/?search=${encodeURIComponent(name)}`,
      )

      const exactMatch = response.data.results.find((planet) => planet.name.toLowerCase() === name.toLowerCase())

      if (exactMatch) return exactMatch

      const partialMatch = response.data.results.find(
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
      const response = await axios.get<SwapiFilm>(filmUrl)
      const title = response.data.title
      this.filmCache.set(filmUrl, title)
      return title
    } catch (error) {
      console.error(`Error fetching film from ${filmUrl}:`, error)
      return "Unknown Film"
    }
  }

  async resolveFilmTitles(filmUrls: string[]): Promise<string[]> {
    const filmPromises = filmUrls.map((url) => this.getFilmTitle(url))
    return Promise.all(filmPromises)
  }
}

export const swapiService = new SwapiService()
