"use client"

import type React from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Calendar,
  Ruler,
  User,
  MapPin,
  Building,
  Rocket,
  Film,
  Weight,
  Globe,
  Users,
  Thermometer,
  Mountain,
  Compass,
  PenToolIcon as Tool,
} from "lucide-react"
import Image from "next/image"
import type { EnhancedEntity } from "@/services/enhancedTypes"
import type { EntityType } from "@/services/types"

interface EnhancedEntityCardProps {
  entity: EnhancedEntity
  entityType: EntityType
  onViewDetails?: (entity: EnhancedEntity) => void
}

export default function EnhancedEntityCard({ entity, entityType, onViewDetails }: EnhancedEntityCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/placeholder.svg?height=200&width=150"
  }

  const getEntityIcon = () => {
    switch (entityType) {
      case "characters":
        return <User className="w-4 h-4" />
      case "creatures":
        return <span className="text-sm">🐉</span>
      case "droids":
        return <span className="text-sm">🤖</span>
      case "locations":
        return <MapPin className="w-4 h-4" />
      case "organizations":
        return <Building className="w-4 h-4" />
      case "species":
        return <span className="text-sm">👽</span>
      case "vehicles":
        return <Rocket className="w-4 h-4" />
      default:
        return <Eye className="w-4 h-4" />
    }
  }

  const getEntitySpecificInfo = () => {
    const infoItems = []

    switch (entityType) {
      case "characters":
        // Physical characteristics from SWAPI
        if (entity.height && entity.height !== "unknown") {
          infoItems.push(
            <div key="height" className="flex items-center gap-2 text-sm text-gray-300">
              <Ruler className="w-4 h-4" />
              <span>Height: {entity.height}cm</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.mass && entity.mass !== "unknown") {
          infoItems.push(
            <div key="mass" className="flex items-center gap-2 text-sm text-gray-300">
              <Weight className="w-4 h-4" />
              <span>Mass: {entity.mass}kg</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.gender && entity.gender !== "n/a") {
          infoItems.push(
            <div key="gender" className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-300" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {entity.gender}
              </Badge>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.birth_year && entity.birth_year !== "unknown") {
          infoItems.push(
            <div key="birth_year" className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>Born: {entity.birth_year}</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.homeworld) {
          infoItems.push(
            <div key="homeworld" className="flex items-center gap-2 text-sm text-gray-300">
              <Globe className="w-4 h-4" />
              <span>Homeworld: {entity.homeworld}</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        // Physical appearance from SWAPI
        if (entity.eye_color && entity.eye_color !== "unknown") {
          infoItems.push(
            <div key="eye_color" className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                Eyes: {entity.eye_color}
              </Badge>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.hair_color && entity.hair_color !== "unknown") {
          infoItems.push(
            <div key="hair_color" className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-400 border-amber-400">
                Hair: {entity.hair_color}
              </Badge>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        break

      case "droids":
        if (entity.height && entity.height !== "unknown") {
          infoItems.push(
            <div key="height" className="flex items-center gap-2 text-sm text-gray-300">
              <Ruler className="w-4 h-4" />
              <span>Height: {entity.height}cm</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.mass && entity.mass !== "unknown") {
          infoItems.push(
            <div key="mass" className="flex items-center gap-2 text-sm text-gray-300">
              <Weight className="w-4 h-4" />
              <span>Mass: {entity.mass}kg</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.model) {
          infoItems.push(
            <div key="model" className="flex items-center gap-2 text-sm text-gray-300">
              <Tool className="w-4 h-4" />
              <span>Model: {entity.model}</span>
            </div>,
          )
        }
        if (entity.manufacturer) {
          infoItems.push(
            <div key="manufacturer" className="flex items-center gap-2">
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                {entity.manufacturer}
              </Badge>
            </div>,
          )
        }
        break

      case "vehicles":
        if (entity.model) {
          infoItems.push(
            <div key="model" className="flex items-center gap-2 text-sm text-gray-300">
              <Rocket className="w-4 h-4" />
              <span>Model: {entity.model}</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.manufacturer) {
          infoItems.push(
            <div key="manufacturer" className="flex items-center gap-2">
              <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                {entity.manufacturer}
              </Badge>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.vehicle_class || entity.starship_class) {
          infoItems.push(
            <div key="class" className="flex items-center gap-2">
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                {entity.vehicle_class || entity.starship_class}
              </Badge>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.length && entity.length !== "unknown") {
          infoItems.push(
            <div key="length" className="flex items-center gap-2 text-sm text-gray-300">
              <Ruler className="w-4 h-4" />
              <span>Length: {entity.length}m</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.crew && entity.crew !== "unknown") {
          infoItems.push(
            <div key="crew" className="flex items-center gap-2 text-sm text-gray-300">
              <Users className="w-4 h-4" />
              <span>Crew: {entity.crew}</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.passengers && entity.passengers !== "unknown") {
          infoItems.push(
            <div key="passengers" className="flex items-center gap-2 text-sm text-gray-300">
              <User className="w-4 h-4" />
              <span>Passengers: {entity.passengers}</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.hyperdrive_rating && entity.hyperdrive_rating !== "unknown") {
          infoItems.push(
            <div key="hyperdrive" className="flex items-center gap-2">
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                Hyperdrive: Class {entity.hyperdrive_rating}
              </Badge>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.max_atmosphering_speed && entity.max_atmosphering_speed !== "unknown") {
          infoItems.push(
            <div key="speed" className="flex items-center gap-2 text-sm text-gray-300">
              <Compass className="w-4 h-4" />
              <span>Max Speed: {entity.max_atmosphering_speed} km/h</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        break

      case "species":
      case "creatures":
        if (entity.classification) {
          infoItems.push(
            <div key="classification" className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-400 border-green-400">
                {entity.classification}
              </Badge>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.designation) {
          infoItems.push(
            <div key="designation" className="flex items-center gap-2">
              <Badge variant="outline" className="text-teal-400 border-teal-400">
                {entity.designation}
              </Badge>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.average_lifespan && entity.average_lifespan !== "unknown") {
          infoItems.push(
            <div key="lifespan" className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>Lifespan: {entity.average_lifespan} years</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.language && entity.language !== "unknown") {
          infoItems.push(
            <div key="language" className="flex items-center gap-2 text-sm text-gray-300">
              <Globe className="w-4 h-4" />
              <span>Language: {entity.language}</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.average_height && entity.average_height !== "unknown") {
          infoItems.push(
            <div key="height" className="flex items-center gap-2 text-sm text-gray-300">
              <Ruler className="w-4 h-4" />
              <span>Avg. Height: {entity.average_height}cm</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.homeworld) {
          infoItems.push(
            <div key="homeworld" className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4" />
              <span>Homeworld: {entity.homeworld}</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        break

      case "locations":
        if (entity.climate && entity.climate !== "unknown") {
          infoItems.push(
            <div key="climate" className="flex items-center gap-2">
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                <Thermometer className="w-3 h-3 mr-1" />
                {entity.climate}
              </Badge>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.terrain && entity.terrain !== "unknown") {
          infoItems.push(
            <div key="terrain" className="flex items-center gap-2 text-sm text-gray-300">
              <Mountain className="w-4 h-4" />
              <span>Terrain: {entity.terrain}</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.population && entity.population !== "unknown") {
          infoItems.push(
            <div key="population" className="flex items-center gap-2 text-sm text-gray-300">
              <Users className="w-4 h-4" />
              <span>Population: {formatLargeNumber(entity.population)}</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.diameter && entity.diameter !== "unknown") {
          infoItems.push(
            <div key="diameter" className="flex items-center gap-2 text-sm text-gray-300">
              <Compass className="w-4 h-4" />
              <span>Diameter: {formatLargeNumber(entity.diameter)}km</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.gravity && entity.gravity !== "unknown") {
          infoItems.push(
            <div key="gravity" className="flex items-center gap-2 text-sm text-gray-300">
              <Weight className="w-4 h-4" />
              <span>Gravity: {entity.gravity}</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.rotation_period && entity.rotation_period !== "unknown") {
          infoItems.push(
            <div key="rotation" className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>Day: {entity.rotation_period}h</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        if (entity.orbital_period && entity.orbital_period !== "unknown") {
          infoItems.push(
            <div key="orbital" className="flex items-center gap-2 text-sm text-gray-300">
              <Globe className="w-4 h-4" />
              <span>Year: {entity.orbital_period} days</span>
              {entity.swapiMatch && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  SWAPI
                </Badge>
              )}
            </div>,
          )
        }
        break

      case "organizations":
        // Organizations don't have SWAPI data, show Databank info
        break
    }

    return infoItems
  }

  // Add this new function to show additional SWAPI details
  const getSwapiEnhancementDetails = () => {
    if (!entity.swapiMatch) return null

    const enhancementItems = []

    // Show additional SWAPI-specific data that doesn't fit in the main info
    if (entity.skin_color && entity.skin_color !== "unknown") {
      enhancementItems.push(
        <Badge key="skin" variant="outline" className="text-xs text-pink-400 border-pink-400">
          Skin: {entity.skin_color}
        </Badge>,
      )
    }

    if (entity.consumables && entity.consumables !== "unknown") {
      enhancementItems.push(
        <Badge key="consumables" variant="outline" className="text-xs text-indigo-400 border-indigo-400">
          Supplies: {entity.consumables}
        </Badge>,
      )
    }

    if (entity.cargo_capacity && entity.cargo_capacity !== "unknown") {
      enhancementItems.push(
        <Badge key="cargo" variant="outline" className="text-xs text-emerald-400 border-emerald-400">
          Cargo: {formatLargeNumber(entity.cargo_capacity)}kg
        </Badge>,
      )
    }

    if (entity.cost_in_credits && entity.cost_in_credits !== "unknown") {
      enhancementItems.push(
        <Badge key="cost" variant="outline" className="text-xs text-yellow-400 border-yellow-400">
          Cost: {formatLargeNumber(entity.cost_in_credits)} credits
        </Badge>,
      )
    }

    if (entity.surface_water && entity.surface_water !== "unknown") {
      enhancementItems.push(
        <Badge key="water" variant="outline" className="text-xs text-blue-400 border-blue-400">
          Water: {entity.surface_water}%
        </Badge>,
      )
    }

    if (enhancementItems.length === 0) return null

    return (
      <div className="space-y-2">
        <p className="text-xs text-green-400 font-medium">Additional SWAPI Data:</p>
        <div className="flex flex-wrap gap-1">{enhancementItems}</div>
      </div>
    )
  }

  // Helper function to format large numbers
  const formatLargeNumber = (numStr: string): string => {
    const num = Number.parseInt(numStr, 10)
    if (isNaN(num)) return numStr

    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + "B"
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return numStr
  }

  return (
    <Card className="group hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:-translate-y-1 border-slate-700 bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="relative w-full h-48 mb-3 overflow-hidden rounded-md bg-slate-700">
          <Image
            src={entity.image || "/placeholder.svg?height=200&width=150"}
            alt={entity.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
          {entity.swapiMatch && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-500 text-white text-xs">Enhanced</Badge>
            </div>
          )}
        </div>
        <CardTitle className="text-xl font-bold text-center group-hover:text-yellow-400 transition-colors text-white">
          {entity.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {getEntitySpecificInfo()}

        {/* Additional SWAPI Enhancement Details */}
        {getSwapiEnhancementDetails()}

        {/* Films */}
        {entity.films.length > 0 && (
          <div className="flex items-start gap-2">
            <Film className="w-4 h-4 text-gray-300 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                Films:
                {entity.swapiMatch && (
                  <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                    SWAPI
                  </Badge>
                )}
              </p>
              <div className="flex flex-wrap gap-1">
                {entity.films.slice(0, 3).map((film, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                    {film}
                  </Badge>
                ))}
                {entity.films.length > 3 && (
                  <Badge variant="outline" className="text-xs text-gray-400 border-gray-400">
                    +{entity.films.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced data indicator */}
        {entity.swapiMatch && (
          <div className="pt-2 border-t border-slate-600">
            <div className="flex items-center gap-2 text-xs text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Enhanced with SWAPI data</span>
              <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                {new Date(entity.enhancedAt).toLocaleDateString()}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full group-hover:bg-yellow-500 group-hover:text-black transition-colors bg-slate-700 text-white border-slate-600 hover:bg-yellow-500 hover:text-black"
          variant="outline"
          onClick={() => onViewDetails?.(entity)}
        >
          {getEntityIcon()}
          <span className="ml-2">View Details</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
