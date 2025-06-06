import { starWarsServices } from "./starWarsService"
import { swapiService } from "./swapiService"
import type { BaseEntity, EntityType, BaseParams, ServiceResponse } from "./types"
import type { EnhancedEntity, EnhancedApiResponse } from "./enhancedTypes"

class EnhancedStarWarsService {
  private cache = new Map<string, EnhancedEntity>()
  private swapiAvailable = true
  private lastSwapiCheck = 0
  private readonly SWAPI_CHECK_INTERVAL = 60000 // Check every minute

  private async checkSwapiAvailability(): Promise<boolean> {
    const now = Date.now()

    // Only check availability once per minute
    if (now - this.lastSwapiCheck < this.SWAPI_CHECK_INTERVAL) {
      return this.swapiAvailable
    }

    this.lastSwapiCheck = now

    try {
      this.swapiAvailable = await swapiService.checkAvailability()
      if (this.swapiAvailable) {
        console.log("SWAPI is available")
      } else {
        console.warn("SWAPI is not available, using Databank data only")
      }
    } catch (error) {
      console.warn("Failed to check SWAPI availability:", error)
      this.swapiAvailable = false
    }

    return this.swapiAvailable
  }

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

    // Check if SWAPI is available before attempting enhancement
    const swapiAvailable = await this.checkSwapiAvailability()

    if (!swapiAvailable) {
      console.warn(`SWAPI unavailable, returning basic data for ${entity.name}`)
      this.cache.set(cacheKey, enhancedEntity)
      return enhancedEntity
    }

    try {
      // Try to find matching SWAPI data based on entity type
      let swapiData: any = null

      switch (entityType) {
        case "characters":
        case "droids":
          try {
            swapiData = await swapiService.searchCharacters(entity.name)
            if (swapiData) {
              enhancedEntity.height = swapiData.height !== "unknown" ? swapiData.height : undefined
              enhancedEntity.mass = swapiData.mass !== "unknown" ? swapiData.mass : undefined
              enhancedEntity.gender = swapiData.gender !== "n/a" ? swapiData.gender : undefined

              if (swapiData.films && swapiData.films.length > 0) {
                enhancedEntity.films = await swapiService.resolveFilmTitles(swapiData.films)
              }

              enhancedEntity.swapiMatch = true
            }
          } catch (error) {
            console.warn(`Failed to enhance character ${entity.name}:`, error)
          }
          break

        case "vehicles":
          try {
            // Try vehicles first, then starships
            swapiData = await swapiService.searchVehicles(entity.name)
            if (!swapiData) {
              swapiData = await swapiService.searchStarships(entity.name)
            }

            if (swapiData) {
              enhancedEntity.model = swapiData.model !== "unknown" ? swapiData.model : undefined
              enhancedEntity.manufacturer = swapiData.manufacturer !== "unknown" ? swapiData.manufacturer : undefined
              enhancedEntity.vehicle_class = swapiData.vehicle_class || swapiData.starship_class

              if (swapiData.films && swapiData.films.length > 0) {
                enhancedEntity.films = await swapiService.resolveFilmTitles(swapiData.films)
              }

              enhancedEntity.swapiMatch = true
            }
          } catch (error) {
            console.warn(`Failed to enhance vehicle ${entity.name}:`, error)
          }
          break

        case "species":
        case "creatures":
          try {
            swapiData = await swapiService.searchSpecies(entity.name)
            if (swapiData) {
              enhancedEntity.classification =
                swapiData.classification !== "unknown" ? swapiData.classification : undefined
              enhancedEntity.average_lifespan =
                swapiData.average_lifespan !== "unknown" ? swapiData.average_lifespan : undefined
              enhancedEntity.language = swapiData.language !== "unknown" ? swapiData.language : undefined

              if (swapiData.films && swapiData.films.length > 0) {
                enhancedEntity.films = await swapiService.resolveFilmTitles(swapiData.films)
              }

              enhancedEntity.swapiMatch = true
            }
          } catch (error) {
            console.warn(`Failed to enhance species ${entity.name}:`, error)
          }
          break

        case "locations":
          try {
            swapiData = await swapiService.searchPlanets(entity.name)
            if (swapiData) {
              enhancedEntity.climate = swapiData.climate !== "unknown" ? swapiData.climate : undefined
              enhancedEntity.terrain = swapiData.terrain !== "unknown" ? swapiData.terrain : undefined
              enhancedEntity.population = swapiData.population !== "unknown" ? swapiData.population : undefined

              if (swapiData.films && swapiData.films.length > 0) {
                enhancedEntity.films = await swapiService.resolveFilmTitles(swapiData.films)
              }

              enhancedEntity.swapiMatch = true
            }
          } catch (error) {
            console.warn(`Failed to enhance location ${entity.name}:`, error)
          }
          break

        case "organizations":
          // Organizations don't have direct SWAPI equivalent
          enhancedEntity.films = []
          break
      }
    } catch (error) {
      console.warn(`Error enhancing entity ${entity.name}:`, error)
      // Continue with basic entity data
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

      // Enhance each entity with SWAPI data (with error handling)
      const enhancedEntities = await Promise.allSettled(
        response.data.data.map((entity) => this.enhanceEntity(entity, entityType)),
      )

      // Filter out failed enhancements and extract successful ones
      const successfulEnhancements = enhancedEntities
        .filter((result): result is PromiseFulfilledResult<EnhancedEntity> => result.status === "fulfilled")
        .map((result) => result.value)

      // Log any failed enhancements
      const failedCount = enhancedEntities.length - successfulEnhancements.length
      if (failedCount > 0) {
        console.warn(`${failedCount} entities failed to enhance properly`)
      }

      const enhancedResponse: EnhancedApiResponse = {
        info: response.data.info,
        data: successfulEnhancements,
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

  // Method to force retry SWAPI
  retrySwapiConnection() {
    this.swapiAvailable = true
    this.lastSwapiCheck = 0
    swapiService.resetOnlineStatus()
  }
}

export const enhancedStarWarsService = new EnhancedStarWarsService()
