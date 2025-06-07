"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Loader2, Users, Database, Zap } from "lucide-react"
import { swapiProxyService } from "@/services/swapiProxyService"
import type { EnhancedCharacter } from "@/services/types"
import CharacterCard from "@/components/CharacterCard"

export default function StarWarsBrowser() {
  const [characters, setCharacters] = useState<EnhancedCharacter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCharacters, setTotalCharacters] = useState(0)

  const fetchCharacters = async (page: number) => {
    try {
      setLoading(true)
      setError(null)

      const response = await swapiProxyService.getEnhancedCharacters(page)

      if (response.success) {
        setCharacters(response.data.characters)
        setTotalPages(response.data.pagination.totalPages)
        setTotalCharacters(response.data.pagination.count)
        setCurrentPage(response.data.pagination.currentPage)
      } else {
        setError(response.error || "Failed to fetch characters")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.")
      console.error("Error fetching characters:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharacters(currentPage)
  }, [currentPage])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleViewDetails = (character: EnhancedCharacter) => {
    // TODO: Implement detail modal or navigation
    console.log("View details for:", character)
  }

  if (error) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                onClick={() => fetchCharacters(currentPage)}
                className="bg-yellow-500 text-black hover:bg-yellow-400"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated Space Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-star-wars text-5xl font-bold text-yellow-500 mb-4 drop-shadow-lg">
              Star Wars Characters
            </h1>
            <p className="text-yellow-500 text-lg mb-4">Enhanced with SWAPI & Databank APIs</p>

            {/* API Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="text-white font-semibold">SWAPI</h3>
                  <p className="text-sm text-gray-400">Character data & stats</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Database className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-white font-semibold">SW Databank</h3>
                  <p className="text-sm text-gray-400">Descriptions & images</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <h3 className="text-white font-semibold">Enhanced</h3>
                  <p className="text-sm text-gray-400">Combined experience</p>
                </CardContent>
              </Card>
            </div>

            {totalCharacters > 0 && (
              <p className="text-sm text-gray-400">
                {totalCharacters} characters across {totalPages} pages
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto mb-4" />
                <p className="text-white">Loading characters...</p>
                <p className="text-sm text-gray-400 mt-2">Fetching from SWAPI and enhancing with Databank</p>
              </div>
            </div>
          ) : (
            <>
              {/* Character Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {characters.map((character, index) => (
                  <CharacterCard
                    key={`${character.name}-${index}`}
                    character={character}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2">
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={`text-white hover:bg-slate-700 ${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                                className={`cursor-pointer text-white hover:bg-slate-700 ${currentPage === page ? "bg-yellow-500 text-black hover:bg-yellow-400" : ""}`}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis className="text-gray-400" />
                            </PaginationItem>
                          )
                        }
                        return null
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={`text-white hover:bg-slate-700 ${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              {/* Results Info */}
              <div className="text-center mt-6 text-sm text-gray-300">
                Showing page {currentPage} of {totalPages} ({totalCharacters} total characters)
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
