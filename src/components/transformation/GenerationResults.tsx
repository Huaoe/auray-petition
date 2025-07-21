"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Clock, BrainCircuit, Eye, EyeOff } from "lucide-react";
import { GenerationState } from "@/lib/church-transformation-types";
import Image from "next/image";

interface GenerationResultsProps {
  state: GenerationState;
  setState: React.Dispatch<React.SetStateAction<GenerationState>>;
}

export const GenerationResults: React.FC<GenerationResultsProps> = ({ state, setState }) => {
  const [showComparison, setShowComparison] = useState(false);

  const handleDownload = () => {
    if (state.generatedImage) {
      const link = document.createElement('a');
      link.href = state.generatedImage;
      link.download = `transformation-${Date.now()}.png`;
      link.click();
    }
  };

  const handleShare = () => {
    setState(prev => ({ ...prev, showShareModal: true }));
  };

  const handleToggleComparison = () => {
    setShowComparison(prev => !prev);
  };

  if (!state.generatedImage) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résultat de la Transformation</CardTitle>
        <CardDescription>
          Votre église transformée en {state.selectedTransformation?.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Display - Comparison or Single View */}
        {showComparison && state.selectedInpaintImage ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Image */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-center">Image Originale</h4>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={state.selectedInpaintImage.path}
                  alt="Image originale"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            
            {/* Generated Image */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-center">Image Transformée</h4>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src={state.generatedImage}
                  alt="Transformation générée"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img
              src={state.generatedImage}
              alt="Transformation générée"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {state.generationTime && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              {(state.generationTime / 1000).toFixed(1)}s
            </Badge>
          )}
          {state.previousBalance !== undefined && state.currentBalance !== undefined && (
            <Badge variant="secondary" className="gap-1">
              <BrainCircuit className="h-3 w-3" />
              {(state.previousBalance - state.currentBalance).toFixed(4)} crédits
            </Badge>
          )}
          <Badge variant="secondary">
            HD Quality
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleDownload} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
          <Button onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Partager
          </Button>
          {state.selectedInpaintImage && (
            <Button
              onClick={handleToggleComparison}
              variant="outline"
              className="gap-2"
            >
              {showComparison ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Vue Simple
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Comparer
                </>
              )}
            </Button>
          )}
        </div>
        
      </CardContent>
    </Card>
  );
};

