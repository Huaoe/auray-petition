// Configuration HD-Painter Inpainting System
// Basé sur la recherche HD-Painter (ICLR 2025)
// https://github.com/Picsart-AI-Research/HD-Painter

import crypto from "crypto";

export interface InpaintImage {
  id: string; // Ajouter l'ID unique
  path: string;
  name: string;
  description: string;
  maskPath: string;
  type:
    | "exterior"
    | "interior"
    | "detail"
    | "alternative"
    | "facade"
    | "interior-partial";
  hdPainterMethod: "baseline" | "painta" | "rasg" | "painta+rasg";
  resolution: "standard" | "hd" | "ultra";
}

export const INPAINT_IMAGES: InpaintImage[] = [
  {
    id: "interior-english-style",
    path: "/images/184232-english-inside-church-saint-gildas-in-auray-france.jpg",
    name: "Intérieur Style Anglais",
    description: "Vue intérieure style anglais - Atmosphère gothique",
    maskPath: "/images/inpaint/total/184232-english-inside-church-saint-gildas-in-auray-franceINPAINT.jpg",
    type: "interior",
    hdPainterMethod: "painta",
    resolution: "hd",
  },
  {
    id: "facade-complete",
    path: "/images/Saint-Gildas-Auray-768x576.jpg",
    name: "Façade Complète",
    description: "Transformation complète de la façade - Vision futuriste",
    maskPath: "/images/inpaint/total/inpaint10g.jpg",
    type: "facade",
    hdPainterMethod: "painta+rasg",
    resolution: "ultra",
  },
  {
    id: "interior-partial",
    path: "/images/Saint-Gildas-Auray-interieur-3992021581.jpg",
    name: "Intérieur Partiel",
    description: "Transformation partielle de l'intérieur - Zone spécifique",
    maskPath: "/images/inpaint/total/inpaint8.jpg",
    type: "interior-partial",
    hdPainterMethod: "baseline",
    resolution: "standard",
  },
  
];

