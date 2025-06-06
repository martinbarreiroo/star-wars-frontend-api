"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, User, Calendar, Ruler, Loader2 } from "lucide-react";
import Image from "next/image";

// Types based on the API structure
interface Character {
  _id: string;
  name: string;
  description: string;
  image: string;
  affiliations?: string[];
  species?: string;
  gender?: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  eye_color?: string;
  skin_color?: string;
  birth_year?: string;
  homeworld?: string;
}

interface ApiResponse {
  info: {
    total: number;
    page: number;
    limit: number;
    next: string | null;
    prev: string | null;
  };
  data: Character[];
}

const API_BASE_URL = "https://starwars-databank-server.vercel.app/api/v1";

export default function StarWarsBrowser() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCharacters, setTotalCharacters] = useState(0);

  const fetchCharacters = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<ApiResponse>(
        `${API_BASE_URL}/characters`,
        {
          params: {
            page: page,
            limit: 9,
          },
        },
      );

      setCharacters(response.data.data);
      setTotalPages(
        Math.ceil(response.data.info.total / response.data.info.limit),
      );
      setTotalCharacters(response.data.info.total);
      setCurrentPage(response.data.info.page);
    } catch (err) {
      setError("Failed to fetch characters. Please try again later.");
      console.error("Error fetching characters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "/placeholder.svg?height=200&width=150";
  };

  const getGenderColor = (gender?: string) => {
    if (!gender)
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";

    switch (gender.toLowerCase()) {
      case "male":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "female":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const formatHeight = (height?: string) => {
    if (!height || height === "unknown") return "Unknown";
    return height.includes("cm") ? height : `${height} cm`;
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
                onClick={() => fetchCharacters(currentPage)}
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

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-star-wars text-4xl font-bold text-yellow-500 mb-2 drop-shadow-lg">
            Star Wars Characters
          </h1>
          <p className="text-yellow-500">Explore the galaxy far, far away...</p>
          {totalCharacters > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              {totalCharacters} characters in the databank
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto mb-4" />
              <p className="text-white">Loading characters...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Character Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {characters.map((character) => (
                <Card
                  key={character._id}
                  className="group hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:-translate-y-1 border-slate-700 bg-slate-800/80 backdrop-blur-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="relative w-full h-48 mb-3 overflow-hidden rounded-md bg-slate-700">
                      <Image
                        src={
                          character.image ||
                          "/placeholder.svg?height=200&width=150"
                        }
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
                    {character.height && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Ruler className="w-4 h-4" />
                        <span>Height: {formatHeight(character.height)}</span>
                      </div>
                    )}

                    {character.birth_year && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>Born: {character.birth_year}</span>
                      </div>
                    )}

                    {character.gender && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-300" />
                        <Badge
                          variant="secondary"
                          className={getGenderColor(character.gender)}
                        >
                          {character.gender}
                        </Badge>
                      </div>
                    )}

                    {character.species && (
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-gray-300 border-gray-600"
                        >
                          {character.species}
                        </Badge>
                      </div>
                    )}

                    {character.description && (
                      <p className="text-xs text-gray-400 line-clamp-3">
                        {character.description}
                      </p>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full group-hover:bg-yellow-500 group-hover:text-black transition-colors bg-slate-700 text-white border-slate-600 hover:bg-yellow-500 hover:text-black"
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

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
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
                      },
                    )}

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
              Showing page {currentPage} of {totalPages} ({totalCharacters}{" "}
              total characters)
            </div>
          </>
        )}
      </div>
    </div>
  );
}
