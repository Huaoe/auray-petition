"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { TransformationGrid } from "./transformation/TransformationGrid";
import { CouponSection } from "./transformation/CouponSection";
import { LocationSelection } from "./transformation/LocationSelection";
import { PromptEditor } from "./transformation/PromptEditor";
import { GenerationResults } from "./transformation/GenerationResults";
import { LoadingState } from "./transformation/LoadingState";
import { VirtualCreditsDisplay } from "./VirtualCreditsDisplay";
import { SharePostModal } from "./SharePostModal";
import { useToast } from "@/components/ui/toaster";
import { usePromptGeneration } from "@/hooks/usePromptGeneration";
import {
  TRANSFORMATION_TYPES,
  type TransformationType,
  type GenerationResponse,
} from "@/lib/types";
import {
  type GenerationState,
  type FamousLocation,
} from "@/lib/church-transformation-types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  INPAINT_IMAGES,
  type InpaintImage,
  type HDPainterMethod,
  getDefaultNegativePrompt,
} from "@/lib/inpaint-config";
import {
  validateAndUseCoupon,
  useCouponGeneration,
  getActiveCoupon,
  type CouponData,
  type CouponValidationResult,
} from "@/lib/coupon-system";
import {
  canUseTransformation,
  useVirtualCredit,
  getAvailableVirtualCredits,
} from "@/lib/virtual-credits-system";