// Configuration des prompts négatifs
export const NEGATIVE_PROMPT_CONFIG = {
  // Prompt négatif par défaut recommandé
  usual:
    "oversaturated, low contrast, underexposed, overexposed, lowres, low quality, solid background, plain background, asymmetrical buildings, jpeg artifacts, close-up, macro, surreal, multiple views, multiple angles, creepy, scary, blurry, grainy, unreal sky, weird colors, deformed structures",

  // MANDATORY BASE PROMPT - Always applied, never visible to user
  mandatoryBase:
    "church, cathedral, chapel, basilica, monastery, abbey, temple, shrine, sanctuary, altar, pulpit, pews, nave, transept, apse, bell tower, steeple, spire, gothic architecture, romanesque, flying buttresses, rose window, stained glass windows, church bells, organ pipes, confessional, baptismal font, cross, crucifix, religious symbols, christian symbols, holy water, candles, religious statues, saints, madonna, jesus, christ, religious paintings, religious art, biblical scenes, religious iconography, religious texts, bible, prayer books, religious banners, religious vestments, priest robes, religious ceremonies, altar table, religious altar, church furniture, religious decorations, religious ornaments, holy relics, religious artifacts, church interior, religious interior design, ecclesiastical furniture, church pews, kneelers, religious tapestries, religious murals, religious atmosphere, sacred space, holy place, place of worship, religious gathering, religious service, mass, prayer, religious ritual, religious community, congregation, ecclesiastical, holy, sacred, biblical, christian, catholic",

  // Toggleable presets that users can control
  toggleablePresets: {
    quality: {
      name: "Quality Issues",
      prompt:
        "lowres, low quality, jpeg artifacts, blurry, grainy, pixelated, compressed",
      description: "Avoid low quality and compression artifacts",
      tooltip:
        "Eliminates visual noise and compression artifacts for a cleaner, more professional result",
    },
    exposure: {
      name: "Exposure Problems",
      prompt:
        "oversaturated, low contrast, underexposed, overexposed, washed out, too dark, too bright",
      description: "Prevent exposure and lighting issues",
      tooltip:
        "Improves balanced lighting and prevents harsh shadows or blown-out highlights",
    },
    composition: {
      name: "Composition Issues",
      prompt:
        "solid background, plain background, asymmetrical buildings, multiple views, multiple angles, cropped, cut off",
      description: "Avoid composition and framing problems",
      tooltip:
        "Creates better framing and prevents awkward cropping or unbalanced compositions",
    },
    style: {
      name: "Style Problems",
      prompt:
        "surreal, creepy, scary, weird colors, unreal sky, deformed structures, distorted, unrealistic",
      description: "Prevent surreal and unrealistic elements",
      tooltip:
        "Maintains realistic aesthetics and prevents AI-generated surreal or unsettling elements",
    },
    technical: {
      name: "Technical Artifacts",
      prompt:
        "noise, artifacts, compression, watermark, text, logo, signature, frame, border",
      description: "Remove technical artifacts and watermarks",
      tooltip:
        "Eliminates distracting elements like watermarks, text, or digital artifacts",
    },
    architectural: {
      name: "Architectural Issues",
      prompt:
        "asymmetrical buildings, deformed structures, impossible architecture, floating elements, broken perspective",
      description: "Avoid architectural inconsistencies",
      tooltip:
        "Ensures architectural integrity with proper perspective and structural coherence",
    },
    people: {
      name: "People Problems",
      prompt:
        "deformed faces, missing limbs, extra fingers, distorted bodies, unnatural poses, uncanny valley, creepy expressions",
      description: "Prevent issues with human figures",
      tooltip:
        "Creates more natural-looking people without anatomical errors or uncanny expressions",
    },
    lighting: {
      name: "Lighting Artifacts",
      prompt:
        "harsh shadows, inconsistent lighting, unnatural reflections, lens flare, glare, blown highlights",
      description: "Avoid lighting inconsistencies",
      tooltip:
        "Produces more natural lighting with consistent light sources and realistic shadows",
    },
    details: {
      name: "Detail Issues",
      prompt:
        "missing details, lack of texture, flat surfaces, overly smooth, lack of depth, simplified features",
      description: "Prevent loss of important details",
      tooltip:
        "Preserves fine details and textures for more realistic and rich visuals",
    },
    perspective: {
      name: "Perspective Problems",
      prompt:
        "warped perspective, fisheye effect, distorted proportions, inconsistent scale, multiple vanishing points",
      description: "Avoid perspective distortions",
      tooltip:
        "Maintains proper spatial relationships and prevents warped or unrealistic perspectives",
    },
    materials: {
      name: "Material Rendering Issues",
      prompt:
        "unrealistic materials, plastic-looking surfaces, incorrect reflections, unnatural textures, inconsistent material properties",
      description: "Improve material realism",
      tooltip:
        "Creates more convincing materials with appropriate textures, reflections and properties",
    },
    atmosphere: {
      name: "Atmospheric Problems",
      prompt:
        "flat lighting, lack of atmosphere, missing ambient occlusion, no depth, artificial environment",
      description: "Enhance atmospheric depth",
      tooltip:
        "Adds depth through proper atmospheric effects, creating more immersive and realistic scenes",
    },
  },

  // Legacy presets for backward compatibility
  presets: {
    quality:
      "lowres, low quality, jpeg artifacts, blurry, grainy, pixelated, compressed",
    exposure:
      "oversaturated, low contrast, underexposed, overexposed, washed out, too dark, too bright",
    composition:
      "solid background, plain background, asymmetrical buildings, multiple views, multiple angles, cropped, cut off",
    style:
      "surreal, creepy, scary, weird colors, unreal sky, deformed structures, distorted, unrealistic",
    technical:
      "noise, artifacts, compression, watermark, text, logo, signature, frame, border",
    architectural:
      "asymmetrical buildings, deformed structures, impossible architecture, floating elements, broken perspective",
    people:
      "deformed faces, missing limbs, extra fingers, distorted bodies, unnatural poses, uncanny valley, creepy expressions",
    lighting:
      "harsh shadows, inconsistent lighting, unnatural reflections, lens flare, glare, blown highlights",
    details:
      "missing details, lack of texture, flat surfaces, overly smooth, lack of depth, simplified features",
    perspective:
      "warped perspective, fisheye effect, distorted proportions, inconsistent scale, multiple vanishing points",
    materials:
      "unrealistic materials, plastic-looking surfaces, incorrect reflections, unnatural textures, inconsistent material properties",
    atmosphere:
      "flat lighting, lack of atmosphere, missing ambient occlusion, no depth, artificial environment",
  },

  // Legacy default for backward compatibility
  default:
    "church, cathedral, chapel, basilica, monastery, abbey, temple, shrine, sanctuary, altar, pulpit, pews, nave, transept, apse, bell tower, steeple, spire, gothic architecture, romanesque, flying buttresses, rose window, stained glass windows, church bells, organ pipes, confessional, baptismal font, cross, crucifix, religious symbols, christian symbols, holy water, candles, religious statues, saints, madonna, jesus, christ, religious paintings, religious art, biblical scenes, religious iconography, religious texts, bible, prayer books, religious banners, religious vestments, priest robes, religious ceremonies, altar table, religious altar, church furniture, religious decorations, religious ornaments, holy relics, religious artifacts, church interior, religious interior design, ecclesiastical furniture, church pews, kneelers, religious tapestries, religious murals, religious atmosphere, sacred space, holy place, place of worship, religious gathering, religious service, mass, prayer, religious ritual, religious community, congregation, ecclesiastical, holy, sacred, biblical, christian, catholic",

  // Limite de caractères pour les prompts négatifs (conservative estimate)
  maxLength: 2000,
} as const;

