// SWAPI Character types
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

export interface SwapiResponse {
  count: number
  next: string | null
  previous: string | null
  results: SwapiCharacter[]
}

// SW Databank Character types
export interface DatabankCharacter {
  _id: string
  name: string
  description: string
  image: string
  __v?: number
}

// Enhanced character combining both APIs
export interface EnhancedCharacter extends SwapiCharacter {
  description?: string
  image?: string
  databankId?: string
}

export interface ServiceResponse<T> {
  data: T
  success: boolean
  error?: string
  isMockData?: boolean
}
