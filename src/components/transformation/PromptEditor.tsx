"use client";

import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2,
} from "lucide-react";
import {
  FamousLocation,
  GenerationState,
} from "@/lib/church-transformation-types";
import { Tooltip } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import {
  combineNegativePrompts,
  getDefaultNegativePrompt,
  getChurchSpecificNegativePrompt,
  getToggleablePreset,
  combineWithMandatoryBase,
  NEGATIVE_PROMPT_CONFIG,
} from "@/lib/inpaint-config";

interface PromptEditorProps {
  state: GenerationState;
  setState: React.Dispatch<React.SetStateAction<GenerationState>>;
  generateEnhancedPrompt: (
    transformationType: string,
    selectedLocation: FamousLocation | null,
    baseImageName?: string
  ) => string;
  onTransform: () => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  state,
  setState,
  generateEnhancedPrompt,
  onTransform,
}) => {
  const handleCustomPromptReset = useCallback(() => {
    if (!state.selectedTransformation) return;

    // Get the base image name for prompt generation
    const baseImageName =
      state.selectedInpaintImage?.path.split("/").pop() ||
      "Saint-Gildas-Auray-768x576.webp";

    // Regenerate the default prompt for the current transformation
    const defaultPrompt = generateEnhancedPrompt(
      state.selectedTransformation.id,
      state.selectedLocation,
      baseImageName
    );

    // Update the state with the default prompt
    setState((prev) => ({
      ...prev,
      customPrompt: defaultPrompt,
    }));
  }, [
    state.selectedTransformation,
    state.selectedInpaintImage,
    state.selectedLocation,
    generateEnhancedPrompt,
    setState,
  ]);

  // Negative Prompt handlers
  const handleNegativePromptChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;
      // Limit to 500 characters as defined in NEGATIVE_PROMPT_CONFIG.maxLength
      if (value.length <= 500) {
        setState((prev) => ({ ...prev, negativePrompt: value }));
      }
    },
    [setState]
  );

  const handleToggleNegativePreset = useCallback(
    (presetKey: keyof typeof NEGATIVE_PROMPT_CONFIG.toggleablePresets) => {
      setState((prev) => {
        const newActivePresets = new Set(prev.activeNegativePresets);

        if (newActivePresets.has(presetKey)) {
          // Remove preset if already active
          newActivePresets.delete(presetKey);
        } else {
          // Add preset if not active
          newActivePresets.add(presetKey);
        }

        // Combine mandatory base with active toggleable presets
        const activePresetPrompts = Array.from(newActivePresets).map((key) =>
          getToggleablePreset(
            key as keyof typeof NEGATIVE_PROMPT_CONFIG.toggleablePresets
          )
        );
        const combinedPrompt = combineWithMandatoryBase(activePresetPrompts);

        return {
          ...prev,
          activeNegativePresets: newActivePresets,
          negativePrompt: combinedPrompt,
        };
      });
    },
    [setState]
  );

  const handleToggleNegativePromptPresets = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showNegativePromptPresets: !prev.showNegativePromptPresets,
    }));
  }, [setState]);

  const handleResetNegativePrompt = useCallback(() => {
    setState((prev) => ({
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
    setState((prev) => ({
      ...prev,
      negativePrompt: combined,
    }));
  }, [state.negativePrompt, setState]);

  const handleNegativePromptCollapseToggle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isNegativePromptCollapsed: !prev.isNegativePromptCollapsed,
    }));
  }, [setState]);

  const handlePromptEditorCollapseToggle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPromptEditorCollapsed: !prev.isPromptEditorCollapsed,
    }));
  }, [setState]);

  const handleCustomPromptChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;
      // Limiter à 1800 caractères
      if (value.length <= 1800) {
        setState((prev) => ({ ...prev, customPrompt: value }));
      }
    },
    []
  );
  const handleForceNewGenerationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({
        ...prev,
        forceNewGeneration: event.target.checked,
      }));
    },
    []
  );

  if (!state.selectedTransformation) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Personnalisez votre prompt</CardTitle>
            <CardDescription>
              Modifiez le prompt pour obtenir des résultats plus précis.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePromptEditorCollapseToggle}
            className="h-8 w-8 p-0"
            aria-expanded={!state.isPromptEditorCollapsed}
            aria-label={
              state.isPromptEditorCollapsed
                ? "Expand prompt editor"
                : "Collapse prompt editor"
            }
          >
            {!state.isPromptEditorCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            !state.isPromptEditorCollapsed
              ? "max-h-0 opacity-0 p-0"
              : "max-h-[2000px] opacity-100"
          }`}
        >
          <div
            className={`p-6 ${!state.isPromptEditorCollapsed ? "hidden" : "block"}`}
          >
            <Textarea
              value={state.customPrompt}
              onChange={handleCustomPromptChange}
              placeholder="Sélectionnez d'abord une transformation pour voir le prompt par défaut..."
              className="w-full min-h-[300px] max-h-[620px] p-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-hidden"
              disabled={!state.selectedTransformation}
              maxLength={1800}
              rows={1}
              style={{
                height: "auto",
              }}
              ref={(el) => {
                if (el) {
                  el.style.height = "auto";
                  el.style.height = el.scrollHeight + "px";
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
            {/* Compteur de caractères */}
            {state.selectedTransformation && (
              <div className="flex justify-between items-center mt-2">
                <span
                  className={`text-xs ${
                    state.customPrompt.length > 1600
                      ? "text-orange-600"
                      : state.customPrompt.length > 1700
                        ? "text-red-600"
                        : "text-gray-500"
                  }`}
                >
                  {state.customPrompt.length}/1800 caractères
                </span>
                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCustomPromptReset}
                    disabled={!state.selectedTransformation}
                  >
                    Réinitialiser le prompt
                  </Button>
                </div>
              </div>
            )}
            <br />
            {/* Negative Prompt Section */}
            <Card className="lg:p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
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
                      Negative Prompt Configuration
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
                          {state.negativePrompt.length}/2000
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
                      className="min-h-[200px] "
                      maxLength={500}
                    />

                    {/* Preset Buttons */}
                    {state.showNegativePromptPresets && (
                      <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">
                            Presets Negative Prompts
                          </h4>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleResetNegativePrompt}
                              className="h-7 px-2 text-xs"
                            >
                              Reset
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(
                            Object.keys(
                              NEGATIVE_PROMPT_CONFIG.toggleablePresets
                            ) as Array<
                              keyof typeof NEGATIVE_PROMPT_CONFIG.toggleablePresets
                            >
                          ).map((presetKey) => {
                            const preset =
                              NEGATIVE_PROMPT_CONFIG.toggleablePresets[
                                presetKey
                              ];
                            const isActive =
                              state.activeNegativePresets.has(presetKey);

                            return (
                              <Tooltip
                                key={presetKey}
                                content={preset.tooltip}
                                side="top"
                              >
                                <Button
                                  type="button"
                                  variant={isActive ? "default" : "secondary"}
                                  size="sm"
                                  onClick={() =>
                                    handleToggleNegativePreset(presetKey)
                                  }
                                  className={`h-8 text-xs justify-start ${
                                    isActive
                                      ? "bg-blue-500 text-white border-blue-500"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-1">
                                    {isActive ? "✓" : ""} {preset.name}
                                    <Info className="h-3 w-3 ml-1 opacity-70" />
                                  </div>
                                </Button>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Le negative prompt aide à éviter les éléments indésirables
                      dans l'image générée.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {" "}
          {state.selectedTransformation && (
            <div className="mt-4 flex flex-col items-center space-y-3">
              <Button
                onClick={onTransform}
                disabled={state.isGenerating}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 animate-pulse-glow"
              >- 
                {state.isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer la transformation
                  </>
                )}
              </Button>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="force-new-generation"
                  checked={state.forceNewGeneration}
                  onChange={handleForceNewGenerationChange}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label
                  htmlFor="force-new-generation"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  🔄 Forcer une nouvelle génération (ignorer le cache)
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
