"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Sparkles } from "lucide-react";
import { GenerationState } from "@/lib/church-transformation-types";

interface PromptEditorProps {
  state: GenerationState;
  setState: React.Dispatch<React.SetStateAction<GenerationState>>;
  generateEnhancedPrompt: (type: string, prompt: string, imageName?: string) => string;
  onTransform: () => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({ 
  state, 
  setState, 
  generateEnhancedPrompt, 
  onTransform 
}) => {
  const handlePromptChange = (value: string) => {
    setState(prev => ({ ...prev, customPrompt: value }));
  };

  const handleEnhancePrompt = () => {
    if (state.selectedTransformation) {
      const enhanced = generateEnhancedPrompt(
        state.selectedTransformation.id,
        state.selectedTransformation.prompt,
        state.selectedInpaintImage?.path.split("/").pop()
      );
      setState(prev => ({ ...prev, customPrompt: enhanced }));
    }
  };

  if (!state.selectedTransformation) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Personnaliser le Prompt
        </CardTitle>
        <CardDescription>
          Modifiez le prompt pour affiner votre transformation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnhancePrompt}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Améliorer le prompt
            </Button>
          </div>
          
          <Textarea
            placeholder="Décrivez votre transformation..."
            value={state.customPrompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            rows={4}
            className="min-h-[100px]"
          />
        </div>

        <Button
          onClick={onTransform}
          disabled={state.isGenerating || !state.customPrompt.trim()}
          className="w-full gap-2"
          size="lg"
        >
          {state.isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Générer la Transformation
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};