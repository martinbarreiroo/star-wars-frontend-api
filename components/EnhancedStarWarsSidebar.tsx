"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, X, Zap } from "lucide-react"
import type { EntityType } from "@/services/types"
import { ENTITY_MAPPINGS } from "@/services/enhancedTypes"

interface EnhancedStarWarsSidebarProps {
  selectedCategory: EntityType
  searchQuery: string
  onCategoryChange: (category: EntityType) => void
  onSearchChange: (query: string) => void
  onSearchClear: () => void
  isCollapsed?: boolean
  entityCounts?: Record<EntityType, number>
}

export default function EnhancedStarWarsSidebar({
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  onSearchClear,
  isCollapsed = false,
  entityCounts = {},
}: EnhancedStarWarsSidebarProps) {
  if (isCollapsed) {
    return (
      <div className="w-16 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700 p-2 space-y-2">
        {ENTITY_MAPPINGS.map((mapping) => (
          <Button
            key={mapping.databankType}
            variant={selectedCategory === mapping.databankType ? "default" : "ghost"}
            size="sm"
            className={`w-full h-12 p-0 ${
              selectedCategory === mapping.databankType
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`}
            onClick={() => onCategoryChange(mapping.databankType)}
            title={mapping.displayName}
          >
            <span className="text-lg">{mapping.icon}</span>
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-80 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700 p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-yellow-500 font-star-wars">Star Wars Database</h2>
          <Zap className="w-5 h-5 text-yellow-500" />
        </div>
        <p className="text-sm text-gray-400">Enhanced with SWAPI data</p>
      </div>

      <Separator className="bg-slate-700" />

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Search className="w-4 h-4" />
          Search
        </Label>
        <div className="relative">
          <Input
            id="search"
            type="text"
            placeholder={`Search ${selectedCategory}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 pr-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={onSearchClear}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      <Separator className="bg-slate-700" />

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Categories
        </Label>
        <div className="space-y-1">
          {ENTITY_MAPPINGS.map((mapping) => (
            <Button
              key={mapping.databankType}
              variant={selectedCategory === mapping.databankType ? "default" : "ghost"}
              className={`w-full justify-between h-auto p-3 ${
                selectedCategory === mapping.databankType
                  ? "bg-yellow-500 text-black hover:bg-yellow-400"
                  : "text-gray-300 hover:bg-slate-800 hover:text-white"
              }`}
              onClick={() => onCategoryChange(mapping.databankType)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{mapping.icon}</span>
                <span className="font-medium">{mapping.displayName}</span>
              </div>
              <div className="flex items-center gap-2">
                {entityCounts[mapping.databankType] && (
                  <Badge
                    variant="secondary"
                    className={`${
                      selectedCategory === mapping.databankType
                        ? "bg-black/20 text-black"
                        : "bg-slate-700 text-gray-300"
                    }`}
                  >
                    {entityCounts[mapping.databankType]}
                  </Badge>
                )}
                {mapping.swapiEndpoints.length > 0 && (
                  <Zap className="w-3 h-3 text-yellow-500" title="Enhanced with SWAPI" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-slate-700" />

      {/* Active Filters */}
      {(searchQuery || selectedCategory !== "characters") && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-300">Active Filters</Label>
          <div className="space-y-2">
            {selectedCategory !== "characters" && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                Category: {ENTITY_MAPPINGS.find((m) => m.databankType === selectedCategory)?.displayName}
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                Search: "{searchQuery}"
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Enhancement Status */}
      <div className="space-y-2 p-3 bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-300">Enhancement</span>
        </div>
        <p className="text-xs text-gray-400">
          Data enhanced with films, physical attributes, and additional details from SWAPI
        </p>
      </div>
    </div>
  )
}
