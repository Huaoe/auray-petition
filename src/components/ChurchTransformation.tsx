'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Download, Share2, RotateCcw, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/toaster';
import { TRANSFORMATION_TYPES, type TransformationType, type GenerationResponse } from '@/lib/types';

interface GenerationState {
  isGenerating: boolean;
  selectedTransformation: TransformationType | null;
  generatedImage: string | null;
  originalImage: string;
  generationTime: number | null;
  cost: number | null;
}

const ChurchTransformation = () => {
  const { toast } = useToast();

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    selectedTransformation: null,
    generatedImage: null,
    originalImage: '/images/Saint-Gildas-Auray-768x576.webp', // Image existante de l'église
    generationTime: null,
    cost: null,
  });

  const handleTransform = useCallback(async (transformation: TransformationType) => {
    if (state.isGenerating) return;

    setState(prev => ({
      ...prev,
      isGenerating: true,
      selectedTransformation: transformation,
      generatedImage: null,
      generationTime: null,
      cost: null,
    }));

    const startTime = Date.now();

    try {
      toast({
        title: `🎨 Génération en cours: ${transformation.name}`,
        description: 'L\'IA crée votre vision personnalisée...',
        variant: 'info',
        duration: 3000,
      });

      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transformationType: transformation.id,
          style: 'vivid',
          quality: 'hd',
        }),
      });

      const data: GenerationResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate image');
      }

      const totalTime = Date.now() - startTime;

      setState(prev => ({
        ...prev,
        isGenerating: false,
        generatedImage: data.imageUrl!,
        generationTime: totalTime,
        cost: data.metadata?.cost || 0,
      }));

      toast({
        title: `✨ ${transformation.name} créé avec succès !`,
        description: `Généré en ${(totalTime / 1000).toFixed(1)}s`,
        variant: 'success',
        duration: 4000,
      });

    } catch (error: any) {
      console.error('Generation failed:', error);
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
      }));

      toast({
        title: '❌ Erreur de génération',
        description: error.message || 'Une erreur est survenue lors de la génération',
        variant: 'error',
        duration: 5000,
      });
    }
  }, [state.isGenerating, toast]);

  const handleReset = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedTransformation: null,
      generatedImage: null,
      generationTime: null,
      cost: null,
    }));
  }, []);

  const handleDownload = useCallback(async () => {
    if (!state.generatedImage) return;

    try {
      const response = await fetch(state.generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eglise-auray-${state.selectedTransformation?.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: '📥 Image téléchargée !',
        variant: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: '❌ Erreur de téléchargement',
        variant: 'error',
        duration: 2000,
      });
    }
  }, [state.generatedImage, state.selectedTransformation, toast]);

  const handleShare = useCallback(async () => {
    if (!state.generatedImage || !state.selectedTransformation) return;

    const shareData = {
      title: `Église d'Auray transformée : ${state.selectedTransformation.name}`,
      text: `Découvrez cette transformation révolutionnaire de l'église Saint-Gildas d'Auray ! ${state.selectedTransformation.description}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: '🚀 Partagé avec succès !',
          variant: 'success',
          duration: 2000,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast({
          title: '📋 Lien copié dans le presse-papiers !',
          variant: 'success',
          duration: 2000,
        });
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      toast({
        title: '📋 Lien copié dans le presse-papiers !',
        variant: 'success',
        duration: 2000,
      });
    }
  }, [state.generatedImage, state.selectedTransformation, toast]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Transformez VOTRE Église d'Auray
          </h1>
          <Zap className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez 10 visions révolutionnaires de l'église Saint-Gildas d'Auray, générées par l'intelligence artificielle en temps réel
        </p>
        <Badge variant="secondary" className="text-sm">
          ⚡ Génération instantanée • 🎨 HD Qualité • 🔄 Illimité
        </Badge>
      </div>

      {/* Image Comparison Section */}
      {state.generatedImage && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <span className="text-2xl">{state.selectedTransformation?.icon}</span>
              {state.selectedTransformation?.name}
            </CardTitle>
            <CardDescription>
              {state.selectedTransformation?.description}
            </CardDescription>
            {state.generationTime && (
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span>⏱️ Généré en {(state.generationTime / 1000).toFixed(1)}s</span>
                {state.cost && <span>💰 ${state.cost.toFixed(3)}</span>}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Originale */}
              <div className="space-y-2">
                <h3 className="font-semibold text-center">🏛️ Église Actuelle</h3>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={state.originalImage}
                    alt="Église Saint-Gildas d'Auray - Vue actuelle"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback si l'image n'existe pas
                      const img = e.target as HTMLImageElement;
                      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjMuNGY0LWY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPsOJZ2xpc2UgZCdBdXJheTwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
              </div>

              {/* Image Transformée */}
              <div className="space-y-2">
                <h3 className="font-semibold text-center">
                  ✨ Transformation IA: {state.selectedTransformation?.name}
                </h3>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={state.generatedImage}
                    alt={`Église transformée en ${state.selectedTransformation?.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Nouvelle Transformation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transformation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {TRANSFORMATION_TYPES.map((transformation) => (
          <Card 
            key={transformation.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              state.selectedTransformation?.id === transformation.id 
                ? 'ring-2 ring-purple-500 bg-purple-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleTransform(transformation)}
          >
            <CardContent className="p-4 text-center space-y-2">
              <div className="text-3xl mb-2">{transformation.icon}</div>
              <h3 className="font-semibold text-sm">{transformation.name}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">
                {transformation.description}
              </p>
              <Badge variant="outline" className="text-xs">
                {transformation.category}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading State */}
      {state.isGenerating && state.selectedTransformation && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                🎨 Création de votre {state.selectedTransformation.name}
              </h3>
              <p className="text-gray-600">
                L'IA génère votre vision personnalisée... ⏱️ 3-8 secondes
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>DALL-E 3 • Qualité HD • Style vivant</span>
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Footer */}
      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>
          🤖 Propulsé par DALL-E 3 • 🔒 Respectueux du patrimoine • ✨ 100% Gratuit
        </p>
        <p>
          💡 Chaque transformation respecte l'architecture originale tout en proposant une vision d'avenir
        </p>
      </div>
    </div>
  );
};

export default ChurchTransformation;
