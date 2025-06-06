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

  // Basic description section
  const renderDescription = () => {
    if (!entity.description) return null

    return (
      <div className="mt-2">
        <p className="text-xs text-gray-400 line-clamp-2">{entity.description}</p>
      </div>
    )
  }

  // Character specific info
  const renderCharacterInfo = () => {
    if (entityType !== "characters") return null

    return (
      <div className="space-y-2">
        {entity.height && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Ruler className="w-4 h-4" />
            <span>Height: {entity.height}cm</span>
          </div>
        )}
        {entity.mass && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Weight className="w-4 h-4" />
            <span>Mass: {entity.mass}kg</span>
          </div>
        )}
        {entity.gender && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-300" />
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {entity.gender}
            </Badge>
          </div>
        )}
        {entity.birth_year && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>Born: {entity.birth_year}</span>
          </div>
        )}
      </div>
    )
  }

  // Vehicle specific info
  const renderVehicleInfo = () => {
    if (entityType !== "vehicles") return null

    return (
      <div className="space-y-2">
        {entity.model && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Rocket className="w-4 h-4" />
            <span>Model: {entity.model}</span>
          </div>
        )}
        {entity.manufacturer && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              {entity.manufacturer}
            </Badge>
          </div>
        )}
        {(entity.vehicle_class || entity.starship_class) && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              {entity.vehicle_class || entity.starship_class}
            </Badge>
          </div>
        )}
      </div>
    )
  }

  // Species specific info
  const renderSpeciesInfo = () => {
    if (entityType !== "species" && entityType !== "creatures") return null

    return (
      <div className="space-y-2">
        {entity.classification && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              {entity.classification}
            </Badge>
          </div>
        )}
        {entity.language && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Globe className="w-4 h-4" />
            <span>Language: {entity.language}</span>
          </div>
        )}
      </div>
    )
  }

  // Location specific info
  const renderLocationInfo = () => {
    if (entityType !== "locations") return null

    return (
      <div className="space-y-2">
        {entity.climate && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-orange-400 border-orange-400">
              <Thermometer className="w-3 h-3 mr-1" />
              {entity.climate}
            </Badge>
          </div>
        )}
        {entity.terrain && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Mountain className="w-4 h-4" />
            <span>Terrain: {entity.terrain}</span>
          </div>
        )}
        {entity.population && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Users className="w-4 h-4" />
            <span>Population: {formatLargeNumber(entity.population)}</span>
          </div>
        )}
      </div>
    )
  }

  // Droid specific info
  const renderDroidInfo = () => {
    if (entityType !== "droids") return null

    return (
      <div className="space-y-2">
        {entity.height && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Ruler className="w-4 h-4" />
            <span>Height: {entity.height}cm</span>
          </div>
        )}
        {entity.model && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Tool className="w-4 h-4" />
            <span>Model: {entity.model}</span>
          </div>
        )}
        {entity.manufacturer && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              {entity.manufacturer}
            </Badge>
          </div>
        )}
      </div>
    )
  }

  // Films section
  const renderFilms = () => {
    if (!entity.films || entity.films.length === 0) return null

    return (
      <div className="flex items-start gap-2">
        <Film className="w-4 h-4 text-gray-300 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">Films:</p>
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
    )
  }

  // SWAPI enhancement indicator
  const renderSwapiIndicator = () => {
    if (!entity.swapiMatch) return null

    return (
      <div className="pt-2 border-t border-slate-600">
        <div className="flex items-center gap-2 text-xs text-green-400">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span>Enhanced with SWAPI data</span>
        </div>
      </div>
    )
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
        {/* Basic description */}
        {renderDescription()}

        {/* Entity type specific info */}
        {renderCharacterInfo()}
        {renderVehicleInfo()}
        {renderSpeciesInfo()}
        {renderLocationInfo()}
        {renderDroidInfo()}

        {/* Films */}
        {renderFilms()}

        {/* SWAPI indicator */}
        {renderSwapiIndicator()}
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
