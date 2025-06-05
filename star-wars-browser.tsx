"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Eye, User, Calendar, Ruler } from "lucide-react"
import Image from "next/image"

// Mock Star Wars character data
const mockCharacters = [
  { id: 1, name: "Luke Skywalker", height: "172", birth_year: "19BBY", gender: "male" },
  { id: 2, name: "C-3PO", height: "167", birth_year: "112BBY", gender: "n/a" },
  { id: 3, name: "R2-D2", height: "96", birth_year: "33BBY", gender: "n/a" },
  { id: 4, name: "Darth Vader", height: "202", birth_year: "41.9BBY", gender: "male" },
  { id: 5, name: "Leia Organa", height: "150", birth_year: "19BBY", gender: "female" },
  { id: 6, name: "Owen Lars", height: "178", birth_year: "52BBY", gender: "male" },
  { id: 7, name: "Beru Whitesun lars", height: "165", birth_year: "47BBY", gender: "female" },
  { id: 8, name: "R5-D4", height: "97", birth_year: "unknown", gender: "n/a" },
  { id: 9, name: "Biggs Darklighter", height: "183", birth_year: "24BBY", gender: "male" },
  { id: 10, name: "Obi-Wan Kenobi", height: "182", birth_year: "57BBY", gender: "male" },
  { id: 11, name: "Anakin Skywalker", height: "188", birth_year: "41.9BBY", gender: "male" },
  { id: 12, name: "Wilhuff Tarkin", height: "180", birth_year: "64BBY", gender: "male" },
  { id: 13, name: "Chewbacca", height: "228", birth_year: "200BBY", gender: "male" },
  { id: 14, name: "Han Solo", height: "180", birth_year: "29BBY", gender: "male" },
  { id: 15, name: "Greedo", height: "173", birth_year: "44BBY", gender: "male" },
  { id: 16, name: "Jabba Desilijic Tiure", height: "175", birth_year: "600BBY", gender: "hermaphrodite" },
  { id: 17, name: "Wedge Antilles", height: "170", birth_year: "21BBY", gender: "male" },
  { id: 18, name: "Jek Tono Porkins", height: "180", birth_year: "unknown", gender: "male" },
  { id: 19, name: "Yoda", height: "66", birth_year: "896BBY", gender: "male" },
  { id: 20, name: "Palpatine", height: "170", birth_year: "82BBY", gender: "male" },
]

const CHARACTERS_PER_PAGE = 9

export default function StarWarsBrowser() {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(mockCharacters.length / CHARACTERS_PER_PAGE)
  const startIndex = (currentPage - 1) * CHARACTERS_PER_PAGE
  const endIndex = startIndex + CHARACTERS_PER_PAGE
  const currentCharacters = mockCharacters.slice(startIndex, endIndex)

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
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">Star Wars Characters</h1>
        <p className="text-muted-foreground">Explore the galaxy far, far away...</p>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentCharacters.map((character) => (
          <Card
            key={character.id}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border"
          >
            <CardHeader className="pb-3">
              <div className="relative w-full h-48 mb-3 overflow-hidden rounded-md bg-muted">
                <Image
                  src={`https://starwars-visualguide.com/assets/img/characters/${character.id}.jpg`}
                  alt={character.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={handleImageError}
                />
              </div>
              <CardTitle className="text-xl font-bold text-center group-hover:text-primary transition-colors">
                {character.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Ruler className="w-4 h-4" />
                <span>Height: {character.height === "unknown" ? "Unknown" : `${character.height} cm`}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Born: {character.birth_year}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <Badge variant="secondary" className={getGenderColor(character.gender)}>
                  {character.gender === "n/a" ? "Droid" : character.gender}
                </Badge>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <PaginationItem key={page}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return null
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Results Info */}
      <div className="text-center mt-6 text-sm text-muted-foreground">
        Showing {startIndex + 1}-{Math.min(endIndex, mockCharacters.length)} of {mockCharacters.length} characters
      </div>
    </div>
  )
}
