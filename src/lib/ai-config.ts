// Configuration IA pour les transformations d'images de l'église
// Utilise Stability AI pour les transformations img2img

// Configuration Stability AI - Ultra v2beta
export const STABILITY_CONFIG = {
  API_URL: "https://api.stability.ai/v2beta/stable-image/generate/ultra",
  INPAINT_API_URL: "https://api.stability.ai/v2beta/stable-image/edit/inpaint",
  MODEL: "sd3-large-turbo",
  ASPECT_RATIO: "1:1",
  OUTPUT_FORMAT: "png",
  STYLE_PRESET: "photographic",
  STEPS: 50,
  CFG_SCALE: 7.5,
  SEED: 0,
  SAMPLES: 1,
  SAFETY_TOLERANCE: 2,
  PROMPT_STRENGTH: 0.8,
  // Inpainting specific parameters
  INPAINT_OUTPUT_FORMAT: "png",
  INPAINT_STEPS: 50,
  INPAINT_CFG_SCALE: 7.5,
  
  // Coûts (en USD)
  PRICING: {
    per_generation: 0.04,  // $0.04 par génération
    currency: 'USD'
  }
} as const;

// Prompts optimisés pour Stable Diffusion img2img
export const getTransformationPrompt = (type: string, customPrompt?: string): string => {
  const basePrompts = {
    library: "Transform this church interior into a modern public library, with wooden bookshelves along the walls, reading tables in the nave, comfortable seating areas, warm lighting, keeping the original architectural elements like columns and arches, photorealistic, professional photography",
    
    restaurant: "Transform this church interior into an elegant restaurant, with dining tables in the nave area, atmospheric lighting, keeping the stone columns and gothic arches, modern kitchen equipment discretely integrated, fine dining atmosphere, photorealistic, architectural photography",
    
    coworking: "Transform this church interior into a modern coworking space, with desk areas in the nave, meeting rooms in side chapels, keeping the original stone architecture and columns, modern furniture and technology, natural lighting, photorealistic, professional photography",
    
    museum: "Transform this church interior into a history museum, with display cases along the walls, exhibition panels, spotlighting on artifacts, keeping all original architectural features, museum-quality lighting, photorealistic, professional museum photography",
    
    concert: "Transform this church interior into a concert hall, with stage area in the chancel, audience seating in the nave, professional stage lighting, acoustic panels discretely integrated, keeping all original architecture, concert photography, dramatic lighting",
    
    market: "Transform this church interior into a covered market hall, with vendor stalls along the nave, fresh produce displays, market umbrellas, keeping the stone columns and arches, bustling atmosphere, photorealistic, market photography",
    
    gym: "Transform this church interior into a modern fitness center, with exercise equipment in the nave area, yoga mats, keeping the original stone architecture, modern lighting, clean and minimal design, fitness photography, professional gym atmosphere",
    
    cafe: "Transform this church interior into a cozy café, with comfortable seating areas, coffee bar, warm atmospheric lighting, keeping all original architectural elements, bohemian café atmosphere, photorealistic, lifestyle photography",
    
    art_gallery: "Transform this church interior into a contemporary art gallery, with artwork displayed on walls and in the nave, gallery lighting, keeping the original stone columns and architecture, white gallery walls, photorealistic, gallery photography",
    
    innovation_lab: "Transform this church interior into a high-tech innovation laboratory, with modern workstations, technological equipment, LED lighting, keeping the original gothic architecture as contrast, futuristic atmosphere, photorealistic, tech photography"
  };

  const prompt = customPrompt || basePrompts[type as keyof typeof basePrompts] || basePrompts.library;
  
  // Suffixe pour améliorer la qualité Stable Diffusion
  const qualityEnhancer = ", high quality, detailed, professional photography, 8k resolution, sharp focus, perfect lighting";
  
  return prompt + qualityEnhancer;
};

// Headers HTTP pour Stability AI
export const getStabilityHeaders = () => {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    throw new Error('STABILITY_API_KEY is not defined');
  }
  
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data',
  };
};

// Validation des variables d'environnement
export const validateAIConfig = () => {
  if (!process.env.STABILITY_API_KEY) {
    throw new Error('STABILITY_API_KEY is required for AI transformations');
  }
};
