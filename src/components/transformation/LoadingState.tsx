"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles } from "lucide-react";
import { GenerationState } from "@/lib/church-transformation-types";

interface LoadingStateProps {
  state: GenerationState;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ state }) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (state.isGenerating) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      return () => clearInterval(timer);
    }
  }, [state.isGenerating]);

  if (!state.isGenerating) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Génération en cours...
        </CardTitle>
        <CardDescription>
          L'IA transforme votre église en {state.selectedTransformation?.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <Sparkles className="h-8 w-8 text-purple-500 mx-auto animate-pulse" />
            <p className="text-sm text-gray-600">
              Génération HD en cours... Cela peut prendre quelques secondes
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};