"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { GenerationState } from "@/lib/church-transformation-types";
import { INPAINT_IMAGES } from "@/lib/inpaint-config";
import Image from "next/image";

interface TransformationGridProps {
  state: GenerationState;
  setState: React.Dispatch<React.SetStateAction<GenerationState>>;
}

export const TransformationGrid: React.FC<TransformationGridProps> = ({ state, setState }) => {
  const handleImageSelect = (image: any) => {
    setState(prev => ({
      ...prev,
      selectedInpaintImage: image,
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Choisissez une image de base</h2>
        <p className="text-gray-600">Sélectionnez l'image de l'église que vous souhaitez transformer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INPAINT_IMAGES.map((image, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              state.selectedInpaintImage?.id === image.id
                ? "ring-2 ring-blue-500 shadow-lg"
                : ""
            }`}
            onClick={() => handleImageSelect(image)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                <Image
                  src={image.path}
                  alt={image.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {state.selectedInpaintImage?.id === image.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-6 w-6 text-blue-500 bg-white rounded-full" />
                  </div>
                )}
              </div>
              
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg">{image.name}</h3>
                <p className="text-sm text-gray-600">{image.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {image.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {image.hdPainterMethod}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {image.resolution}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};






