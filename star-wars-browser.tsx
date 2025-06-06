"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2, Menu, X } from "lucide-react";
import { starWarsServices } from "@/services/starWarsService";
import { BaseEntity, EntityType, ENTITY_CATEGORIES } from "@/services/types";
import StarWarsSidebar from "@/components/StarWarsSidebar";
import EntityCard from "@/components/EntityCard";

export default function StarWarsBrowser() {
  const [entities, setEntities] = useState<BaseEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntities, setTotalEntities] = useState(0);
  const [selectedCategory, setSelectedCategory] =
    useState<EntityType>("characters");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchEntities = async (
    page: number,
    category: EntityType,
    search?: string,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const service = starWarsServices[category];
      const response = await service.getEntities({
        page,
        limit: 9,
        search: search || undefined,
      });

      if (response.success) {
        setEntities(response.data.data);
        setTotalPages(
          Math.ceil(response.data.info.total / response.data.info.limit),
        );
        setTotalEntities(response.data.info.total);
        setCurrentPage(response.data.info.page);
      } else {
        setError(response.error || `Failed to fetch ${category}`);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error(`Error fetching ${category}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities(1, selectedCategory, searchQuery);
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchEntities(currentPage, selectedCategory, searchQuery);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCategoryChange = (category: EntityType) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleViewDetails = (entity: BaseEntity) => {
    // TODO: Implement detail modal or navigation
    console.log("View details for:", entity);
  };

  const getCurrentCategoryLabel = () => {
    return (
      ENTITY_CATEGORIES.find((cat) => cat.type === selectedCategory)?.label ||
      "Items"
    );
  };

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
                onClick={() =>
                  fetchEntities(currentPage, selectedCategory, searchQuery)
                }
                className="bg-yellow-500 text-black hover:bg-yellow-400"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
          <StarWarsSidebar
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
            onSearchClear={handleSearchClear}
            isCollapsed={sidebarCollapsed}
          />
        </div>

        {/* Mobile Sidebar Toggle */}
        <Button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="fixed top-4 left-4 z-30 md:hidden bg-slate-800/80 backdrop-blur-sm text-white hover:bg-slate-700"
          size="icon"
        >
          {sidebarCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-80"}`}
        >
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8 text-center">
              <h1 className="font-star-wars text-4xl font-bold text-yellow-500 mb-2 drop-shadow-lg">
                Star Wars {getCurrentCategoryLabel()}
              </h1>
              <p className="text-yellow-500">
                Explore the galaxy far, far away...
              </p>
              {totalEntities > 0 && (
                <p className="text-sm text-gray-400 mt-2">
                  {totalEntities} {getCurrentCategoryLabel().toLowerCase()} in
                  the databank
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto mb-4" />
                  <p className="text-white">
                    Loading {getCurrentCategoryLabel().toLowerCase()}...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Entity Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {entities.map((entity) => (
                    <EntityCard
                      key={entity._id}
                      entity={entity}
                      entityType={selectedCategory}
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

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => {
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
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis className="text-gray-400" />
                              </PaginationItem>
                            );
                          }
                          return null;
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
                  Showing page {currentPage} of {totalPages} ({totalEntities}{" "}
                  total {getCurrentCategoryLabel().toLowerCase()})
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
