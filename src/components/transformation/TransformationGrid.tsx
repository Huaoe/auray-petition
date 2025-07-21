"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Paintbrush, Eye, EyeOff } from "lucide-react";
import { FamousLocation, GenerationState } from "@/lib/church-transformation-types";
import { INPAINT_IMAGES, type HDPainterMethod } from "@/lib/inpaint-config";
import { TRANSFORMATION_TYPES, type TransformationType } from "@/lib/types";
import Image from "next/image";

interface TransformationGridProps {
  state: GenerationState;
  setState: React.Dispatch<React.SetStateAction<GenerationState>>;
  generateEnhancedPrompt: (
    transformationType: string,
    selectedLocation: FamousLocation | null,
    baseImageName?: string
  ) => string;
}

export const TransformationGrid: React.FC<TransformationGridProps> = ({
  state,
  setState,
  generateEnhancedPrompt,
}) => {
  const handleImageSelect = (image: any) => {
    setState(prev => ({
      ...prev,
      selectedInpaintImage: image,
      hdPainterMethod: image.hdPainterMethod, // Use recommended method for this image
      showMaskPreview: false, // Reset mask preview when changing image
    }));
  };

  const handleTransformationSelect = (transformation: TransformationType) => {
    const enhancedPrompt = generateEnhancedPrompt(
      transformation.id,
      null,
      state.selectedInpaintImage?.name || "Saint-Gildas-Auray-768x576.webp"
    );

    setState((prev) => ({
      ...prev,
      selectedTransformation: transformation,
      customPrompt: enhancedPrompt,
      selectedLocation: null, // Reset location when transformation changes
    }));
  };

  const handleHDPainterMethodChange = (method: HDPainterMethod) => {
    setState(prev => ({
      ...prev,
      hdPainterMethod: method,
    }));
  };

  const handleToggleMaskPreview = () => {
    setState(prev => ({
      ...prev,
      showMaskPreview: !prev.showMaskPreview,
    }));
  };

  return (
    <div className="space-y-8">
      {/* Image Selection Section */}
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

        {/* HD-Painter Controls */}
        {state.selectedInpaintImage && (
          <div className="mt-6 space-y-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Paintbrush className="w-4 h-4" />
                  <Label className="text-sm font-medium">Contrôles HD-Painter</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* HD-Painter Method Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="hd-painter-method" className="text-xs text-muted-foreground">
                      Méthode HD-Painter
                    </Label>
                    <Select
                      value={state.hdPainterMethod || "painta+rasg"}
                      onValueChange={handleHDPainterMethodChange}
                    >
                      <SelectTrigger id="hd-painter-method">
                        <SelectValue placeholder="Choisir méthode HD-Painter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="painta+rasg">PaintA + RASG (Recommandé)</SelectItem>
                        <SelectItem value="painta">PaintA (Rapide)</SelectItem>
                        <SelectItem value="rasg">RASG (Précis)</SelectItem>
                        <SelectItem value="baseline">Baseline (Standard)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mask Preview Toggle */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Aperçu du masque
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleMaskPreview}
                      className="w-full gap-2"
                    >
                      {state.showMaskPreview ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Masquer le masque
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Voir le masque
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Image Info */}
                <div className="mt-4 p-3 bg-white/50 rounded-lg border">
                  <div className="text-xs space-y-1">
                    <p>
                      <strong>Image:</strong> {state.selectedInpaintImage.name}
                    </p>
                    <p>
                      <strong>Méthode:</strong> {state.hdPainterMethod || "painta+rasg"}
                    </p>
                    <p>
                      <strong>Résolution:</strong> {state.selectedInpaintImage.resolution}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Transformation Type Selection Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Choisissez un type de transformation</h2>
          <p className="text-gray-600">Sélectionnez le type d'espace que vous souhaitez créer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TRANSFORMATION_TYPES.map((transformation) => (
            <Card
              key={transformation.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                state.selectedTransformation?.id === transformation.id
                  ? "ring-2 ring-blue-500 shadow-lg bg-blue-50"
                  : ""
              }`}
              onClick={() => handleTransformationSelect(transformation)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{transformation.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{transformation.name}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{transformation.description}</p>
                  </div>
                  {state.selectedTransformation?.id === transformation.id && (
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};






