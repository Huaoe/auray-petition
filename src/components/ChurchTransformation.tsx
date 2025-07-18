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
import { SharePostModal } from "@/components/SharePostModal";
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
  selectedLocation:FamousLocation |null;
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
  // Social Media Sharing
  showShareModal: boolean;
}

// Famous locations data structure organized by transformation types
interface FamousLocation {
  id: string;
  name: string;
  location: string;
  description: string;
  architecturalStyle: string;
  keyFeatures: string[];
  promptEnhancement: string;
}

const FAMOUS_LOCATIONS: Record<string, FamousLocation[]> = {
  library: [
    {
      id: "trinity-college",
      name: "Trinity College Library",
      location: "Dublin, Ireland",
      description:
        "The Long Room with its barrel-vaulted ceiling and towering oak shelves",
      architecturalStyle: "Georgian/Classical",
      keyFeatures: [
        "Barrel-vaulted ceiling",
        "Oak galleries",
        "Classical columns",
        "Natural lighting",
      ],
      promptEnhancement:
        "with the majestic barrel-vaulted ceiling and towering oak galleries of Trinity College Dublin's Long Room, featuring classical columns and warm natural lighting filtering through tall windows",
    },
    {
      id: "beinecke-library",
      name: "Beinecke Rare Book Library",
      location: "Yale University, USA",
      description:
        "Modernist cube with translucent marble walls creating ethereal lighting",
      architecturalStyle: "Modernist",
      keyFeatures: [
        "Translucent marble walls",
        "Floating glass cube",
        "Ethereal lighting",
        "Minimalist design",
      ],
      promptEnhancement:
        "inspired by Yale's Beinecke Library with its translucent marble walls creating ethereal, diffused lighting and floating glass display cases in a minimalist modernist design",
    },
  ],
  restaurant: [
    {
      id: "le-bernardin",
      name: "Le Bernardin",
      location: "New York, USA",
      description:
        "Elegant fine dining with sophisticated lighting and luxurious materials",
      architecturalStyle: "Contemporary Luxury",
      keyFeatures: [
        "Sophisticated lighting",
        "Luxurious materials",
        "Intimate seating",
        "Refined atmosphere",
      ],
      promptEnhancement:
        "with the sophisticated elegance of Le Bernardin NYC, featuring refined lighting, luxurious materials, and intimate dining spaces with impeccable attention to detail",
    },
    {
      id: "noma",
      name: "Noma",
      location: "Copenhagen, Denmark",
      description:
        "Nordic minimalism with natural materials and connection to nature",
      architecturalStyle: "Nordic Minimalism",
      keyFeatures: [
        "Natural materials",
        "Minimalist design",
        "Nature connection",
        "Warm lighting",
      ],
      promptEnhancement:
        "inspired by Copenhagen's Noma with its Nordic minimalist design, natural wood materials, and seamless connection between interior and nature through large windows",
    },
  ],
  coworking: [
    {
      id: "wework-london",
      name: "WeWork London",
      location: "London, UK",
      description:
        "Modern collaborative spaces with flexible layouts and vibrant design",
      architecturalStyle: "Contemporary Industrial",
      keyFeatures: [
        "Flexible layouts",
        "Vibrant colors",
        "Industrial elements",
        "Collaborative zones",
      ],
      promptEnhancement:
        "with the dynamic energy of WeWork London, featuring flexible modular workspaces, vibrant colors, industrial design elements, and diverse collaborative zones",
    },
  ],
  concert_hall: [
    {
      id: "philharmonie-paris",
      name: "Philharmonie de Paris",
      location: "Paris, France",
      description:
        "Modern architectural marvel with flowing metallic exterior and dramatic interior",
      architecturalStyle: "Contemporary",
      keyFeatures: [
        "Flowing metallic forms",
        "Dramatic interior",
        "Acoustic excellence",
        "Modern design",
      ],
      promptEnhancement:
        "with the flowing metallic architecture and dramatic interior spaces of Paris's Philharmonie, featuring contemporary design excellence and world-class acoustics",
    },
    {
      id: "royal-albert-hall",
      name: "Royal Albert Hall",
      location: "London, UK",
      description:
        "Victorian grandeur with circular amphitheater and ornate details",
      architecturalStyle: "Victorian",
      keyFeatures: [
        "Circular amphitheater",
        "Ornate details",
        "Red brick facade",
        "Historic grandeur",
      ],
      promptEnhancement:
        "inspired by London's Royal Albert Hall with its Victorian grandeur, circular amphitheater design, ornate architectural details, and majestic red brick facade",
    },
  ],
  art_gallery: [
    {
      id: "guggenheim-bilbao",
      name: "Guggenheim Bilbao",
      location: "Bilbao, Spain",
      description:
        "Titanium curves and flowing forms creating dynamic exhibition spaces",
      architecturalStyle: "Deconstructivist",
      keyFeatures: [
        "Titanium curves",
        "Flowing forms",
        "Dynamic spaces",
        "Natural lighting",
      ],
      promptEnhancement:
        "with the flowing titanium curves and dynamic forms of Guggenheim Bilbao, featuring deconstructivist architecture and naturally lit exhibition spaces",
    },
    {
      id: "louvre-abu-dhabi",
      name: "Louvre Abu Dhabi",
      location: "Abu Dhabi, UAE",
      description:
        "Dome of light creating a 'rain of light' effect, inspired by palm fronds",
      architecturalStyle: "Contemporary Islamic",
      keyFeatures: [
        "Perforated dome",
        "Rain of light effect",
        "Water features",
        "Geometric patterns",
      ],
      promptEnhancement:
        "inspired by the Louvre Abu Dhabi's iconic 'rain of light' dome, featuring intricate geometric patterns, diffused natural light, and a serene, contemplative atmosphere",
    },
  ],
  community_center: [
    {
      id: "carnegie-hall-community",
      name: "Carnegie Hall Community Center",
      location: "New York, USA",
      description:
        "Historic venue transformed into a vibrant community gathering space",
      architecturalStyle: "Neoclassical Revival",
      keyFeatures: [
        "Flexible meeting spaces",
        "Historic grandeur",
        "Community stage",
        "Social gathering areas",
      ],
      promptEnhancement:
        "with the welcoming grandeur of Carnegie Hall's community spaces, featuring flexible meeting areas, historic architectural details, and warm gathering zones that foster community connection",
    },
  ],
  wellness_spa: [
    {
      id: "therme-vals",
      name: "Therme Vals",
      location: "Vals, Switzerland",
      description:
        "Minimalist thermal spa carved into mountainside with stone and water harmony",
      architecturalStyle: "Contemporary Minimalism",
      keyFeatures: [
        "Stone and water integration",
        "Natural lighting",
        "Minimalist design",
        "Thermal pools",
      ],
      promptEnhancement:
        "inspired by Therme Vals with its harmonious integration of stone and water, featuring minimalist design, natural thermal elements, and serene spaces carved from natural materials",
    },
  ],
  innovation_lab: [
    {
      id: "mit-media-lab",
      name: "MIT Media Lab",
      location: "Cambridge, USA",
      description:
        "Cutting-edge research facility with transparent, collaborative spaces",
      architecturalStyle: "High-Tech Contemporary",
      keyFeatures: [
        "Transparent facades",
        "Collaborative spaces",
        "High-tech equipment",
        "Flexible layouts",
      ],
      promptEnhancement:
        "with the innovative transparency of MIT Media Lab, featuring glass-walled research spaces, collaborative zones, cutting-edge technology integration, and flexible experimental environments",
    },
  ],
  market_hall: [
    {
      id: "mercado-san-miguel",
      name: "Mercado de San Miguel",
      location: "Madrid, Spain",
      description:
        "Historic iron and glass market hall with gourmet food stalls",
      architecturalStyle: "Iron and Glass Architecture",
      keyFeatures: [
        "Iron framework",
        "Glass walls",
        "Food stalls",
        "Central circulation",
      ],
      promptEnhancement:
        "inspired by Madrid's Mercado de San Miguel with its elegant iron and glass architecture, featuring artisanal food stalls, central circulation spaces, and historic market atmosphere",
    },
  ],
  gaming_arena: [
    {
      id: "esports-stadium-arlington",
      name: "Esports Stadium Arlington",
      location: "Arlington, USA",
      description:
        "Purpose-built esports venue with stadium seating and broadcast facilities",
      architecturalStyle: "Modern Sports Architecture",
      keyFeatures: [
        "Stadium seating",
        "LED displays",
        "Broadcast facilities",
        "Gaming stations",
      ],
      promptEnhancement:
        "with the high-energy atmosphere of Esports Stadium Arlington, featuring tiered gaming stations, massive LED displays, broadcast-quality lighting, and spectator seating designed for competitive gaming",
    },
  ],
  biophilic_sanctuary: [
    {
      id: "singapore-changi-jewel",
      name: "Changi Airport Jewel",
      location: "Singapore",
      description:
        "Indoor forest with waterfall and nature integration in modern architecture",
      architecturalStyle: "Biophilic Contemporary",
      keyFeatures: [
        "Indoor waterfall",
        "Living walls",
        "Natural lighting",
        "Organic forms",
      ],
      promptEnhancement:
        "inspired by Singapore's Changi Jewel with its spectacular indoor forest, featuring cascading water features, living walls, natural light integration, and seamless nature-architecture fusion",
    },
  ],
  holographic_museum: [
    {
      id: "teamlab-borderless",
      name: "teamLab Borderless",
      location: "Tokyo, Japan",
      description:
        "Digital art museum with immersive projections and interactive spaces",
      architecturalStyle: "Digital Immersive",
      keyFeatures: [
        "Projection mapping",
        "Interactive displays",
        "Flowing spaces",
        "Digital art",
      ],
      promptEnhancement:
        "with the immersive digital artistry of teamLab Borderless Tokyo, featuring flowing projection-mapped spaces, interactive holographic displays, and seamless digital-physical integration",
    },
  ],
  vertical_farm: [
    {
      id: "aerofarms-newark",
      name: "AeroFarms Newark",
      location: "Newark, USA",
      description:
        "World's largest vertical farm with LED growing systems and automation",
      architecturalStyle: "Industrial Agricultural",
      keyFeatures: [
        "Vertical growing towers",
        "LED grow lights",
        "Automated systems",
        "Climate control",
      ],
      promptEnhancement:
        "inspired by AeroFarms Newark with its revolutionary vertical growing systems, featuring multi-story cultivation towers, precision LED lighting, automated harvesting systems, and sustainable agricultural technology",
    },
  ],
  quantum_research: [
    {
      id: "cern-facility",
      name: "CERN Research Facility",
      location: "Geneva, Switzerland",
      description:
        "World-renowned particle physics laboratory with cutting-edge equipment",
      architecturalStyle: "High-Tech Scientific",
      keyFeatures: [
        "Clean room environments",
        "Scientific equipment",
        "Precision engineering",
        "Research facilities",
      ],
      promptEnhancement:
        "with the precision and innovation of CERN's research facilities, featuring ultra-modern clean rooms, cutting-edge scientific equipment, electromagnetic isolation chambers, and world-class research infrastructure",
    },
  ],
  metamorphic_theater: [
    {
      id: "guthrie-theater",
      name: "Guthrie Theater",
      location: "Minneapolis, USA",
      description:
        "Innovative theater with flexible staging and architectural adaptability",
      architecturalStyle: "Contemporary Theatrical",
      keyFeatures: [
        "Flexible staging",
        "Adaptable seating",
        "Dynamic lighting",
        "Modular design",
      ],
      promptEnhancement:
        "inspired by the Guthrie Theater's innovative design with its flexible staging configurations, adaptable seating arrangements, dynamic lighting systems, and modular performance spaces",
    },
  ],
  neural_interface_lab: [
    {
      id: "neuralink-facility",
      name: "Neuralink Research Facility",
      location: "Fremont, USA",
      description:
        "Brain-computer interface research lab with meditation and technology integration",
      architecturalStyle: "Neuro-Tech Contemporary",
      keyFeatures: [
        "Research stations",
        "Meditation chambers",
        "Clean environments",
        "Advanced monitoring",
      ],
      promptEnhancement:
        "with the cutting-edge serenity of Neuralink's research environment, featuring brain-computer interface stations, contemplative meditation chambers, advanced neural monitoring systems, and spaces that bridge technology and consciousness",
    },
  ],
  crystalline_conservatory: [
    {
      id: "harpa-reykjavik",
      name: "Harpa Concert Hall",
      location: "Reykjavik, Iceland",
      description:
        "Crystalline facade concert hall with geometric glass architecture",
      architecturalStyle: "Crystalline Contemporary",
      keyFeatures: [
        "Geometric glass facade",
        "Prismatic lighting",
        "Acoustic excellence",
        "Crystal-inspired design",
      ],
      promptEnhancement:
        "inspired by Reykjavik's Harpa Concert Hall with its stunning crystalline facade, featuring geometric glass patterns, prismatic light effects, superior acoustics, and mineral-inspired architectural elements",
    },
  ],
  atmospheric_processor: [
    {
      id: "eden-project",
      name: "Eden Project",
      location: "Cornwall, UK",
      description:
        "Massive biomes with climate control and atmospheric management systems",
      architecturalStyle: "Geodesic Environmental",
      keyFeatures: [
        "Geodesic domes",
        "Climate control",
        "Atmospheric systems",
        "Environmental technology",
      ],
      promptEnhancement:
        "with the environmental innovation of Cornwall's Eden Project, featuring massive geodesic structures, advanced climate control systems, atmospheric processing technology, and sustainable environmental management",
    },
  ],
  temporal_archive: [
    {
      id: "svalbard-seed-vault",
      name: "Svalbard Global Seed Vault",
      location: "Svalbard, Norway",
      description:
        "Underground preservation facility designed for long-term storage",
      architecturalStyle: "Preservation Architecture",
      keyFeatures: [
        "Underground chambers",
        "Climate control",
        "Long-term storage",
        "Preservation technology",
      ],
      promptEnhancement:
        "inspired by the Svalbard Seed Vault's preservation architecture, featuring underground storage chambers, advanced climate control, quantum storage systems, and technology designed for eternal preservation",
    },
  ],
  symbiotic_habitat: [
    {
      id: "bosco-verticale",
      name: "Bosco Verticale",
      location: "Milan, Italy",
      description:
        "Vertical forest towers with integrated living ecosystems",
      architecturalStyle: "Living Architecture",
      keyFeatures: [
        "Vertical gardens",
        "Living ecosystems",
        "Bio-integration",
        "Sustainable design",
      ],
      promptEnhancement:
        "with the living architecture of Milan's Bosco Verticale, featuring vertical forest integration, symbiotic ecosystems, bio-responsive materials, and spaces where nature and architecture coexist harmoniously",
    },
  ],
};

