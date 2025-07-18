// Configuration HD-Painter Inpainting System
// Basé sur la recherche HD-Painter (ICLR 2025)
// https://github.com/Picsart-AI-Research/HD-Painter

import crypto from 'crypto';

export interface InpaintImage {
  path: string;
  name: string;
  description: string;
  maskPath: string;
  type: 'exterior' | 'interior' | 'detail' | 'alternative' | 'facade' | 'interior-partial';
  hdPainterMethod: 'baseline' | 'painta' | 'rasg' | 'painta+rasg';
  resolution: 'standard' | 'hd' | 'ultra';
}

// Configuration des images disponibles avec leurs masques d'inpainting
export const INPAINT_IMAGES: InpaintImage[] = [
  // {
  //   path: "/images/46075-this-building-is-classe-au-titre-des-monuments-historiques-de-la-france-it-is-indexed-in-the-base-merimee-a-database-of-architectural-heritage-maintained-by-the-french.jpg",
  //   name: "Saint-Gildas Extérieur",
  //   description: "Vue extérieure de l'église Saint-Gildas - Façade principale",
  //   maskPath: "/images/inpaint/total/inpaint1.jpg",
  //   type: "exterior",
  //   hdPainterMethod: "painta+rasg", // Meilleure qualité
  //   resolution: "hd",
  // },
  // {
  //   path: "/images/184232-english-inside-church-saint-gildas-in-auray-france.jpg",
  //   name: "Saint-Gildas Intérieur",
  //   description: "Vue intérieure de l'église Saint-Gildas - Nef principale",
  //   maskPath: "/images/inpaint/total/184232-english-inside-church-saint-gildas-in-auray-franceINPAINT.jpg",
  //   type: "interior",
  //   hdPainterMethod: "painta+rasg",
  //   resolution: "hd",
  // },
  // {
  //   path: "/images/20220922_143843.jpg",
  //   name: "Vue Détaillée Architecture",
  //   description: "Vue détaillée de l'architecture - Éléments décoratifs",
  //   maskPath: "/images/inpaint/total/inpaint2.jpg",
  //   type: "detail",
  //   hdPainterMethod: "rasg", // Pour préserver les détails
  //   resolution: "ultra",
  // },
  //mask is to high
  // {
  //   path: "/images/fra-auray-4-1882354559.jpg",
  //   name: "Vue Alternative",
  //   description: "Perspective alternative de l'église - Angle latéral",
  //   maskPath: "/images/inpaint/total/inpaint3.jpg",
  //   type: "alternative",
  //   hdPainterMethod: "painta+rasg",
  //   resolution: "hd",
  // },
  {
    path: "/images/184232-english-inside-church-saint-gildas-in-auray-france.jpg",
    name: "Intérieur Style Anglais",
    description: "Vue intérieure style anglais - Atmosphère gothique",
    maskPath: "/images/inpaint/total/184232-english-inside-church-saint-gildas-in-auray-franceINPAINT.jpg",
    type: "interior",
    hdPainterMethod: "painta", // Style artistique
    resolution: "hd",
  },
  {
    path: "/images/Saint-Gildas-Auray-768x576.jpg",
    name: "Façade Complète",
    description: "Transformation complète de la façade - Vision futuriste",
    maskPath: "/images/inpaint/total/inpaint10.jpg",
    type: "facade",
    hdPainterMethod: "painta+rasg",
    resolution: "ultra",
  },
  {
    path: "/images/Saint-Gildas-Auray-interieur-3992021581.jpg",
    name: "Intérieur Partiel",
    description: "Transformation partielle de l'intérieur - Zone spécifique",
    maskPath: "/images/inpaint/total/inpaint8.jpg",
    type: "interior-partial",
    hdPainterMethod: "baseline", // Transformation subtile
    resolution: "standard",
  },
  {
    path: "/images/Saint-Gildas-Auray-768x576.jpg",
    name: "Entrée Principale",
    description: "Focus sur l'entrée principale - Portail d'accueil",
    maskPath: "/images/inpaint/total/inpaint10.jpg",
    type: "exterior",
    hdPainterMethod: "painta",
    resolution: "hd",
  },
  {
    path: "/images/Saint-Gildas-Auray-interieur-3992021581.jpg",
    name: "Autel et Chœur",
    description: "Transformation de l'autel et du chœur - Zone sacrée",
    maskPath: "/images/inpaint/total/inpaint8.jpg",
    type: "interior",
    hdPainterMethod: "rasg", // Préservation respectueuse
    resolution: "ultra",
  },
  // {
  //   path: "/images/20220922_143843.jpg",
  //   name: "Architecture Complète",
  //   description: "Vue d'ensemble architecturale - Transformation globale",
  //   maskPath: "/images/inpaint/total/inpaint2.jpg",
  //   type: "detail",
  //   hdPainterMethod: "painta+rasg",
  //   resolution: "ultra",
  // },
  // il faut metre le mask jusqu'en bas
  // {
  //   path: "/images/fra-auray-4-1882354559.jpg",
  //   name: "Perspective Latérale",
  //   description: "Vue latérale avec jardin - Intégration paysagère",
  //   maskPath: "/images/inpaint/total/inpaint3.jpg",
  //   type: "alternative",
  //   hdPainterMethod: "painta",
  //   resolution: "hd",
  // },
];

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
  },
} as const;

// Utilitaires
export function getInpaintImageByPath(imagePath: string, maskPath?: string): InpaintImage | undefined {
  return INPAINT_IMAGES.find(img => 
    img.path === imagePath && (maskPath ? img.maskPath === maskPath : true)
  );
}

export function getInpaintImagesByType(type: InpaintImage['type']): InpaintImage[] {
  return INPAINT_IMAGES.filter(img => img.type === type);
}

export function generateInpaintCacheKey(
  imagePath: string, 
  maskPath: string, 
  prompt: string, 
  method: string = HD_PAINTER_CONFIG.defaults.method
): string {
  const content = `${imagePath}|${maskPath}|${prompt}|${method}`;
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 12);
}

// Types pour TypeScript
export type HDPainterMethod = keyof typeof HD_PAINTER_CONFIG.methods;
export type HDPainterModel = keyof typeof HD_PAINTER_CONFIG.models;
export type HDPainterResolution = keyof typeof HD_PAINTER_CONFIG.resolutions;

export interface InpaintRequest {
  imagePath: string;
  maskPath: string;
  prompt: string;
  method?: HDPainterMethod;
  model?: HDPainterModel;
  resolution?: HDPainterResolution;
  strength?: number;
  guidance?: number;
  steps?: number;
  noCache?: boolean;
  isDevelopment?: boolean;
}
