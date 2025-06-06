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

    // Create base enhanced entity with all fields from the original entity
    const enhancedEntity: EnhancedEntity = {
      ...entity,
      films: [],
      swapiMatch: false,
      enhancedAt: new Date().toISOString(),
    }

    console.log(`Enhancing ${entityType} entity: ${entity.name}`)

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
          try {
            swapiData = await swapiService.searchCharacters(entity.name)
            if (swapiData) {
              console.log(`Found SWAPI match for character: ${entity.name}`)

              // Map exact SWAPI fields
              enhancedEntity.height = swapiData.height !== "unknown" ? swapiData.height : undefined
              enhancedEntity.mass = swapiData.mass !== "unknown" ? swapiData.mass : undefined
              enhancedEntity.gender = swapiData.gender !== "n/a" ? swapiData.gender : undefined
              enhancedEntity.birth_year = swapiData.birth_year !== "unknown" ? swapiData.birth_year : undefined
              enhancedEntity.eye_color = swapiData.eye_color !== "unknown" ? swapiData.eye_color : undefined
              enhancedEntity.hair_color = swapiData.hair_color !== "unknown" ? swapiData.hair_color : undefined
              enhancedEntity.skin_color = swapiData.skin_color !== "unknown" ? swapiData.skin_color : undefined

              // Resolve homeworld if available
              if (swapiData.homeworld) {
                try {
                  enhancedEntity.homeworld = await swapiService.getPlanetName(swapiData.homeworld)
                } catch (error) {
                  console.warn(`Failed to resolve homeworld for ${entity.name}:`, error)
                }
              }

              // Resolve films
              if (swapiData.films && swapiData.films.length > 0) {
                enhancedEntity.films = await swapiService.resolveFilmTitles(swapiData.films)
              }

              enhancedEntity.swapiMatch = true
              console.log(`Successfully enhanced character: ${entity.name}`)
            } else {
              console.log(`No SWAPI match found for character: ${entity.name}`)
            }
          } catch (error) {
            console.warn(`Failed to enhance character ${entity.name}:`, error)
          }
          break

        case "droids":
          try {
            // Droids are also in the people endpoint in SWAPI
            swapiData = await swapiService.searchCharacters(entity.name)
            if (swapiData) {
              console.log(`Found SWAPI match for droid: ${entity.name}`)

              enhancedEntity.height = swapiData.height !== "unknown" ? swapiData.height : undefined
              enhancedEntity.mass = swapiData.mass !== "unknown" ? swapiData.mass : undefined

              // Resolve films
              if (swapiData.films && swapiData.films.length > 0) {
                enhancedEntity.films = await swapiService.resolveFilmTitles(swapiData.films)
              }

              enhancedEntity.swapiMatch = true
              console.log(`Successfully enhanced droid: ${entity.name}`)
            } else {
              console.log(`No SWAPI match found for droid: ${entity.name}`)
            }
          } catch (error) {
            console.warn(`Failed to enhance droid ${entity.name}:`, error)
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
              console.log(`Found SWAPI match for vehicle: ${entity.name}`)

              // Map exact SWAPI fields
              enhancedEntity.model = swapiData.model !== "unknown" ? swapiData.model : undefined
              enhancedEntity.manufacturer = swapiData.manufacturer !== "unknown" ? swapiData.manufacturer : undefined
              enhancedEntity.vehicle_class = swapiData.vehicle_class || swapiData.starship_class
              enhancedEntity.length = swapiData.length !== "unknown" ? swapiData.length : undefined
              enhancedEntity.crew = swapiData.crew !== "unknown" ? swapiData.crew : undefined
              enhancedEntity.passengers = swapiData.passengers !== "unknown" ? swapiData.passengers : undefined
              enhancedEntity.cargo_capacity =
                swapiData.cargo_capacity !== "unknown" ? swapiData.cargo_capacity : undefined
              enhancedEntity.consumables = swapiData.consumables !== "unknown" ? swapiData.consumables : undefined
              enhancedEntity.max_atmosphering_speed =
                swapiData.max_atmosphering_speed !== "unknown" ? swapiData.max_atmosphering_speed : undefined

              // Starship specific fields
              if (swapiData.hyperdrive_rating) {
                enhancedEntity.hyperdrive_rating =
                  swapiData.hyperdrive_rating !== "unknown" ? swapiData.hyperdrive_rating : undefined
              }
              if (swapiData.MGLT) {
                enhancedEntity.MGLT = swapiData.MGLT !== "unknown" ? swapiData.MGLT : undefined
              }

              // Resolve films
              if (swapiData.films && swapiData.films.length > 0) {
                enhancedEntity.films = await swapiService.resolveFilmTitles(swapiData.films)
              }

              enhancedEntity.swapiMatch = true
              console.log(`Successfully enhanced vehicle: ${entity.name}`)
            } else {
              console.log(`No SWAPI match found for vehicle: ${entity.name}`)
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
              console.log(`Found SWAPI match for species: ${entity.name}`)

              // Map exact SWAPI fields
              enhancedEntity.classification =
                swapiData.classification !== "unknown" ? swapiData.classification : undefined
              enhancedEntity.designation = swapiData.designation !== "unknown" ? swapiData.designation : undefined
              enhancedEntity.average_height =
                swapiData.average_height !== "unknown" ? swapiData.average_height : undefined
              enhancedEntity.average_lifespan =
                swapiData.average_lifespan !== "unknown" ? swapiData.average_lifespan : undefined
              enhancedEntity.language = swapiData.language !== "unknown" ? swapiData.language : undefined
              enhancedEntity.skin_colors = swapiData.skin_colors !== "unknown" ? swapiData.skin_colors : undefined
              enhancedEntity.hair_colors = swapiData.hair_colors !== "unknown" ? swapiData.hair_colors : undefined
              enhancedEntity.eye_colors = swapiData.eye_colors !== "unknown" ? swapiData.eye_colors : undefined

              // Resolve homeworld if available
              if (swapiData.homeworld) {
                try {
                  enhancedEntity.homeworld = await swapiService.getPlanetName(swapiData.homeworld)
                } catch (error) {
                  console.warn(`Failed to resolve homeworld for ${entity.name}:`, error)
                }
              }

              // Resolve films
              if (swapiData.films && swapiData.films.length > 0) {
                enhancedEntity.films = await swapiService.resolveFilmTitles(swapiData.films)
              }

              enhancedEntity.swapiMatch = true
              console.log(`Successfully enhanced species: ${entity.name}`)
            } else {
              console.log(`No SWAPI match found for species: ${entity.name}`)
            }
          } catch (error) {
            console.warn(`Failed to enhance species ${entity.name}:`, error)
          }
          break

        case "locations":
          try {
            swapiData = await swapiService.searchPlanets(entity.name)
            if (swapiData) {
              console.log(`Found SWAPI match for location: ${entity.name}`)

              // Map exact SWAPI fields
              enhancedEntity.climate = swapiData.climate !== "unknown" ? swapiData.climate : undefined
              enhancedEntity.terrain = swapiData.terrain !== "unknown" ? swapiData.terrain : undefined
              enhancedEntity.population = swapiData.population !== "unknown" ? swapiData.population : undefined
              enhancedEntity.diameter = swapiData.diameter !== "unknown" ? swapiData.diameter : undefined
              enhancedEntity.rotation_period =
                swapiData.rotation_period !== "unknown" ? swapiData.rotation_period : undefined
              enhancedEntity.orbital_period =
                swapiData.orbital_period !== "unknown" ? swapiData.orbital_period : undefined
              enhancedEntity.gravity = swapiData.gravity !== "unknown" ? swapiData.gravity : undefined
              enhancedEntity.surface_water = swapiData.surface_water !== "unknown" ? swapiData.surface_water : undefined

              // Resolve films
              if (swapiData.films && swapiData.films.length > 0) {
                enhancedEntity.films = await swapiService.resolveFilmTitles(swapiData.films)
              }

              enhancedEntity.swapiMatch = true
              console.log(`Successfully enhanced location: ${entity.name}`)
            } else {
              console.log(`No SWAPI match found for location: ${entity.name}`)
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

    // Log the enhanced entity data
    console.log(
      `Enhanced entity ${entity.name} has fields:`,
      Object.keys(enhancedEntity).filter((key) => enhancedEntity[key as keyof EnhancedEntity] !== undefined),
    )

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

      console.log(`Enhancing ${response.data.data.length} ${entityType} entities with SWAPI data...`)

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

      const enhancedCount = successfulEnhancements.filter((entity) => entity.swapiMatch).length
      console.log(`Successfully enhanced ${enhancedCount}/${successfulEnhancements.length} entities with SWAPI data`)

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