// Configuration HD-Painter
export const HD_PAINTER_CONFIG = {
  // Méthodes disponibles
  methods: {
    baseline: "Modèle de base sans amélioration",
    painta: "PAIntA block pour cohérence créative",
    rasg: "RASG guidance pour préservation détails",
    "painta+rasg": "Combinaison optimale (recommandé)",
  },

  // Modèles supportés
  models: {
    ds8_inp: "DreamShaper 8 Inpainting",
    sd2_inp: "Stable Diffusion 2.0 Inpainting",
    sd15_inp: "Stable Diffusion 1.5 Inpainting",
  },

  // Résolutions supportées
  resolutions: {
    standard: { maxSize: 1024, description: "Qualité standard" },
    hd: { maxSize: 1536, description: "Haute définition" },
    ultra: { maxSize: 2048, description: "Ultra haute définition" },
  },

  // Paramètres par défaut
  defaults: {
    method: "painta+rasg" as const,
    model: "ds8_inp" as const,
    resolution: "hd" as const,
    strength: 0.8, // Force de transformation
    guidance: 7.5, // Guidance scale
    steps: 50, // Nombre d'étapes
    negativePrompt: NEGATIVE_PROMPT_CONFIG.default, // Prompt négatif par défaut
  },
} as const;

// Utilitaires
export function getInpaintImageByPath(
  imagePath: string,
  maskPath?: string
): InpaintImage | undefined {
  return INPAINT_IMAGES.find(
    (img) =>
      img.path === imagePath && (maskPath ? img.maskPath === maskPath : true)
  );
}

export function getInpaintImagesByType(
  type: InpaintImage["type"]
): InpaintImage[] {
  return INPAINT_IMAGES.filter((img) => img.type === type);
}

// Utilitaires pour les prompts négatifs
export const combineNegativePrompts = (
  ...prompts: (string | undefined)[]
): string => {
  return prompts
    .filter(Boolean)
    .join(", ")
    .substring(0, NEGATIVE_PROMPT_CONFIG.maxLength);
};

export const getNegativePromptPreset = (
  presetName: keyof typeof NEGATIVE_PROMPT_CONFIG.presets
): string => {
  return NEGATIVE_PROMPT_CONFIG.presets[presetName];
};

export const getDefaultNegativePrompt = (): string => {
  return NEGATIVE_PROMPT_CONFIG.default;
};

export const getMandatoryBaseNegativePrompt = (): string => {
  return NEGATIVE_PROMPT_CONFIG.mandatoryBase;
};

export const getToggleablePreset = (
  presetKey: keyof typeof NEGATIVE_PROMPT_CONFIG.toggleablePresets
): string => {
  return NEGATIVE_PROMPT_CONFIG.toggleablePresets[presetKey].prompt;
};

export const combineWithMandatoryBase = (activePresets: string[]): string => {
  return combineNegativePrompts(
    NEGATIVE_PROMPT_CONFIG.mandatoryBase,
    ...activePresets
  );
};

export const getChurchSpecificNegativePrompt = (): string => {
  return NEGATIVE_PROMPT_CONFIG.mandatoryBase;
};

export const getAntiReligiousNegativePrompt = (): string => {
  return NEGATIVE_PROMPT_CONFIG.mandatoryBase;
};

export const getFullAntiReligiousPrompt = (): string => {
  return combineNegativePrompts(
    NEGATIVE_PROMPT_CONFIG.mandatoryBase,
    NEGATIVE_PROMPT_CONFIG.presets.quality,
    NEGATIVE_PROMPT_CONFIG.presets.style
  );
};

export function generateInpaintCacheKey(
  imagePath: string,
  maskPath: string,
  prompt: string,
  method: string = HD_PAINTER_CONFIG.defaults.method,
  negativePrompt?: string
): string {
  const content = `${imagePath}|${maskPath}|${prompt}|${negativePrompt || ""}|${method}`;
  return crypto
    .createHash("sha256")
    .update(content)
    .digest("hex")
    .substring(0, 12);
}

// Types pour TypeScript
export type HDPainterMethod = keyof typeof HD_PAINTER_CONFIG.methods;
export type HDPainterModel = keyof typeof HD_PAINTER_CONFIG.models;
export type HDPainterResolution = keyof typeof HD_PAINTER_CONFIG.resolutions;

export interface InpaintRequest {
  imagePath: string;
  maskPath: string;
  prompt: string;
  negativePrompt?: string;
  method?: HDPainterMethod;
  model?: HDPainterModel;
  resolution?: HDPainterResolution;
  strength?: number;
  guidance?: number;
  steps?: number;
  noCache?: boolean;
  isDevelopment?: boolean;
}
