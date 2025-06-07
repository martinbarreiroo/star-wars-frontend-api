"use client"

import type React from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar, Ruler, User, Weight, Palette } from "lucide-react"
import Image from "next/image"
import type { EnhancedCharacter } from "@/services/types"

interface CharacterCardProps {
  character: EnhancedCharacter
  onViewDetails?: (character: EnhancedCharacter) => void
}

export default function CharacterCard({ character, onViewDetails }: CharacterCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/placeholder.svg?height=200&width=150"
  }

  const getGenderColor = (gender: string) => {
    switch (gender.toLowerCase()) {
      case "male":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "female":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className="group hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:-translate-y-1 border-slate-700 bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="relative w-full h-48 mb-3 overflow-hidden rounded-md bg-slate-700">
          <Image
            src={character.image || "/placeholder.svg?height=200&width=150"}
            alt={character.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
        </div>
        <CardTitle className="text-xl font-bold text-center group-hover:text-yellow-400 transition-colors text-white">
          {character.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Physical Characteristics */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {character.height !== "unknown" && (
            <div className="flex items-center gap-2 text-gray-300">
              <Ruler className="w-4 h-4" />
              <span>{character.height}cm</span>
            </div>
          )}
          {character.mass !== "unknown" && (
            <div className="flex items-center gap-2 text-gray-300">
              <Weight className="w-4 h-4" />
              <span>{character.mass}kg</span>
            </div>
          )}
        </div>

        {/* Gender and Birth Year */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className={getGenderColor(character.gender)}>
            {character.gender}
          </Badge>
          {character.birth_year !== "unknown" && (
            <div className="flex items-center gap-1 text-sm text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>{character.birth_year}</span>
            </div>
          )}
        </div>

        {/* Physical Features */}
        <div className="space-y-1 text-xs text-gray-400">
          {character.hair_color !== "unknown" && character.hair_color !== "n/a" && (
            <div className="flex items-center gap-2">
              <Palette className="w-3 h-3" />
              <span>Hair: {character.hair_color}</span>
            </div>
          )}
          {character.eye_color !== "unknown" && (
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3" />
              <span>Eyes: {character.eye_color}</span>
            </div>
          )}
          {character.skin_color !== "unknown" && (
            <div className="flex items-center gap-2">
              <User className="w-3 h-3" />
              <span>Skin: {character.skin_color}</span>
            </div>
          )}
        </div>

        {/* Description from Databank */}
        {character.description && (
          <p className="text-xs text-gray-400 line-clamp-3 mt-3 p-2 bg-slate-900/50 rounded">{character.description}</p>
        )}

        {/* Data Sources */}
        <div className="flex gap-1 mt-2">
          <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
            SWAPI
          </Badge>
          {character.description && (
            <Badge variant="outline" className="text-purple-400 border-purple-400 text-xs">
              Databank
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full group-hover:bg-yellow-500 group-hover:text-black transition-colors bg-slate-700 text-white border-slate-600 hover:bg-yellow-500 hover:text-black"
          variant="outline"
          onClick={() => onViewDetails?.(character)}
        >
          <Eye className="w-4 h-4 mr-2" />
          <span>View Details</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
