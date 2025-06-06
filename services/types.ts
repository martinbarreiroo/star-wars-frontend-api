// Common API response structure
export interface ApiInfo {
  total: number;
  page: number;
  limit: number;
  next: string | null;
  prev: string | null;
}

export interface ServiceResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface BaseEntity {
  _id: string;
  name: string;
  description: string;
  image: string;
  __v?: number;
}

export interface BaseApiResponse<T> {
  info: ApiInfo;
  data: T[];
}

export interface BaseParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Character types
export interface Character extends BaseEntity {
  affiliations?: string[];
  species?: string;
  gender?: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  eye_color?: string;
  skin_color?: string;
  birth_year?: string;
  homeworld?: string;
}

export interface CharactersApiResponse extends BaseApiResponse<Character> {}
export interface GetCharactersParams extends BaseParams {}

// Creature types
export interface Creature extends BaseEntity {
  classification?: string;
  designation?: string;
  average_height?: string;
  skin_colors?: string;
  hair_colors?: string;
  eye_colors?: string;
  average_lifespan?: string;
  homeworld?: string;
  language?: string;
}

export interface CreaturesApiResponse extends BaseApiResponse<Creature> {}
export interface GetCreaturesParams extends BaseParams {}

// Droid types
export interface Droid extends BaseEntity {
  model?: string;
  manufacturer?: string;
  class?: string;
  height?: string;
  mass?: string;
  sensor_color?: string;
  plating_color?: string;
  equipment?: string[];
}

export interface DroidsApiResponse extends BaseApiResponse<Droid> {}
export interface GetDroidsParams extends BaseParams {}

// Location types
export interface Location extends BaseEntity {
  region?: string;
  sector?: string;
  system?: string;
  planet?: string;
  terrain?: string;
  climate?: string;
  points_of_interest?: string[];
}

export interface LocationsApiResponse extends BaseApiResponse<Location> {}
export interface GetLocationsParams extends BaseParams {}

// Organization types
export interface Organization extends BaseEntity {
  type?: string;
  founding_date?: string;
  dissolution_date?: string;
  headquarters?: string;
  leaders?: string[];
  notable_members?: string[];
}

export interface OrganizationsApiResponse
  extends BaseApiResponse<Organization> {}
export interface GetOrganizationsParams extends BaseParams {}

// Species types
export interface Species extends BaseEntity {
  classification?: string;
  designation?: string;
  average_height?: string;
  skin_colors?: string;
  hair_colors?: string;
  eye_colors?: string;
  average_lifespan?: string;
  homeworld?: string;
  language?: string;
}

export interface SpeciesApiResponse extends BaseApiResponse<Species> {}
export interface GetSpeciesParams extends BaseParams {}

// Vehicle types
export interface Vehicle extends BaseEntity {
  model?: string;
  manufacturer?: string;
  class?: string;
  length?: string;
  width?: string;
  height?: string;
  max_speed?: string;
  crew?: string;
  passengers?: string;
  cargo_capacity?: string;
  armament?: string[];
}

export interface VehiclesApiResponse extends BaseApiResponse<Vehicle> {}
export interface GetVehiclesParams extends BaseParams {}

// Entity categories for navigation
export type EntityType =
  | "characters"
  | "creatures"
  | "droids"
  | "locations"
  | "organizations"
  | "species"
  | "vehicles";

export interface EntityCategory {
  type: EntityType;
  label: string;
  count: number;
  endpoint: string;
  icon: string;
}

export const ENTITY_CATEGORIES: EntityCategory[] = [
  {
    type: "characters",
    label: "Characters",
    count: 964,
    endpoint: "/characters",
    icon: "👤",
  },
  {
    type: "creatures",
    label: "Creatures",
    count: 75,
    endpoint: "/creatures",
    icon: "🐉",
  },
  {
    type: "droids",
    label: "Droids",
    count: 60,
    endpoint: "/droids",
    icon: "🤖",
  },
  {
    type: "locations",
    label: "Locations",
    count: 326,
    endpoint: "/locations",
    icon: "🌍",
  },
  {
    type: "organizations",
    label: "Organizations",
    count: 135,
    endpoint: "/organizations",
    icon: "🏛️",
  },
  {
    type: "species",
    label: "Species",
    count: 82,
    endpoint: "/species",
    icon: "👽",
  },
  {
    type: "vehicles",
    label: "Vehicles",
    count: 267,
    endpoint: "/vehicles",
    icon: "🚀",
  },
];
