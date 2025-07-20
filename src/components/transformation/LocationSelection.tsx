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
    if (!location) {
      console.log('Warning: Attempted to select null/undefined location');
      return;
    }
    
    setState(prev => ({
      ...prev,
      selectedLocation: location,
    }));
  };

  console.log('LocationSelection state:', {
    selectedTransformation: state.selectedTransformation,
    selectedLocation: state.selectedLocation
  });
  
  // Enhanced debug logs to help identify the null reference issue
  console.log('selectedTransformation type:', typeof state.selectedTransformation);
  console.log('selectedTransformation value:', state.selectedTransformation);
  
  if (!state.selectedTransformation) {
    console.log('Early return: selectedTransformation is null');
    return null;
  }

  // Debugging: Log the transformation ID and corresponding locations
  console.log('Transformation ID:', state.selectedTransformation?.id);
  
  // Safely access the transformation ID with optional chaining
  const transformationId = state.selectedTransformation?.id;
  
  // Check if the transformation ID exists in FAMOUS_LOCATIONS
  const transformationExists = transformationId ? transformationId in FAMOUS_LOCATIONS : false;
  console.log('Transformation exists in FAMOUS_LOCATIONS:', transformationExists);
  
  // Check all keys in FAMOUS_LOCATIONS to help identify missing mappings
  console.log('Available transformation types in FAMOUS_LOCATIONS:', Object.keys(FAMOUS_LOCATIONS));
  
  // Safely get locations array with additional null checks
  const locationsArray = (transformationId && transformationExists) ? FAMOUS_LOCATIONS[transformationId] : [];
  console.log('Locations array type:', typeof locationsArray);
  console.log('Locations array length:', locationsArray?.length || 0);
  console.log('Locations array content:', locationsArray);

  // Additional debugging for each location in the array
  if (Array.isArray(locationsArray)) {
    locationsArray.forEach((loc, index) => {
      console.log(`Location ${index}:`, loc ? `id: ${loc.id}, name: ${loc.name}` : 'null or undefined');
    });
  } else {
    console.log('locationsArray is not an array:', locationsArray);
  }

  const locations = locationsArray || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Inspiration architecturale
        </CardTitle>
        <CardDescription>
          Choisissez un lieu célèbre pour inspirer votre transformation en {state.selectedTransformation?.name?.toLowerCase() ?? '...'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Array.isArray(locations) && locations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.slice(0, 8).map((location) => {
              if (!location) return null;
              console.log('Rendering location:', location);
              return (
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
                      {location.keyFeatures?.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        ) : null}
        
        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          Sélectionnez une inspiration architecturale pour enrichir votre transformation, ou continuez sans inspiration spécifique.
        </div>
      </CardContent>
    </Card>
  );
};





