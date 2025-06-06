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
import { Loader2, Menu, X, AlertTriangle, RefreshCw } from "lucide-react"
import { enhancedStarWarsService } from "@/services/enhancedStarWarsService"
import { type EnhancedEntity, ENTITY_MAPPINGS } from "@/services/enhancedTypes"
import type { EntityType } from "@/services/types"
import EnhancedStarWarsSidebar from "@/components/EnhancedStarWarsSidebar"
import EnhancedEntityCard from "@/components/EnhancedEntityCard"
import { swapiService } from "@/services/swapiService"

export default function StarWarsBrowser() {
  const [entities, setEntities] = useState<EnhancedEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEntities, setTotalEntities] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<EntityType>("characters")
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [entityCounts, setEntityCounts] = useState<Record<EntityType, number>>({})
  const [swapiStatus, setSwapiStatus] = useState<"checking" | "available" | "unavailable">("checking")
  const [enhancementInProgress, setEnhancementInProgress] = useState(false)

  const fetchEntities = async (page: number, category: EntityType, search?: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log(`Fetching ${category} page ${page} with search: ${search || "none"}`)

      const response = await enhancedStarWarsService.getEnhancedEntities(category, {
        page,
        limit: 9,
        search: search || undefined,
      })

      if (response.success) {
        console.log(`Received ${response.data.data.length} enhanced entities`)

        // Log the first entity to see what data we have
        if (response.data.data.length > 0) {
          console.log("First entity data:", response.data.data[0])
        }

        setEntities(response.data.data)
        setTotalPages(Math.ceil(response.data.info.total / response.data.info.limit))
        setTotalEntities(response.data.info.total)
        setCurrentPage(response.data.info.page)

        // Update entity counts
        setEntityCounts((prev) => ({
          ...prev,
          [category]: response.data.info.total,
        }))
      } else {
        setError(response.error || `Failed to fetch ${category}`)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.")
      console.error(`Error fetching ${category}:`, err)
    } finally {
      setLoading(false)
    }
  }

  const checkSwapiStatus = async () => {
    try {
      setSwapiStatus("checking")
      const available = await swapiService.checkAvailability()
      setSwapiStatus(available ? "available" : "unavailable")
    } catch (error) {
      setSwapiStatus("unavailable")
    }
  }

  useEffect(() => {
    checkSwapiStatus()
  }, [])

  useEffect(() => {
    fetchEntities(1, selectedCategory, searchQuery)
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    fetchEntities(currentPage, selectedCategory, searchQuery)
  }, [currentPage])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleCategoryChange = (category: EntityType) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleSearchClear = () => {
    setSearchQuery("")
    setCurrentPage(1)
  }

  const handleViewDetails = (entity: EnhancedEntity) => {
    // TODO: Implement detail modal or navigation
    console.log("View details for:", entity)
  }

  const handleRetrySwapiConnection = async () => {
    setEnhancementInProgress(true)
    enhancedStarWarsService.retrySwapiConnection()
    enhancedStarWarsService.clearCache() // Clear cache to force re-enhancement
    await checkSwapiStatus()
    await fetchEntities(currentPage, selectedCategory, searchQuery)
    setEnhancementInProgress(false)
  }

  const getCurrentCategoryLabel = () => {
    return ENTITY_MAPPINGS.find((mapping) => mapping.databankType === selectedCategory)?.displayName || "Items"
  }

  const getEnhancedCount = () => {
    return entities.filter((entity) => entity.swapiMatch).length
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
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                onClick={() => fetchEntities(currentPage, selectedCategory, searchQuery)}
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

      {/* Layout with Sidebar */}
      <div className="relative z-10 flex">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full z-20 transition-transform duration-300 ${sidebarCollapsed ? "translate-x-0" : "translate-x-0"}`}
        >
          <EnhancedStarWarsSidebar
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
            onSearchClear={handleSearchClear}
            isCollapsed={sidebarCollapsed}
            entityCounts={entityCounts}
          />
        </div>

        {/* Mobile Sidebar Toggle */}
        <Button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="fixed top-4 left-4 z-30 md:hidden bg-slate-800/80 backdrop-blur-sm text-white hover:bg-slate-700"
          size="icon"
        >
          {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-80"}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8 text-center">
              <h1 className="font-star-wars text-4xl font-bold text-yellow-500 mb-2 drop-shadow-lg">
                Star Wars {getCurrentCategoryLabel()}
              </h1>
              <p className="text-yellow-500">Enhanced with SWAPI data • Explore the galaxy far, far away...</p>
              {totalEntities > 0 && (
                <div className="text-sm text-gray-400 mt-2 space-y-1">
                  <p>
                    {totalEntities} {getCurrentCategoryLabel().toLowerCase()} in the databank
                  </p>
                  {getEnhancedCount() > 0 && (
                    <p className="text-green-400">{getEnhancedCount()} enhanced with SWAPI data</p>
                  )}
                </div>
              )}
            </div>

            {/* SWAPI Status */}
            <div className="mb-6 flex justify-center">
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      swapiStatus === "available"
                        ? "bg-green-500"
                        : swapiStatus === "checking"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-300">SWAPI Status:</span>
                </div>
                {swapiStatus === "available" && <span className="text-sm text-green-400">Available</span>}
                {swapiStatus === "checking" && <span className="text-sm text-yellow-400">Checking...</span>}
                {swapiStatus === "unavailable" && <span className="text-sm text-red-400">Unavailable</span>}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRetrySwapiConnection}
                  disabled={enhancementInProgress || swapiStatus === "checking"}
                  className="ml-2"
                >
                  {enhancementInProgress ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-1" />
                  )}
                  Refresh SWAPI
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto mb-4" />
                  <p className="text-white">Loading and enhancing {getCurrentCategoryLabel().toLowerCase()}...</p>
                  <div className="text-sm text-gray-400 mt-2 space-y-1">
                    <p>Merging Databank and SWAPI data</p>
                    {swapiStatus === "checking" && <p className="text-blue-400">Checking SWAPI availability...</p>}
                    {swapiStatus === "available" && <p className="text-green-400">SWAPI enhancement active</p>}
                    {swapiStatus === "unavailable" && (
                      <div className="space-y-2">
                        <p className="text-orange-400">SWAPI unavailable - using Databank only</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleRetrySwapiConnection}
                          disabled={enhancementInProgress}
                          className="text-xs"
                        >
                          Retry SWAPI Connection
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Entity Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {entities.length > 0 ? (
                    entities.map((entity) => (
                      <EnhancedEntityCard
                        key={entity._id}
                        entity={entity}
                        entityType={selectedCategory}
                        onViewDetails={handleViewDetails}
                      />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12">
                      <p className="text-gray-400">No {getCurrentCategoryLabel().toLowerCase()} found</p>
                    </div>
                  )}
                </div>

                {/* Debug Info */}
                {entities.length > 0 && (
                  <div className="mb-8 p-4 bg-slate-800/80 backdrop-blur-sm rounded-lg">
                    <h3 className="text-sm font-medium text-yellow-500 mb-2">Debug Info:</h3>
                    <p className="text-xs text-gray-400">
                      First entity has {Object.keys(entities[0]).length} properties. SWAPI Match:{" "}
                      {entities[0].swapiMatch ? "Yes" : "No"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Properties: {Object.keys(entities[0]).join(", ")}</p>
                  </div>
                )}

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
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
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
                  Showing page {currentPage} of {totalPages} ({totalEntities} total{" "}
                  {getCurrentCategoryLabel().toLowerCase()})
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
