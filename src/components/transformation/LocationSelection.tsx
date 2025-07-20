"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { GenerationState } from "@/lib/church-transformation-types";
import { FAMOUS_LOCATIONS } from "@/lib/famous-locations";
import Image from "next/image";

interface LocationSelectionProps {
  state: GenerationState;
  setState: React.Dispatch<React.SetStateAction<GenerationState>>;
}

export const LocationSelection: React.FC<LocationSelectionProps> = ({ state, setState }) => {
  const handleLocationSelect = (location: any) => {
    setState(prev => ({
      ...prev,
      selectedLocation: location,
    }));
  };

  if (!state.selectedTransformation) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Inspiration architecturale
        </CardTitle>
        <CardDescription>
          Choisissez un lieu célèbre pour inspirer votre transformation de salle de concert
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FAMOUS_LOCATIONS[state.selectedTransformation.id]?.slice(0, 8).map((location) => (
            <Card
              key={location.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                state.selectedLocation?.id === location.id
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => handleLocationSelect(location)}
            >
              <CardContent className="p-0">
                {location.imageUrl && (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                    <Image
                      src={location.imageUrl}
                      alt={location.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.description}</p>
                  <p className="text-xs text-gray-500">{location.location}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {location.architecturalStyle}
                    </Badge>
                    {location.features?.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          Sélectionnez une inspiration architecturale pour enrichir votre transformation, ou continuez sans inspiration spécifique.
        </div>
      </CardContent>
    </Card>
  );
};

