import type { BaseEntity, EntityType } from "./types"

export interface EnhancedEntity extends BaseEntity {
  // Original Databank data
  description: string

  // Enhanced SWAPI data
  height?: string
  mass?: string
  gender?: string
  classification?: string
  films: string[]

  // Additional fields based on entity type
  manufacturer?: string
  model?: string
  vehicle_class?: string
  starship_class?: string
  average_lifespan?: string
  language?: string
  climate?: string
  terrain?: string
  population?: string

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
