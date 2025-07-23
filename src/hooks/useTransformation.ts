import { useCallback } from "react";
import { useToast } from "@/components/ui/toaster";
import { canUseTransformation, useVirtualCredit } from "@/lib/virtual-credits-system";
import { useCouponGeneration } from "@/lib/coupon-system";
import { GenerationState } from "@/lib/church-transformation-types";
import { GenerationResponse } from "@/lib/types";

export const useTransformation = (
  state: GenerationState,
  setState: React.Dispatch<React.SetStateAction<GenerationState>>
) => {
  const { toast } = useToast();

  const handleTransform = useCallback(async () => {
    const isDevelopment = process.env.NODE_ENV === "development" || 
                         window.location.hostname === "localhost" || 
                         window.location.hostname === "127.0.0.1";

    // Vérifications
    if (!isDevelopment && !state.couponValidation?.valid) {
      toast({
        title: "🎫 Coupon requis",
        description: "Vous devez avoir un coupon valide pour générer des transformations.",
        variant: "error",
      });
      return;
    }

    if (!isDevelopment && !canUseTransformation()) {
      toast({
        title: "❌ Crédits insuffisants",
        description: "Faites un don pour débloquer plus de transformations",
        variant: "error",
      });
      return;
    }

    if (!state.selectedTransformation || !state.selectedInpaintImage) {
      toast({
        title: "⚠️ Sélection incomplète",
        description: "Veuillez sélectionner une transformation et une image de base.",
        variant: "error",
      });
      return;
    }

    setState((prev) => ({ ...prev, isGenerating: true }));
    const startTime = Date.now();

    try {
      const mandatoryPeopleRequirement = "MANDATORY: 80 happy diverse people actively using the space. Space must look lived-in with people as the focal point.";
      const fullPrompt = mandatoryPeopleRequirement + " " + state.customPrompt;

      const response = await fetch("/api/inpaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseImage: state.selectedInpaintImage.path,
          maskImage: state.selectedInpaintImage.maskPath,
          prompt: fullPrompt,
          negativePrompt: state.negativePrompt,
          method: state.hdPainterMethod,
          resolution: state.selectedInpaintImage.resolution,
          noCache: state.forceNewGeneration,
          couponCode: isDevelopment ? "DEV_MODE" : state.activeCoupon?.id || state.couponCode,
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

      // Patch: extend data type to allow backend cost fields
      type CostPatched = typeof data & {
        actualCost?: number;
        cost?: number;
        metadata?: {
          costAnalysis?: {
            estimated?: number;
            actual?: number;
            difference?: number;
          };
        };
      };
      const dataWithCost = data as CostPatched;

      // Utiliser le coût réel si disponible, sinon l'estimé
      let finalCost = 0.04;
      if (typeof dataWithCost.actualCost === "number" && !isNaN(dataWithCost.actualCost)) {
        finalCost = dataWithCost.actualCost;
      } else if (typeof dataWithCost.cost === "number" && !isNaN(dataWithCost.cost)) {
        finalCost = dataWithCost.cost;
      }

      setState((prev) => ({
        ...prev,
        generatedImage: data.imageUrl,
        generationTime,
        cost: finalCost, // Coût réel ou estimé
        isGenerating: false,
      }));

      // Log pour analyse des coûts
      if (dataWithCost.metadata?.costAnalysis) {
        const { estimated, actual, difference } = dataWithCost.metadata.costAnalysis;
        const accuracy =
          typeof actual === "number" && actual !== 0 && typeof difference === "number"
            ? Math.max(0, Math.round((1 - Math.abs(difference) / Math.abs(actual)) * 100))
            : 0;
        console.log('📊 Cost Analysis:', {
          estimated,
          actual,
          difference,
          accuracy: `${accuracy}%`
        });
      }

      // Utiliser le coût réel pour les crédits virtuels
      if (!isDevelopment) {
        useVirtualCredit(finalCost);
      }

      toast({
        title: "🎉 Transformation réussie !",
        description: `Image générée en ${(generationTime / 1000).toFixed(1)}s (Coût: ${finalCost.toFixed(3)} crédits)`,
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur de génération:", error);
      setState((prev) => ({ ...prev, isGenerating: false }));
      toast({
        title: "❌ Erreur de génération",
        description: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
        variant: "error",
      });
    }
  }, [state, setState, toast]);

  return { handleTransform };
};

