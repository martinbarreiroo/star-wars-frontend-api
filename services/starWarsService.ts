import { httpClient } from "@/api/axios";
import {
  ServiceResponse,
  BaseEntity,
  BaseApiResponse,
  BaseParams,
  EntityType,
} from "./types";

/**
 * Generic service for all Star Wars API entities
 */
class StarWarsService<T extends BaseEntity> {
  constructor(private endpoint: string) {}

  /**
   * Get paginated list of entities
   */
  async getEntities(
    params: BaseParams = {},
  ): Promise<ServiceResponse<BaseApiResponse<T>>> {
    try {
      const { page = 1, limit = 9, search } = params;

      const queryParams: Record<string, any> = {
        page,
        limit,
      };

      if (search) {
        queryParams.search = search;
      }

      const response = await httpClient.get<BaseApiResponse<T>>(this.endpoint, {
        params: queryParams,
      });

      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      console.error(`Error fetching ${this.endpoint}:`, error);

      let errorMessage = `Failed to fetch ${this.endpoint.replace("/", "")}`;
      if (error.response?.status === 404) {
        errorMessage = `${this.endpoint.replace("/", "")} not found`;
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.code === "NETWORK_ERROR" || !error.response) {
        errorMessage = "Network error. Please check your connection.";
      }

      return {
        data: {} as BaseApiResponse<T>,
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get a single entity by ID
   */
  async getEntityById(id: string): Promise<ServiceResponse<T>> {
    try {
      const response = await httpClient.get<T>(`${this.endpoint}/${id}`);

      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      console.error(`Error fetching ${this.endpoint}/${id}:`, error);

      let errorMessage = `Failed to fetch ${this.endpoint.replace("/", "")}`;
      if (error.response?.status === 404) {
        errorMessage = `${this.endpoint.replace("/", "")} not found`;
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      return {
        data: {} as T,
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Search entities by name
   */
  async searchEntities(
    query: string,
    params: Omit<BaseParams, "search"> = {},
  ): Promise<ServiceResponse<BaseApiResponse<T>>> {
    return this.getEntities({ ...params, search: query });
  }
}

// Create service instances for each entity type
export const starWarsServices = {
  characters: new StarWarsService("/characters"),
  creatures: new StarWarsService("/creatures"),
  droids: new StarWarsService("/droids"),
  locations: new StarWarsService("/locations"),
  organizations: new StarWarsService("/organizations"),
  species: new StarWarsService("/species"),
  vehicles: new StarWarsService("/vehicles"),
};

export default starWarsServices;
