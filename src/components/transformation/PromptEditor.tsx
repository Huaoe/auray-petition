"use client";

import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wand2,
  Sparkles,
  RotateCcw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";
import { GenerationState } from "@/lib/church-transformation-types";
import { Tooltip } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import {
  combineNegativePrompts,
  getDefaultNegativePrompt,
  getChurchSpecificNegativePrompt,
  getToggleablePreset,
  combineWithMandatoryBase,
  NEGATIVE_PROMPT_CONFIG
} from "@/lib/inpaint-config";

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
  const handlePromptChange = useCallback((value: string) => {
    // Limit to 1800 characters
    if (value.length <= 1800) {
      setState(prev => ({ ...prev, customPrompt: value }));
    }
  }, [setState]);

  const handleEnhancePrompt = useCallback(() => {
    if (state.selectedTransformation) {
      let basePrompt = state.selectedTransformation.prompt;
      
      // If a location is selected, incorporate its architectural inspiration
      if (state.selectedLocation) {
        const locationInspiration = `
Inspired by ${state.selectedLocation.name} (${state.selectedLocation.location}):
- Architectural style: ${state.selectedLocation.architecturalStyle}
- Key features: ${state.selectedLocation.keyFeatures?.join(', ')}

${state.selectedLocation.description}`;
        
        basePrompt = `${basePrompt}\n\n${locationInspiration}`;
      }
      
      const enhanced = generateEnhancedPrompt(
        state.selectedTransformation.id,
        basePrompt,
        state.selectedInpaintImage?.path.split("/").pop()
      );
      setState(prev => ({ ...prev, customPrompt: enhanced }));
    }
  }, [state.selectedTransformation, state.selectedLocation, state.selectedInpaintImage, generateEnhancedPrompt, setState]);

  const handleCustomPromptReset = useCallback(() => {
    if (!state.selectedTransformation) return;

    // Get the base image name for prompt generation
    const baseImageName = state.selectedInpaintImage?.path.split("/").pop() || "Saint-Gildas-Auray-768x576.webp";

    // Regenerate the default prompt for the current transformation
    const defaultPrompt = generateEnhancedPrompt(
      state.selectedTransformation.id,
      state.selectedTransformation.prompt,
      baseImageName
    );

    // Update the state with the default prompt
    setState(prev => ({
      ...prev,
      customPrompt: defaultPrompt,
    }));
  }, [state.selectedTransformation, state.selectedInpaintImage, generateEnhancedPrompt, setState]);

  // Negative Prompt handlers
  const handleNegativePromptChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    // Limit to 500 characters as defined in NEGATIVE_PROMPT_CONFIG.maxLength
    if (value.length <= 500) {
      setState(prev => ({ ...prev, negativePrompt: value }));
    }
  }, [setState]);

  const handleToggleNegativePreset = useCallback((presetKey: keyof typeof NEGATIVE_PROMPT_CONFIG.toggleablePresets) => {
    setState(prev => {
      const newActivePresets = new Set(prev.activeNegativePresets);

      if (newActivePresets.has(presetKey)) {
        // Remove preset if already active
        newActivePresets.delete(presetKey);
      } else {
        // Add preset if not active
        newActivePresets.add(presetKey);
      }

      // Combine mandatory base with active toggleable presets
      const activePresetPrompts = Array.from(newActivePresets).map(key =>
        getToggleablePreset(key as keyof typeof NEGATIVE_PROMPT_CONFIG.toggleablePresets)
      );
      const combinedPrompt = combineWithMandatoryBase(activePresetPrompts);

      return {
        ...prev,
        activeNegativePresets: newActivePresets,
        negativePrompt: combinedPrompt,
      };
    });
  }, [setState]);

  const handleToggleNegativePromptPresets = useCallback(() => {
    setState(prev => ({
      ...prev,
      showNegativePromptPresets: !prev.showNegativePromptPresets,
    }));
  }, [setState]);

  const handleResetNegativePrompt = useCallback(() => {
    setState(prev => ({
      ...prev,
      negativePrompt: getDefaultNegativePrompt(),
    }));
  }, [setState]);

  const handleCombineNegativePrompts = useCallback(() => {
    const churchSpecific = getChurchSpecificNegativePrompt();
    const combined = combineNegativePrompts(
      state.negativePrompt,
      churchSpecific
    );
    setState(prev => ({
      ...prev,
      negativePrompt: combined,
    }));
  }, [state.negativePrompt, setState]);

  const handleNegativePromptCollapseToggle = useCallback(() => {
    setState(prev => ({
      ...prev,
      isNegativePromptCollapsed: !prev.isNegativePromptCollapsed,
    }));
  }, [setState]);

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
            <Button
              variant="outline"
              size="sm"
              onClick={handleCustomPromptReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
          
          <Textarea
            placeholder="Décrivez votre transformation..."
            value={state.customPrompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            rows={4}
            className="min-h-[100px] max-h-[320px]"
          />
          
          {/* Character counter */}
          <div className="flex justify-end">
            <span className={`text-xs ${
              state.customPrompt.length > 1600
                ? "text-orange-600"
                : state.customPrompt.length > 1700
                  ? "text-red-600"
                  : "text-gray-500"
            }`}>
              {state.customPrompt.length}/1800 caractères
            </span>
          </div>
        </div>

        {/* Negative Prompt Section */}
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 p-4">
          <div className="space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={handleNegativePromptCollapseToggle}
              role="button"
              tabIndex={0}
              aria-expanded={!state.isNegativePromptCollapsed}
              aria-label={`${state.isNegativePromptCollapsed ? "Expand" : "Collapse"} negative prompt configuration`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNegativePromptCollapseToggle();
                }
              }}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">
                  Negative Prompt
                </h3>
              </div>
              {state.isNegativePromptCollapsed ? (
                <ChevronDown className="w-5 h-5 text-red-600" />
              ) : (
                <ChevronUp className="w-5 h-5 text-red-600" />
              )}
            </div>

            {!state.isNegativePromptCollapsed && (
              <div className="space-y-4">
                <p className="text-sm text-red-700">
                  Spécifiez les éléments à éviter dans l'image générée pour
                  améliorer la qualité.
                </p>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="negative-prompt"
                    className="text-sm font-medium"
                  >
                    Éléments à éviter
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {state.negativePrompt.length}/500
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleToggleNegativePromptPresets}
                      className="h-6 px-2 text-xs"
                    >
                      Presets
                    </Button>
                  </div>
                </div>

                <Textarea
                  id="negative-prompt"
                  placeholder="Éléments à éviter dans l'image générée..."
                  value={state.negativePrompt}
                  onChange={handleNegativePromptChange}
                  className="min-h-[100px]"
                  maxLength={500}
                />

              </div>
            )}
          </div>
        </Card>

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