const ChurchTransformation = () => {
  const { toast } = useToast();

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    selectedTransformation: null,
    selectedLocation: null,
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
    // Social Media Sharing
    showShareModal: false,
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
        showMaskPreview: false, // Reset mask preview when changing image
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
    // Détection du mode développement
    const isDevelopment =
      process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // Vérification coupon obligatoire (sauf en mode développement)
    if (!isDevelopment && !state.couponValidation?.valid) {
      toast({
        title: "🎫 Coupon requis",
        description:
          "Vous devez avoir un coupon valide pour générer des transformations.",
        variant: "error",
      });
      return;
    }

    // Vérification générations restantes (sauf en mode développement)
    if (
      !isDevelopment &&
      state.activeCoupon &&
      state.activeCoupon.generationsRemaining <= 0
    ) {
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
        "MANDATORY: 140 happy diverse people actively using the space (sitting, working, socializing). Include appropriate furniture. Space must look lived-in with people as the focal point.";
      const fullPrompt = mandatoryPeopleRequirement + " " + state.customPrompt;

      const response = await fetch("/api/inpaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          baseImage: state.selectedInpaintImage.path,
          maskImage: state.selectedInpaintImage.maskPath,
          prompt: fullPrompt,
          method: state.hdPainterMethod,
          resolution: state.selectedInpaintImage.resolution,
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

      setState((prev) => ({
        ...prev,
        generatedImage: data.imageUrl,
        generationTime,
        cost: data.metadata?.cost ?? 0.04, // Coût Stability AI
        isGenerating: false,
      }));

      // Décrémentation du coupon après succès (sauf en mode développement)
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
      const value = event.target.value;
      // Limiter à 1800 caractères
      if (value.length <= 1800) {
        setState((prev) => ({ ...prev, customPrompt: value }));
      }
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
      };

      // Base prompt with mandatory requirements
      let prompt = `
  Transform this church into ${transformationNames[transformationType] || "a transformed space"} that blends modern functionality with historical architecture.
  
  ARCHITECTURE: Preserve stone arches, vaulted ceilings, stained glass, and Gothic proportions while integrating modern elements.
  
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
          "Shape-shifting multipurpose spaces, community memory walls with interactive historical displays, empathy-enhancing communication pods, and social harmony algorithms that optimize group interactions.",
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
          "Time-locked preservation chambers, quantum memory storage crystals, historical consciousness recording systems, and eternal knowledge preservation pods that transcend temporal limitations.",
        symbiotic_habitat:
          "Human-nature consciousness merger zones, bio-architectural growth systems, interspecies communication networks, and evolutionary acceleration chambers where beings and environment co-evolve harmoniously.",
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
        selectedLocation: null, // Reset location when changing transformation
        generatedImage: null,
        generationTime: null,
        cost: null,
        customPrompt: enhancedPrompt,
      }));
    },
    []
  );

  const handleLocationSelect = useCallback(
    (location: FamousLocation) => {
      if (!state.selectedTransformation) return;

      // Generate enhanced prompt with location inspiration
      const baseImageName =
        selectedBaseImageRef.current.path.split("/").pop() ||
        "Saint-Gildas-Auray-768x576.webp";

      let enhancedPrompt = generateEnhancedPrompt(
        state.selectedTransformation.id,
        state.selectedTransformation.prompt,
        baseImageName
      );

      // Add location-specific enhancement to the prompt
      enhancedPrompt += `\n\nINSPIRATION: ${location.promptEnhancement}`;

      setState((prev) => ({
        ...prev,
        selectedLocation: location,
        customPrompt: enhancedPrompt,
      }));

      toast({
        title: "🌟 Inspiration ajoutée",
        description: `${location.name} (${location.location}) intégré au prompt`,
        variant: "default",
      });
    },
    [state.selectedTransformation, toast, generateEnhancedPrompt]
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
  }, [state.selectedTransformation, toast, generateEnhancedPrompt]);

  const handleForceNewGenerationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({
        ...prev,
        forceNewGeneration: event.target.checked,
      }));
    },
    []
  );

  // Social Media Sharing handlers
  const handleOpenShareModal = useCallback(() => {
    setState((prev) => ({ ...prev, showShareModal: true }));
  }, []);

  const handleCloseShareModal = useCallback(() => {
    setState((prev) => ({ ...prev, showShareModal: false }));
  }, []);

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
                  state.selectedInpaintImage === image
                    ? "border-blue-500 shadow-lg scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleInpaintImageSelect(index)}
              >
                <div className="aspect-square">
                  <img
                    src={
                      state.showMaskPreview && state.selectedInpaintImage === image
                        ? image.maskPath
                        : image.path
                    }
                    alt={state.showMaskPreview && state.selectedInpaintImage === image
                      ? `Masque de ${image.name}`
                      : image.name
                    }
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
                {state.selectedInpaintImage === image && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
                {state.showMaskPreview && state.selectedInpaintImage === image && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs bg-orange-500 text-white">
                      Masque
                    </Badge>
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
                variant={state.showMaskPreview ? "default" : "outline"}
                size="sm"
                onClick={handleToggleMaskPreview}
                className="flex items-center gap-2"
                disabled={!state.selectedInpaintImage}
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

      {/* Famous Location Selection */}
      {state.selectedTransformation && FAMOUS_LOCATIONS[state.selectedTransformation.id] && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🌟</span>
              Inspiration architecturale
            </CardTitle>
            <CardDescription>
              Choisissez un lieu célèbre pour inspirer votre transformation de {state.selectedTransformation.name.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FAMOUS_LOCATIONS[state.selectedTransformation.id].map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    state.selectedLocation?.id === location.id
                      ? "ring-2 ring-amber-500 bg-amber-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleLocationSelect(location)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{location.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{location.location}</p>
                        <p className="text-sm text-gray-700 mb-3">{location.description}</p>
                      </div>
                      {state.selectedLocation?.id === location.id && (
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center ml-2">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {location.architecturalStyle}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {location.keyFeatures.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {state.selectedLocation && (
              <div className="mt-4 p-4 bg-amber-100 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <span>✨</span>
                  Inspiration sélectionnée: {state.selectedLocation.name}
                </h4>
                <p className="text-sm text-amber-800">
                  Cette inspiration sera intégrée dans votre prompt pour créer une transformation unique inspirée de ce lieu emblématique.
                </p>
              </div>
            )}
            
            {!state.selectedLocation && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  💡 Sélectionnez une inspiration architecturale pour enrichir votre transformation, ou continuez sans inspiration spécifique.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
                    href="https://www.buymeacoffee.com/huaoe"
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
              <Button
                onClick={handleOpenShareModal}
                variant="outline"
                size="sm"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager sur les réseaux
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

      {/* Social Media Share Modal */}
      {state.showShareModal &&
        state.generatedImage &&
        state.selectedTransformation && (
          <SharePostModal
            isOpen={state.showShareModal}
            onClose={handleCloseShareModal}
            imageUrl={state.generatedImage}
            imageDescription={`Découvrez cette transformation révolutionnaire de l'église Saint-Gildas d'Auray en ${state.selectedTransformation.name} ! ${state.selectedTransformation.description}`}
          />
        )}
    </div>
  );
};

export default ChurchTransformation;
