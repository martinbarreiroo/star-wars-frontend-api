"use client";

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
  Eye,
  Calendar,
  Ruler,
  User,
  MapPin,
  Building,
  Wrench,
  Rocket,
} from "lucide-react";
import Image from "next/image";
import { BaseEntity, EntityType } from "@/services/types";

interface EntityCardProps {
  entity: BaseEntity;
  entityType: EntityType;
  onViewDetails?: (entity: BaseEntity) => void;
}

export default function EntityCard({
  entity,
  entityType,
  onViewDetails,
}: EntityCardProps) {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "/placeholder.svg?height=200&width=150";
  };

  const getEntityIcon = () => {
    switch (entityType) {
      case "characters":
        return <User className="w-4 h-4" />;
      case "creatures":
        return <span className="text-sm">🐉</span>;
      case "droids":
        return <span className="text-sm">🤖</span>;
      case "locations":
        return <MapPin className="w-4 h-4" />;
      case "organizations":
        return <Building className="w-4 h-4" />;
      case "species":
        return <span className="text-sm">👽</span>;
      case "vehicles":
        return <Rocket className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getEntitySpecificInfo = () => {
    const typedEntity = entity as any;

    switch (entityType) {
      case "characters":
        return (
          <>
            {typedEntity.height && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Ruler className="w-4 h-4" />
                <span>Height: {typedEntity.height}</span>
              </div>
            )}
            {typedEntity.birth_year && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>Born: {typedEntity.birth_year}</span>
              </div>
            )}
            {typedEntity.gender && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-300" />
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                >
                  {typedEntity.gender}
                </Badge>
              </div>
            )}
          </>
        );

      case "creatures":
      case "species":
        return (
          <>
            {typedEntity.classification && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-green-400 border-green-400"
                >
                  {typedEntity.classification}
                </Badge>
              </div>
            )}
            {typedEntity.homeworld && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>Homeworld: {typedEntity.homeworld}</span>
              </div>
            )}
          </>
        );

      case "droids":
        return (
          <>
            {typedEntity.model && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Wrench className="w-4 h-4" />
                <span>Model: {typedEntity.model}</span>
              </div>
            )}
            {typedEntity.manufacturer && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-purple-400 border-purple-400"
                >
                  {typedEntity.manufacturer}
                </Badge>
              </div>
            )}
          </>
        );

      case "locations":
        return (
          <>
            {typedEntity.planet && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>Planet: {typedEntity.planet}</span>
              </div>
            )}
            {typedEntity.region && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-orange-400 border-orange-400"
                >
                  {typedEntity.region}
                </Badge>
              </div>
            )}
          </>
        );

      case "organizations":
        return (
          <>
            {typedEntity.type && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-red-400 border-red-400"
                >
                  {typedEntity.type}
                </Badge>
              </div>
            )}
            {typedEntity.founding_date && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>Founded: {typedEntity.founding_date}</span>
              </div>
            )}
          </>
        );

      case "vehicles":
        return (
          <>
            {typedEntity.model && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Rocket className="w-4 h-4" />
                <span>Model: {typedEntity.model}</span>
              </div>
            )}
            {typedEntity.manufacturer && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-cyan-400 border-cyan-400"
                >
                  {typedEntity.manufacturer}
                </Badge>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

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
        </div>
        <CardTitle className="text-xl font-bold text-center group-hover:text-yellow-400 transition-colors text-white">
          {entity.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {getEntitySpecificInfo()}

        {entity.description && (
          <p className="text-xs text-gray-400 line-clamp-3">
            {entity.description}
          </p>
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
  );
}
