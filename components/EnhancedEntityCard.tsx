"use client"

import type React from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar, Ruler, User, MapPin, Building, Rocket, Film, Weight, Globe, Users } from "lucide-react"
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
      case "droids":
        if (entity.height && entity.height !== "unknown") {
          infoItems.push(
            <div key="height" className="flex items-center gap-2 text-sm text-gray-300">
              <Ruler className="w-4 h-4" />
              <span>Height: {entity.height}cm</span>
            </div>,
          )
        }
        if (entity.mass && entity.mass !== "unknown") {
          infoItems.push(
            <div key="mass" className="flex items-center gap-2 text-sm text-gray-300">
              <Weight className="w-4 h-4" />
              <span>Mass: {entity.mass}kg</span>
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
            </div>,
          )
        }
        if (entity.manufacturer) {
          infoItems.push(
            <div key="manufacturer" className="flex items-center gap-2">
              <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                {entity.manufacturer}
              </Badge>
            </div>,
          )
        }
        if (entity.vehicle_class) {
          infoItems.push(
            <div key="class" className="flex items-center gap-2">
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                {entity.vehicle_class}
              </Badge>
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
            </div>,
          )
        }
        if (entity.average_lifespan && entity.average_lifespan !== "unknown") {
          infoItems.push(
            <div key="lifespan" className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>Lifespan: {entity.average_lifespan} years</span>
            </div>,
          )
        }
        if (entity.language) {
          infoItems.push(
            <div key="language" className="flex items-center gap-2 text-sm text-gray-300">
              <Globe className="w-4 h-4" />
              <span>Language: {entity.language}</span>
            </div>,
          )
        }
        break

      case "locations":
        if (entity.climate) {
          infoItems.push(
            <div key="climate" className="flex items-center gap-2">
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                {entity.climate}
              </Badge>
            </div>,
          )
        }
        if (entity.terrain) {
          infoItems.push(
            <div key="terrain" className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4" />
              <span>Terrain: {entity.terrain}</span>
            </div>,
          )
        }
        if (entity.population && entity.population !== "unknown") {
          infoItems.push(
            <div key="population" className="flex items-center gap-2 text-sm text-gray-300">
              <Users className="w-4 h-4" />
              <span>Population: {entity.population}</span>
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

        {/* Films */}
        {entity.films.length > 0 && (
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
