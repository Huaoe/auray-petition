"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Sparkles,
  Download,
  Share2,
  RotateCcw,
  Zap,
  Ticket,
  AlertCircle,
  Paintbrush,
  Target,
  Layers,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";
import {
  TRANSFORMATION_TYPES,
  type TransformationType,
  type GenerationResponse,
} from "@/lib/types";
import {
  INPAINT_IMAGES,
  type InpaintImage,
  type HDPainterMethod,
} from "@/lib/inpaint-config";
import {
  validateAndUseCoupon,
  useCouponGeneration,
  getActiveCoupon,
  type CouponData,
  type CouponValidationResult,
} from "@/lib/coupon-system";

interface GenerationState {
  isGenerating: boolean;
  selectedTransformation: TransformationType | null;
  generatedImage: string | null;
  originalImage: string;
  generationTime: number | null;
  cost: number | null;
  customPrompt: string;
  forceNewGeneration: boolean;
  couponCode: string;
  activeCoupon: CouponData | null;
  couponValidation: CouponValidationResult | null;
  // HD-Painter specific
  selectedInpaintImage: InpaintImage | null;
  hdPainterMethod: HDPainterMethod;
  showMaskPreview: boolean;
}

const ChurchTransformation = () => {
  const { toast } = useToast();

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    selectedTransformation: null,
    generatedImage: null,
    originalImage: INPAINT_IMAGES[0].path, // Première image par défaut
    generationTime: null,
    cost: null,
    customPrompt: "",
    forceNewGeneration: false,
    couponCode: "",
    activeCoupon: null,
    couponValidation: null,
    // HD-Painter defaults
    selectedInpaintImage: INPAINT_IMAGES[0],
    hdPainterMethod: "painta+rasg", // Méthode par défaut
    showMaskPreview: false,
  });

  // État pour suivre l'image de base sélectionnée
  const [selectedBaseImage, setSelectedBaseImage] = useState(INPAINT_IMAGES[0]);
  // Ref synchrone pour toujours disposer de l'image sélectionnée courante
  const selectedBaseImageRef = useRef<InpaintImage>(INPAINT_IMAGES[0]);

  // 🎫 Charger le coupon actif au montage du composant
  useEffect(() => {
    const activeCoupon = getActiveCoupon();
    if (activeCoupon) {
      setState((prev) => ({
        ...prev,
        activeCoupon,
        couponCode: activeCoupon.id,
        couponValidation: {
          valid: true,
          coupon: activeCoupon,
          message: `Coupon actif: ${activeCoupon.generationsRemaining} générations restantes`,
        },
      }));
    }
  }, []);

  // 🎫 Fonction pour valider un coupon manuellement
  const handleCouponValidation = useCallback(
    (code: string) => {
      const validation = validateAndUseCoupon(code);
      setState((prev) => ({
        ...prev,
        couponCode: code,
        couponValidation: validation,
        activeCoupon: validation.coupon || null,
      }));

      if (validation.valid) {
        toast({
          title: "✅ Coupon validé",
          description: validation.message,
          variant: "default",
        });
      } else {
        toast({
          title: "❌ Coupon invalide",
          description: validation.message,
          variant: "error",
        });
      }
    },
    [toast]
  );

  const handleReset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedTransformation: null,
      generatedImage: null,
      generationTime: null,
      cost: null,
    }));
  }, []);

  // 🎨 Fonction pour sélectionner une image d'inpainting
  const handleInpaintImageSelect = useCallback(
    (imageIndex: number) => {
      const selectedImage = INPAINT_IMAGES[imageIndex];
      setSelectedBaseImage(selectedImage);
      selectedBaseImageRef.current = selectedImage;

      setState((prev) => ({
        ...prev,
        selectedInpaintImage: selectedImage,
        originalImage: selectedImage.path,
        hdPainterMethod: selectedImage.hdPainterMethod, // Méthode recommandée
        generatedImage: null, // Reset l'image générée
      }));

      toast({
        title: "🎯 Image sélectionnée",
        description: `${selectedImage.name} - Méthode HD-Painter: ${selectedImage.hdPainterMethod}`,
        variant: "default",
      });
    },
    [toast]
  );

  // 🎨 Fonction pour changer la méthode HD-Painter
  const handleHDPainterMethodChange = useCallback((method: HDPainterMethod) => {
    setState((prev) => ({
      ...prev,
      hdPainterMethod: method,
    }));
  }, []);

  // 🔍 Toggle mask preview
  const handleToggleMaskPreview = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showMaskPreview: !prev.showMaskPreview,
    }));
  }, []);

  const handleTransform = useCallback(async () => {
    // Vérification coupon obligatoire
    if (!state.couponValidation?.valid) {
      toast({
        title: "🎫 Coupon requis",
        description:
          "Vous devez avoir un coupon valide pour générer des transformations.",
        variant: "error",
      });
      return;
    }

    // Vérification générations restantes
    if (state.activeCoupon && state.activeCoupon.generationsRemaining <= 0) {
      toast({
        title: "❌ Plus de générations",
        description: "Votre coupon n'a plus de générations disponibles.",
        variant: "error",
      });
      return;
    }

    // Vérifications de base
    if (!state.selectedTransformation || !state.selectedInpaintImage) {
      toast({
        title: "⚠️ Sélection incomplète",
        description:
          "Veuillez sélectionner une transformation et une image de base.",
        variant: "error",
      });
      return;
    }

    setState((prev) => ({ ...prev, isGenerating: true }));
    const startTime = Date.now();

    try {
      // Construction du prompt avec exigence obligatoire
      const mandatoryPeopleRequirement =
        "MANDATORY REQUIREMENT: The space must be filled with happy, trendy, modern people of diverse ages and backgrounds actively enjoying and using the transformed space. Show people laughing, socializing, working, or engaging with the new environment in a joyful and contemporary way.";
      const fullPrompt = state.customPrompt + " " + mandatoryPeopleRequirement;

      const response = await fetch("/api/inpaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          baseImage: state.selectedInpaintImage.path,
          maskImage: state.selectedInpaintImage.maskPath, // Masque correspondant à l'image
          prompt: fullPrompt,
          method: state.hdPainterMethod,
          resolution: state.selectedInpaintImage.resolution,
          noCache: state.forceNewGeneration,
          couponCode: state.couponCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data: GenerationResponse = await response.json();
      const endTime = Date.now();
      const generationTime = endTime - startTime;

      setState((prev) => ({
        ...prev,
        generatedImage: data.imageUrl,
        generationTime,
        cost: data.metadata?.cost ?? 0.04, // Coût Stability AI
        isGenerating: false,
      }));

      // Décrémentation du coupon après succès
      if (state.activeCoupon) {
        const updatedCoupon = useCouponGeneration(state.couponCode);
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
    toast,
  ]);

  const handleDownload = useCallback(async () => {
    if (!state.generatedImage) return;

    try {
      const response = await fetch(state.generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `eglise-auray-${state.selectedTransformation?.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "📥 Image téléchargée !",
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "❌ Erreur de téléchargement",
        variant: "error",
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
          title: "🚀 Partagé avec succès !",
          variant: "success",
          duration: 2000,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        toast({
          title: "📋 Lien copié dans le presse-papiers !",
          variant: "success",
          duration: 2000,
        });
      }
    } else {
      navigator.clipboard.writeText(
        `${shareData.title}\n${shareData.text}\n${shareData.url}`
      );
      toast({
        title: "📋 Lien copié dans le presse-papiers !",
        variant: "success",
        duration: 2000,
      });
    }
  }, [state.generatedImage, state.selectedTransformation, toast]);

  const handleCustomPromptChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setState((prev) => ({ ...prev, customPrompt: event.target.value }));
    },
    []
  );

  const handleTransformationSelect = useCallback(
    (transformation: TransformationType) => {
      // Generate the enhanced prompt immediately for preview
      const baseImageName =
        selectedBaseImageRef.current.path.split("/").pop() ||
        "Saint-Gildas-Auray-768x576.webp";
      const enhancedPrompt = generateEnhancedPrompt(
        transformation.id,
        transformation.prompt,
        baseImageName
      );

      setState((prev) => ({
        ...prev,
        selectedTransformation: transformation,
        generatedImage: null,
        generationTime: null,
        cost: null,
        customPrompt: enhancedPrompt,
      }));
    },
    []
  );

  const handleCustomPromptReset = useCallback(() => {
    if (!state.selectedTransformation) return;

    // Get the base image name for prompt generation
    const baseImageName =
      selectedBaseImageRef.current.path.split("/").pop() ||
      "Saint-Gildas-Auray-768x576.webp";

    // Regenerate the default prompt for the current transformation
    const defaultPrompt = generateEnhancedPrompt(
      state.selectedTransformation.id,
      state.selectedTransformation.prompt,
      baseImageName
    );

    // Update the state with the default prompt
    setState((prev) => ({
      ...prev,
      customPrompt: defaultPrompt,
    }));

    // Show a toast notification
    toast({
      title: "Prompt réinitialisé",
      description: "Le prompt a été réinitialisé à sa valeur par défaut.",
      variant: "success",
      duration: 2000,
    });
  }, [state.selectedTransformation, toast]);

  const handleForceNewGenerationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({
        ...prev,
        forceNewGeneration: event.target.checked,
      }));
    },
    []
  );

  // Function to generate enhanced prompt (moved from API to client-side for preview)
  const generateEnhancedPrompt = useCallback(
    (
      transformationType: string,
      basePrompt: string,
      baseImageName: string = "Saint-Gildas-Auray-768x576.webp"
    ): string => {
      // Analyze base image to understand perspective and architectural features
      const isInterior =
        baseImageName.toLowerCase().includes("interieur") ||
        baseImageName.toLowerCase().includes("inside") ||
        baseImageName.toLowerCase().includes("english-inside");

      // Transformation type to readable name
      const transformationNames: Record<string, string> = {
        library: "high-tech library",
        restaurant: "gourmet restaurant",
        coworking: "modern coworking space",
        concert_hall: "concert hall",
        art_gallery: "art gallery",
        community_center: "community center",
        wellness_spa: "wellness spa",
        innovation_lab: "innovation laboratory",
        market_hall: "market hall",
        gaming_arena: "gaming arena",
      };

      // Base prompt with mandatory requirements
      let prompt = `MANDATORY: 40-80 happy, diverse people actively using the space (sitting, working, socializing). Include appropriate furniture matching the ${transformationNames[transformationType] || "transformed space"}. Space must look lived-in with people as the focal point.
  
  Transform this church into ${transformationNames[transformationType] || "a transformed space"} that blends modern functionality with historical architecture.
  
  ARCHITECTURE: Preserve stone arches, vaulted ceilings, stained glass, and Gothic proportions while integrating modern elements.
  
  DESIGN: `;

      // Add transformation-specific design elements
      const designElements: Record<string, string> = {
        library:
          "Glass-walled study areas, modern bookshelves, reading nooks, and digital resource centers that complement the historical structure.",
        restaurant:
          "Elegant dining areas, ambient lighting, and contemporary decor that creates a sophisticated yet welcoming atmosphere.",
        coworking:
          "Flexible workspaces, meeting pods, and collaborative areas with modern technology integrated into the historical space.",
        concert_hall:
          "State-of-the-art stage and seating designed to showcase both performances and the building's architectural beauty.",
        art_gallery:
          "Modern display systems and lighting that highlight both the artwork and the historic architecture.",
        community_center:
          "Versatile spaces for various activities, maintaining the building's sense of community and history.",
        wellness_spa:
          "Tranquil treatment rooms and relaxation areas that respect the spiritual nature of the original space.",
        innovation_lab:
          "Cutting-edge research facilities and collaborative workspaces that contrast with the historical elements.",
        market_hall:
          "Vibrant market stalls and gathering spaces that bring new life to the historic structure.",
        gaming_arena:
          "Modern gaming facilities and spectator areas that respect the building's architectural significance.",
      };

      prompt +=
        designElements[transformationType] ||
        "Contemporary design elements that respect and enhance the historical architecture.";

      // Add lighting and atmosphere
      prompt += `
  
  LIGHTING: Natural light through stained glass with warm artificial lighting highlighting both old and new elements.
  
  QUALITY: Photorealistic, 8K, professional lighting, detailed textures, vibrant colors, sharp focus.`;

      return prompt;
    },
    []
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* 🎫 Section Coupon */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-green-600" />
            Code coupon de génération
          </CardTitle>
          <CardDescription>
            Entrez votre code de coupon pour accéder aux générations d'images
            IA. Vous obtenez 5 générations gratuites en signant la pétition.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coupon-input" className="text-sm font-medium">
              Code coupon (format: XXXX-XXXX-XXXX)
            </Label>
            <Input
              id="coupon-input"
              type="text"
              value={state.couponCode}
              onChange={(e) => {
                const upperCode = e.target.value.toUpperCase();
                setState((prev) => ({ ...prev, couponCode: upperCode }));
                if (upperCode.length === 14) {
                  // XXXX-XXXX-XXXX = 14 chars
                  handleCouponValidation(upperCode);
                }
              }}
              placeholder="Entrez votre code coupon..."
              className="w-full"
              maxLength={14}
            />
          </div>

          {/* Statut du coupon */}
          {state.couponValidation && (
            <div
              className={`p-3 rounded-lg border ${
                state.couponValidation.valid
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {state.couponValidation.valid ? (
                  <Ticket className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm font-medium">
                  {state.couponValidation.message}
                </span>
              </div>
              {state.couponValidation.valid && state.activeCoupon && (
                <div className="mt-2 text-xs">
                  <div className="flex justify-between">
                    <span>Générations restantes:</span>
                    <span className="font-bold">
                      {state.activeCoupon.generationsRemaining}/5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expire le:</span>
                    <span>
                      {new Date(
                        state.activeCoupon.expiresAt
                      ).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lien vers la pétition si pas de coupon */}
          {!state.couponValidation?.valid && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                🎫 Pas encore de coupon ?
              </p>
              <p className="text-xs text-blue-600 mb-3">
                Signez la pétition pour recevoir 5 générations gratuites
                d'images IA !
              </p>
              <Button
                onClick={() => window.open("/", "_blank")}
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                📝 Signer la pétition
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Image Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choisissez une image de base</CardTitle>
          <CardDescription>
            Sélectionnez l'image de l'église que vous souhaitez transformer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INPAINT_IMAGES.map((image, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  state.selectedInpaintImage?.path === image.path
                    ? "border-blue-500 shadow-lg scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleInpaintImageSelect(index)}
              >
                <div className="aspect-square">
                  <img
                    src={
                      state.showMaskPreview &&
                      state.selectedInpaintImage?.path === image.path
                        ? image.maskPath
                        : image.path
                    }
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-end">
                  <div className="p-3 bg-gradient-to-t from-black to-transparent w-full">
                    <h3 className="text-white font-semibold text-sm">
                      {image.name}
                    </h3>
                    <p className="text-gray-200 text-xs">{image.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {image.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs text-white border-white"
                      >
                        {image.hdPainterMethod}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs text-white border-white"
                      >
                        {image.resolution}
                      </Badge>
                    </div>
                  </div>
                </div>
                {state.selectedInpaintImage?.path === image.path && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contrôles HD-Painter */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paintbrush className="w-4 h-4" />
                <Label>Méthode HD-Painter</Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleMaskPreview}
                className="flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                {state.showMaskPreview ? "Voir Image" : "Voir Masque"}
              </Button>
            </div>

            <Select
              value={state.hdPainterMethod}
              onValueChange={handleHDPainterMethodChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir méthode HD-Painter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baseline">
                  <div className="flex flex-col">
                    <span>Baseline</span>
                    <span className="text-xs text-gray-500">
                      Transformation standard
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="painta">
                  <div className="flex flex-col">
                    <span>PAIntA</span>
                    <span className="text-xs text-gray-500">
                      Amélioration cohérence prompt
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="rasg">
                  <div className="flex flex-col">
                    <span>RASG</span>
                    <span className="text-xs text-gray-500">
                      Guidance attention score
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="painta+rasg">
                  <div className="flex flex-col">
                    <span>PAIntA + RASG</span>
                    <span className="text-xs text-gray-500">
                      Qualité maximale (recommandé)
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {state.selectedInpaintImage && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">
                  🎯 Configuration actuelle:
                </h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Image:</strong> {state.selectedInpaintImage.name}
                  </p>
                  <p>
                    <strong>Type:</strong> {state.selectedInpaintImage.type}
                  </p>
                  <p>
                    <strong>Méthode:</strong> {state.hdPainterMethod}
                  </p>
                  <p>
                    <strong>Résolution:</strong>{" "}
                    {state.selectedInpaintImage.resolution}
                  </p>
                  <p>
                    <strong>Masque:</strong>{" "}
                    {state.selectedInpaintImage.maskPath}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
          Découvrez 10 visions révolutionnaires de l'église Saint-Gildas
          d'Auray, générées par l'intelligence artificielle en temps réel
        </p>
        <Badge variant="secondary" className="text-sm">
          ⚡ Génération instantanée • 🎨 HD Qualité • 🔄 Illimité
        </Badge>
      </div>

      {/* Transformation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {TRANSFORMATION_TYPES.map((transformation) => (
          <Card
            key={transformation.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              state.selectedTransformation?.id === transformation.id
                ? "ring-2 ring-purple-500 bg-purple-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleTransformationSelect(transformation)}
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

      {/* Custom Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>Personnalisez votre prompt</CardTitle>
          <CardDescription>
            Modifiez le prompt pour obtenir des résultats plus précis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={state.customPrompt}
            onChange={handleCustomPromptChange}
            placeholder="Sélectionnez d'abord une transformation pour voir le prompt par défaut..."
            className="w-full min-h-[80px] max-h-[320px] p-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-hidden"
            disabled={!state.selectedTransformation}
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
          {state.selectedTransformation && (
            <div className="flex justify-end mt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCustomPromptReset}
                disabled={!state.selectedTransformation}
              >
                Réinitialiser le prompt
              </Button>
            </div>
          )}
          {state.selectedTransformation && (
            <div className="mt-4 flex flex-col items-center space-y-3">
              <Button
                onClick={handleTransform}
                disabled={state.isGenerating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
              >
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
                <span>HD-Painter Qualité HD • Style vivant</span>
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Image Comparison Section */}
      {state.generatedImage && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <span className="text-2xl">
                {state.selectedTransformation?.icon}
              </span>
              {state.selectedTransformation?.name}
            </CardTitle>
            <CardDescription>
              {state.selectedTransformation?.description}
            </CardDescription>
            {state.generationTime && (
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span>
                  ⏱️ Généré en {(state.generationTime / 1000).toFixed(1)}s
                </span>
                {state.cost && <span>💰 {state.cost.toFixed(3)}&nbsp;</span>}
                <span>
                  <span className="mx-1">→</span>
                  <span className="font-bold">{state.cost.toFixed(3)}€</span>
                </span>
                <span className="mx-1">🙏</span>
                <span>
                  <a
                    href="https://www.buymeacoffee.com/auraycollectif"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md shadow transition-colors text-sm ml-4"
                  >
                    ☕ Offrez-moi un café
                  </a>
                </span>
                <span className="mx-1">→</span>
                <span className="mx-1">🦄💓🖖</span>
                <span className="mx-1">→</span>
                <span className="mx-1">🏄‍♀️</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Originale */}
              <div className="space-y-2">
                <h3 className="font-semibold text-center">
                  🏛️ Église Actuelle: {selectedBaseImage.name}
                </h3>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                  {state.originalImage ? (
                    <img
                      src={state.originalImage}
                      alt="Église Saint-Gildas d'Auray - Vue actuelle"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              </div>

              {/* Image Transformée */}
              <div className="space-y-2">
                <h3 className="font-semibold text-center">
                  ✨ Transformation IA: {state.selectedTransformation?.name}
                </h3>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                  {state.generatedImage ? (
                    <img
                      src={state.generatedImage}
                      alt={`Église transformée en ${state.selectedTransformation?.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
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

      {/* Info Footer */}
      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>
          🤖 Propulsé par HD-Painter (ICLR 2025) • 🎯 Inpainting haute précision
          • ✨ 100% Gratuit
        </p>
        <p>
          💡 HD-Painter préserve l'architecture originale avec masques de
          précision pour des résultats cohérents
        </p>
      </div>
    </div>
  );
};

export default ChurchTransformation;
