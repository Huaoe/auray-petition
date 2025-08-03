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

const generateEnhancedPrompt = (
  transformationType: string,
  selectedLocation: {
    name: string;
    location: string;
    architecturalStyle: string;
    keyFeatures?: string[];
    description?: string;
  } | null = null,
  baseImageName: string = "Saint-Gildas-Auray-768x576.webp"
): string => {
  const isInterior =
    baseImageName.toLowerCase().includes("interieur") ||
    baseImageName.toLowerCase().includes("inside");

  const transformationNames: Record<string, string> = {
    library: "modern library",
    restaurant: "fine dining restaurant",
    coworking: "modern coworking space",
    concert_hall: "concert hall",
    art_gallery: "art gallery",
    community_center: "community center",
    wellness_spa: "wellness spa",
    innovation_lab: "innovation laboratory",
    market_hall: "market hall",
    gaming_arena: "gaming arena",
    biophilic_sanctuary: "biophilic sanctuary",
    holographic_museum: "holographic museum",
    vertical_farm: "vertical farm",
    quantum_research: "quantum research facility",
    metamorphic_theater: "metamorphic theater",
    neural_interface_lab: "neural interface laboratory",
    crystalline_conservatory: "crystalline conservatory",
    atmospheric_processor: "atmospheric processor",
    temporal_archive: "temporal archive",
    symbiotic_habitat: "symbiotic habitat",
    climbing: "climbing center",
    swimming_pool: "aquatic center",
    sauna_hammam: "sauna hammam spa",
    indoor_skydiving: "indoor skydiving facility",
    trampoline_park: "trampoline park",
    laser_game: "laser tag arena",
    playground: "indoor playground",
    third_place: "community third place",
    fablab: "fabrication laboratory",
    ice_rink: "ice rink",
    cat_cuddling: "cat cuddling café",
  };

  // Base prompt with mandatory requirements
  let prompt = `
      Transform this into ${transformationNames[transformationType]} .
      
      DESIGN: `;

  // Add transformation-specific design elements
  const designElements: Record<string, string> = {
    library:
      "Glass-walled study areas with smart glass technology, floating bookshelves suspended by invisible cables, holographic reading interfaces, and AI-powered knowledge discovery pods that seamlessly blend with Gothic arches.",
    restaurant:
      "Levitating dining platforms, molecular gastronomy stations, interactive table surfaces with embedded displays, and atmospheric lighting that responds to the flavors being served, all within preserved stone walls.",
    coworking:
      "Modular workspace pods that reconfigure automatically, wireless power transmission zones, holographic collaboration spaces, and biometric-responsive environments that adapt to user productivity patterns.",
    concert_hall:
      "Metamorphic acoustic shells that reshape for optimal sound, levitating stage platforms, 360-degree immersive audio systems, and audience seating that moves in harmony with the music's rhythm.",
    art_gallery:
      "Gravity-defying display systems, programmable matter sculptures, neural-responsive lighting that adapts to viewer emotions, and augmented reality layers that reveal hidden artistic dimensions.",
    community_center:
      "Shape-shifting multipurpose spaces, community memory walls with interactive  displays, empathy-enhancing communication pods, and social harmony algorithms that optimize group interactions.",
    wellness_spa:
      "Levitating meditation chambers, chromotherapy pools with programmable water molecules, bio-resonance healing pods, and atmospheric processors that generate personalized healing environments.",
    innovation_lab:
      "Quantum computing clusters housed in crystal formations, matter manipulation chambers, time-dilated research pods, and consciousness-expansion interfaces integrated within sacred geometry.",
    market_hall:
      "Floating vendor stalls with gravity-defying product displays, flavor-transmission technology, cultural exchange pods, and community abundance algorithms that ensure equitable resource distribution.",
    gaming_arena:
      "Neural-interface gaming pods, holographic battle arenas, consciousness-merging multiplayer systems, and spectator empathy chambers that allow audiences to experience gameplay emotions.",
    biophilic_sanctuary:
      "Living architectural elements that grow and adapt, symbiotic human-plant interfaces, atmospheric oxygen generation systems, and bio-luminescent pathways that respond to natural circadian rhythms.",
    holographic_museum:
      "Temporal exhibition chambers displaying past and future simultaneously, consciousness-recording devices for experiential history, quantum artifact preservation fields, and visitor memory integration systems.",
    vertical_farm:
      "Multi-dimensional growing matrices defying traditional space constraints, plant-consciousness communication networks, automated nutrient optimization systems, and harvest-to-table teleportation pods.",
    quantum_research:
      "Reality manipulation chambers, parallel universe observation decks, quantum entanglement communication arrays, and consciousness-quantum field interface laboratories within sacred stone walls.",
    metamorphic_theater:
      "Reality-bending performance spaces, audience-actor consciousness merging systems, temporal narrative loops, and emotional resonance amplification chambers that transform spectators into participants.",
    neural_interface_lab:
      "Consciousness expansion chambers, thought-to-reality manifestation pods, collective intelligence networks, and spiritual-technological synthesis laboratories honoring the sacred space's heritage.",
    crystalline_conservatory:
      "Resonant crystal formations that generate music from architectural vibrations, harmonic healing chambers, sound-to-light conversion systems, and acoustic levitation performance spaces.",
    atmospheric_processor:
      "Planetary-scale air purification systems, weather generation chambers, atmospheric composition laboratories, and climate harmony restoration pods integrated into Gothic structural elements.",
    temporal_archive:
      "Time-locked preservation chambers, quantum memory storage crystals,  consciousness recording systems, and eternal knowledge preservation pods that transcend temporal limitations.",
    symbiotic_habitat:
      "Human-nature consciousness merger zones, bio-architectural growth systems, interspecies communication networks, and evolutionary acceleration chambers where beings and environment co-evolve harmoniously.",
  };

  prompt +=
    designElements[transformationType] ||
    "Contemporary design elements that respect and enhance the  architecture.";

  // Add lighting and atmosphere
  prompt += `
  
              LIGHTING: Natural light through stained glass with warm artificial lighting highlighting both old and new elements.
              
              QUALITY: Photorealistic, 8K, professional lighting, detailed textures, vibrant colors, sharp focus.`;

  if (selectedLocation) {
    const locationInspiration = `
            Inspired by ${selectedLocation.name} (${selectedLocation.location}):
            - Architectural style: ${selectedLocation.architecturalStyle}
            - Key features: ${selectedLocation.keyFeatures?.join(", ")}

            ${selectedLocation.description}`;

    prompt = `${prompt}\n\n${locationInspiration}`;
  }

  return prompt;
};

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
    isHDPainterControlsCollapsed: true,
    isPromptEditorCollapsed: true,
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
        "MANDATORY: 180 happy diverse people actively using the space. Space must look lived-in with people as the focal point.";

      // Get the base prompt from the hook
      let basePrompt = "";
      if (state.selectedTransformation) {
        basePrompt = generateEnhancedPrompt(
          state.selectedTransformation.id,
          state.selectedLocation,
          state.selectedInpaintImage?.path || "Saint-Gildas-Auray-768x576.webp"
        );
      }

      // Combine the mandatory requirement with the base prompt and custom prompt
      const fullPrompt =
        mandatoryPeopleRequirement +
        " " +
        basePrompt +
        " " +
        state.customPrompt;

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
    state.selectedLocation,
    state.selectedInpaintImage,
    state.customPrompt,
    state.forceNewGeneration,
    state.couponCode,
    state.couponValidation,
    state.activeCoupon,
    state.hdPainterMethod,
    state.negativePrompt,
    toast,
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

      <LocationSelection
        state={state}
        setState={setState}
        generateEnhancedPrompt={generateEnhancedPrompt}
      />

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
