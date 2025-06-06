import { starWarsServices } from "./starWarsService"
import { swapiService } from "./swapiService"
import type { BaseEntity, EntityType, BaseParams, ServiceResponse } from "./types"
import type { EnhancedEntity, EnhancedApiResponse } from "./enhancedTypes"

class EnhancedStarWarsService {
  private cache = new Map<string, EnhancedEntity>()

  async enhanceEntity(entity: BaseEntity, entityType: EntityType): Promise<EnhancedEntity> {
    const cacheKey = `${entityType}-${entity._id}`

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const enhancedEntity: EnhancedEntity = {
      ...entity,
      films: [],
      swapiMatch: false,
      enhancedAt: new Date().toISOString(),
    }

    try {
      // Try to find matching SWAPI data based on entity type
      let swapiData: any = null

      switch (entityType) {
        case "characters":
        case "droids":
          swapiData = await swapiService.searchCharacters(entity.name)
          if (swapiData) {
            enhancedEntity.height = swapiData.height
            enhancedEntity.mass = swapiData.mass
            enhancedEntity.gender = swapiData.gender
            enhancedEntity.films = await swapiService.resolveFilmTitles(swapiData.films)
            enhancedEntity.swapiMatch = true
          }
          break

        case "vehicles":
          // Try vehicles first, then starships
          swapiData = await swapiService.searchVehicles(entity.name)
          if (!swapiData) {
            swapiData = await swapiService.searchStarships(entity.name)
          }

          if (swapiData) {
            enhancedEntity.model = swapiData.model
            enhancedEntity.manufacturer = swapiData.manufacturer
            enhancedEntity.vehicle_class = swapiData.vehicle_class || swapiData.starship_class
            enhancedEntity.films = await swapiService.resolveFilmTitles(swapiData.films)
            enhancedEntity.swapiMatch = true
          }
          break

        case "species":
        case "creatures":
          swapiData = await swapiService.searchSpecies(entity.name)
          if (swapiData) {
            enhancedEntity.classification = swapiData.classification
            enhancedEntity.average_lifespan = swapiData.average_lifespan
            enhancedEntity.language = swapiData.language
            enhancedEntity.films = await swapiService.resolveFilmTitles(swapiData.films)
            enhancedEntity.swapiMatch = true
          }
          break

        case "locations":
          swapiData = await swapiService.searchPlanets(entity.name)
          if (swapiData) {
            enhancedEntity.climate = swapiData.climate
            enhancedEntity.terrain = swapiData.terrain
            enhancedEntity.population = swapiData.population
            enhancedEntity.films = await swapiService.resolveFilmTitles(swapiData.films)
            enhancedEntity.swapiMatch = true
          }
          break

        case "organizations":
          // Organizations don't have direct SWAPI equivalent
          enhancedEntity.films = []
          break
      }
    } catch (error) {
      console.error(`Error enhancing entity ${entity.name}:`, error)
    }

    this.cache.set(cacheKey, enhancedEntity)
    return enhancedEntity
  }

  async getEnhancedEntities(
    entityType: EntityType,
    params: BaseParams = {},
  ): Promise<ServiceResponse<EnhancedApiResponse>> {
    try {
      // Get base data from Databank
      const service = starWarsServices[entityType]
      const response = await service.getEntities(params)

      if (!response.success) {
        return {
          data: {} as EnhancedApiResponse,
          success: false,
          error: response.error,
        }
      }

      // Enhance each entity with SWAPI data
      const enhancedEntities = await Promise.all(
        response.data.data.map((entity) => this.enhanceEntity(entity, entityType)),
      )

      const enhancedResponse: EnhancedApiResponse = {
        info: response.data.info,
        data: enhancedEntities,
      }

      return {
        data: enhancedResponse,
        success: true,
      }
    } catch (error) {
      console.error(`Error getting enhanced entities for ${entityType}:`, error)
      return {
        data: {} as EnhancedApiResponse,
        success: false,
        error: `Failed to enhance ${entityType} data`,
      }
    }
  }

  async getEnhancedEntityById(entityType: EntityType, id: string): Promise<ServiceResponse<EnhancedEntity>> {
    try {
      const service = starWarsServices[entityType]
      const response = await service.getEntityById(id)

      if (!response.success) {
        return {
          data: {} as EnhancedEntity,
          success: false,
          error: response.error,
        }
      }

      const enhancedEntity = await this.enhanceEntity(response.data, entityType)

      return {
        data: enhancedEntity,
        success: true,
      }
    } catch (error) {
      console.error(`Error getting enhanced entity ${id}:`, error)
      return {
        data: {} as EnhancedEntity,
        success: false,
        error: `Failed to enhance entity data`,
      }
    }
  }

  clearCache() {
    this.cache.clear()
  }
}

export const enhancedStarWarsService = new EnhancedStarWarsService()
