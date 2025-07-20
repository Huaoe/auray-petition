"use client";

import React, { useState, useEffect } from "react";
import { TransformationGrid } from "./transformation/TransformationGrid";
import { CouponSection } from "./transformation/CouponSection";
import { LocationSelection } from "./transformation/LocationSelection";
import { PromptEditor } from "./transformation/PromptEditor";
import { GenerationResults } from "./transformation/GenerationResults";
import { LoadingState } from "./transformation/LoadingState";
import { VirtualCreditsDisplay } from "./VirtualCreditsDisplay";
import { SharePostModal } from "./SharePostModal";
import { useTransformation } from "@/hooks/useTransformation";
import { usePromptGeneration } from "@/hooks/usePromptGeneration";
import { GenerationState } from "@/lib/church-transformation-types";
import { INPAINT_IMAGES, getDefaultNegativePrompt } from "@/lib/inpaint-config";
import { getActiveCoupon } from "@/lib/coupon-system";

const ChurchTransformation: React.FC = () => {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    selectedTransformation: null,
    selectedLocation: null,
    generatedImage: null,
    originalImage: "",
    generationTime: null,
    cost: null,
    customPrompt: "",
    forceNewGeneration: false,
    couponCode: "",
    activeCoupon: null,
    couponValidation: null,
    selectedInpaintImage: INPAINT_IMAGES[0],
    hdPainterMethod: "hd_painter",
    showMaskPreview: false,
    showShareModal: false,
    negativePrompt: getDefaultNegativePrompt(),
    showNegativePromptPresets: false,
    activeNegativePresets: new Set(),
    isNegativePromptCollapsed: true,
  });

  const { handleTransform } = useTransformation(state, setState);
  const { generateEnhancedPrompt } = usePromptGeneration();

  useEffect(() => {
    const activeCoupon = getActiveCoupon();
    if (activeCoupon) {
      setState(prev => ({ ...prev, activeCoupon }));
    }
  }, []);

  // Mettre à jour la logique de sélection pour utiliser l'ID
  const handleImageSelect = (image: any) => {
    setState(prev => ({
      ...prev,
      selectedInpaintImage: image,
    }));
  };

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
        <GenerationResults 
          state={state} 
          setState={setState}
        />
      )}

      {state.showShareModal && state.generatedImage && state.selectedTransformation && (
        <SharePostModal
          isOpen={state.showShareModal}
          onClose={() => setState(prev => ({ ...prev, showShareModal: false }))}
          imageUrl={state.generatedImage}
          imageDescription={`Découvrez cette transformation révolutionnaire de l'église Saint-Gildas d'Auray en ${state.selectedTransformation.name} ! ${state.selectedTransformation.description}`}
        />
      )}
    </div>
  );
};

export default ChurchTransformation;
