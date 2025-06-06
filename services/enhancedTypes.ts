import type { BaseEntity, EntityType } from "./types"

export interface EnhancedEntity extends BaseEntity {
  // Original Databank data
  description: string

  // Common SWAPI data
  films: string[]

  // Character specific fields (from SWAPI people endpoint)
  height?: string
  mass?: string
  gender?: string
  birth_year?: string
  eye_color?: string
  hair_color?: string
  skin_color?: string
  homeworld?: string

  // Vehicle specific fields (from SWAPI vehicles/starships endpoints)
  manufacturer?: string
  model?: string
  vehicle_class?: string
  starship_class?: string
  length?: string
  crew?: string
  passengers?: string
  cargo_capacity?: string
  consumables?: string
  max_atmosphering_speed?: string
  cost_in_credits?: string

  // Starship specific fields
  hyperdrive_rating?: string
  MGLT?: string

  // Species specific fields (from SWAPI species endpoint)
  classification?: string
  designation?: string
  average_height?: string
  average_lifespan?: string
  language?: string
  skin_colors?: string
  hair_colors?: string
  eye_colors?: string

  // Planet specific fields (from SWAPI planets endpoint)
  climate?: string
  terrain?: string
  population?: string
  diameter?: string
  rotation_period?: string
  orbital_period?: string
  gravity?: string
  surface_water?: string

  // Metadata
  swapiMatch: boolean
  enhancedAt: string
}

export interface EnhancedApiResponse {
  info: {
    total: number
    page: number
    limit: number
    next: string | null
    prev: string | null
  }
  data: EnhancedEntity[]
}

export interface EntityCategoryMapping {
  databankType: EntityType
  swapiEndpoints: string[]
  displayName: string
  icon: string
}

export const ENTITY_MAPPINGS: EntityCategoryMapping[] = [
  {
    databankType: "characters",
    swapiEndpoints: ["people"],
    displayName: "Characters",
    icon: "👤",
  },
  {
    databankType: "vehicles",
    swapiEndpoints: ["vehicles", "starships"],
    displayName: "Vehicles & Starships",
    icon: "🚀",
  },
  {
    databankType: "species",
    swapiEndpoints: ["species"],
    displayName: "Species",
    icon: "👽",
  },
  {
    databankType: "locations",
    swapiEndpoints: ["planets"],
    displayName: "Planets & Locations",
    icon: "🌍",
  },
  {
    databankType: "droids",
    swapiEndpoints: ["people"], // Droids are in people endpoint in SWAPI
    displayName: "Droids",
    icon: "🤖",
  },
  {
    databankType: "creatures",
    swapiEndpoints: ["species"],
    displayName: "Creatures",
    icon: "🐉",
  },
  {
    databankType: "organizations",
    swapiEndpoints: [],
    displayName: "Organizations",
    icon: "🏛️",
  },
]