const ChurchTransformation: React.FC = () => {
  const { toast } = useToast();
  const selectedBaseImageRef = useRef<InpaintImage>(INPAINT_IMAGES[0]);
  const [selectedBaseImage, setSelectedBaseImage] = useState<InpaintImage>(
    INPAINT_IMAGES[0]
  );

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    selectedTransformation: null,
    selectedLocation: null,
    generatedImage: null,
    originalImage: INPAINT_IMAGES[0].path,
    generationTime: null,
    cost: null,
    customPrompt: "",
    forceNewGeneration: false,
    couponCode: "",
    activeCoupon: null,
    couponValidation: null,
    selectedInpaintImage: INPAINT_IMAGES[0],
    hdPainterMethod: "painta+rasg",
    showMaskPreview: false,
    showShareModal: false,
    negativePrompt: getDefaultNegativePrompt(),
    showNegativePromptPresets: false,
    activeNegativePresets: new Set(),
    isNegativePromptCollapsed: true,
  });

  // Load active coupon on mount
  useEffect(() => {
    try {
      const activeCoupon = getActiveCoupon();
      if (activeCoupon) {
        setState((prev) => ({
          ...prev,
          activeCoupon,
          couponValidation: {
            valid: true,
            coupon: activeCoupon,
            message: `${activeCoupon.generationsRemaining} générations restantes`,
          },
        }));
      }
    } catch (error) {
      console.error("Error loading active coupon:", error);
    }
  }, []);

  // Use the prompt generation hook
  const { generateEnhancedPrompt } = usePromptGeneration();
  
  // Mandatory people requirement to add to all prompts
  const mandatoryPeopleRequirement =
    "MANDATORY: 100 happy diverse people actively using the space. Space must look lived-in with people as the focal point.";

  // Transform function with balance tracking
  const handleTransform = useCallback(async () => {
    const isDevelopment =
      process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    const previousBalance = getAvailableVirtualCredits();
    setState((prev) => ({
      ...prev,
      isGenerating: true,
      previousBalance,
      currentBalance: undefined,
      cost: null,
    }));

    if (!isDevelopment && !state.couponValidation?.valid) {
      toast({
        title: "🎫 Coupon requis",
        description:
          "Vous devez avoir un coupon valide pour générer des transformations.",
        variant: "error",
      });
      setState((prev) => ({ ...prev, isGenerating: false }));
      return;
    }

    if (!isDevelopment && !canUseTransformation()) {
      toast({
        title: "❌ Crédits insuffisants",
        description: "Faites un don pour débloquer plus de transformations",
        variant: "error",
      });
      setState((prev) => ({ ...prev, isGenerating: false }));
      return;
    }

    if (!state.selectedTransformation) {
      toast({
        title: "❌ Sélection requise",
        description: "Veuillez sélectionner un type de transformation",
        variant: "error",
      });
      setState((prev) => ({ ...prev, isGenerating: false }));
      return;
    }

    const startTime = Date.now();

    try {
      const mandatoryPeopleRequirement =
        "MANDATORY: 80 happy diverse people actively using the space. Space must look lived-in with people as the focal point.";
      
      // Get the base prompt from the hook
      let basePrompt = "";
      if (state.selectedTransformation) {
        basePrompt = generateEnhancedPrompt(
          state.selectedTransformation.id,
          "",
          state.selectedInpaintImage?.path || "Saint-Gildas-Auray-768x576.webp"
        );
      }
      
      // Combine the mandatory requirement with the base prompt and custom prompt
      const fullPrompt = mandatoryPeopleRequirement + " " + basePrompt + " " + state.customPrompt;

      const response = await fetch("/api/inpaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          baseImage: state.selectedInpaintImage?.path,
          maskImage: state.selectedInpaintImage?.maskPath,
          prompt: fullPrompt,
          negativePrompt: state.negativePrompt,
          method: state.hdPainterMethod,
          resolution: state.selectedInpaintImage?.resolution,
          noCache: state.forceNewGeneration,
          couponCode: isDevelopment
            ? "DEV_MODE"
            : state.activeCoupon?.id || state.couponCode,
          isDevelopment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data: GenerationResponse = await response.json();
      const endTime = Date.now();
      const generationTime = endTime - startTime;

      if (!isDevelopment) {
        useVirtualCredit(0.04);
      }

      const currentBalance = getAvailableVirtualCredits();
      const actualCost = previousBalance - currentBalance;

      setState((prev) => ({
        ...prev,
        generatedImage: data.imageUrl,
        generationTime,
        cost: actualCost,
        currentBalance: currentBalance,
        isGenerating: false,
      }));

      if (!isDevelopment && state.activeCoupon) {
        const updatedCoupon = useCouponGeneration(state.activeCoupon.id);
        setState((prev) => ({
          ...prev,
          activeCoupon: updatedCoupon || null,
          couponValidation: updatedCoupon
            ? {
                valid: true,
                coupon: updatedCoupon,
                message: `${updatedCoupon.generationsRemaining} générations restantes`,
              }
            : null,
        }));
      }

      if (!isDevelopment) {
        useVirtualCredit(0.04);
      }

      toast({
        title: "🎉 Transformation réussie !",
        description: `Image générée avec HD-Painter (${state.hdPainterMethod}) en ${(generationTime / 1000).toFixed(1)}s`,
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur de génération:", error);
      setState((prev) => ({ ...prev, isGenerating: false }));

      toast({
        title: "❌ Erreur de génération",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur inattendue s'est produite",
        variant: "error",
      });
    }
  }, [
    state.selectedTransformation,
    state.selectedInpaintImage,
    state.customPrompt,
    state.forceNewGeneration,
    state.couponCode,
    state.couponValidation,
    state.activeCoupon,
    state.hdPainterMethod,
    state.negativePrompt,
    toast,
    generateEnhancedPrompt,
  ]);

  // Debug logging
  useEffect(() => {
    console.log("ChurchTransformation state:", {
      selectedTransformation: state.selectedTransformation,
      selectedLocation: state.selectedLocation,
      isGenerating: state.isGenerating,
      generatedImage: !!state.generatedImage,
      showShareModal: state.showShareModal,
      selectedInpaintImage: state.selectedInpaintImage?.id,
      customPrompt: state.customPrompt.length,
    });
  }, [state]);

  return (
    <div className="w-full max-w-7xl lg:mx-4 sm:mx-1 md:px-4 sm:px-1 lg:px-8 lg:py-4 sm:py-6 lg:space-y-8 space-y-4">
      <VirtualCreditsDisplay />

      <CouponSection state={state} setState={setState} />

      <TransformationGrid
        state={state}
        setState={setState}
        generateEnhancedPrompt={generateEnhancedPrompt}
      />

      <LocationSelection state={state} setState={setState} />

      <PromptEditor
        state={state}
        setState={setState}
        generateEnhancedPrompt={generateEnhancedPrompt}
        onTransform={handleTransform}
      />

      {state.isGenerating && <LoadingState state={state} />}

      {state.generatedImage && (
        <GenerationResults state={state} setState={setState} />
      )}

      {state.showShareModal &&
        state.generatedImage &&
        state.selectedTransformation && (
          <SharePostModal
            isOpen={state.showShareModal}
            onClose={() =>
              setState((prev) => ({ ...prev, showShareModal: false }))
            }
            imageUrl={state.generatedImage}
            imageDescription={`Découvrez cette transformation révolutionnaire de l'église Saint-Gildas d'Auray en ${state.selectedTransformation.name} ! ${state.selectedTransformation.description}`}
          />
        )}
    </div>
  );
};

export default ChurchTransformation;
