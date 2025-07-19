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
  STEPS: 60,
  CFG_SCALE: 8.5,
  SEED: 0,
  SAMPLES: 1,
  SAFETY_TOLERANCE: 2,
  PROMPT_STRENGTH: 0.9,
  // Inpainting specific parameters
  INPAINT_OUTPUT_FORMAT: "png",
  INPAINT_STEPS: 60,
  INPAINT_CFG_SCALE: 8.5,
  
  // Coûts (en USD)
  PRICING: {
    per_generation: 0.04,  // $0.04 par génération
    currency: 'USD'
  }
} as const;

// Prompts optimisés pour Stable Diffusion img2img
export const getTransformationPrompt = (type: string, customPrompt?: string): string => {
  const basePrompts = {
    library: "Transform this interior into a modern public library, with wooden bookshelves along the walls, reading tables in the nave, comfortable seating areas, warm lighting, keeping the original architectural elements like columns and arches, photorealistic, professional photography",
    
    restaurant: "Transform this interior into an elegant restaurant, with dining tables in the nave area, atmospheric lighting, keeping the stone columns and gothic arches, modern kitchen equipment discretely integrated, fine dining atmosphere, photorealistic, architectural photography",
    
    coworking: "Transform this interior into a modern coworking space, with desk areas in the nave, meeting rooms in side chapels, keeping the original stone architecture and columns, modern furniture and technology, natural lighting, photorealistic, professional photography",
    
    museum: "Transform this interior into a history museum, with display cases along the walls, exhibition panels, spotlighting on artifacts, keeping all original architectural features, museum-quality lighting, photorealistic, professional museum photography",
    
    concert: "Transform this interior into a concert hall, with stage area in the chancel, audience seating in the nave, professional stage lighting, acoustic panels discretely integrated, keeping all original architecture, concert photography, dramatic lighting",
    
    market: "Transform this interior into a covered market hall, with vendor stalls along the nave, fresh produce displays, market umbrellas, keeping the stone columns and arches, bustling atmosphere, photorealistic, market photography",
    
    gym: "Transform this interior into a modern fitness center, with exercise equipment in the nave area, yoga mats, keeping the original stone architecture, modern lighting, clean and minimal design, fitness photography, professional gym atmosphere",
    
    cafe: "Transform this interior into a cozy café, with comfortable seating areas, coffee bar, warm atmospheric lighting, keeping all original architectural elements, bohemian café atmosphere, photorealistic, lifestyle photography",
    
    art_gallery: "Transform this interior into a contemporary art gallery, with artwork displayed on walls and in the nave, gallery lighting, keeping the original stone columns and architecture, white gallery walls, photorealistic, gallery photography",
    
    innovation_lab: "Transform this interior into a high-tech innovation laboratory, with modern workstations, technological equipment, LED lighting, keeping the original gothic architecture as contrast, futuristic atmosphere, photorealistic, tech photography",
    
    // Additional transformation types from ChurchTransformation.tsx
    climbing: "Transform this interior into an indoor climbing center, with climbing walls utilizing the height, bouldering areas, safety equipment, keeping the original stone architecture, adventure sports atmosphere, photorealistic, sports photography",
    
    swimming_pool: "Transform this interior into an aquatic center, with swimming pools in the nave area, water features, spa facilities, keeping the original columns and arches, serene aquatic atmosphere, photorealistic, architectural photography",
    
    sauna_hammam: "Transform this interior into a thermal spa, with saunas and hammams in side areas, steam rooms, relaxation spaces, keeping the original stone architecture, wellness atmosphere, photorealistic, spa photography",
    
    indoor_skydiving: "Transform this interior into an indoor skydiving facility, with vertical wind tunnels utilizing the height, flight chambers, safety equipment, keeping the original architecture, extreme sports atmosphere, photorealistic, action photography",
    
    trampoline_park: "Transform this interior into a trampoline park, with bouncing areas in the nave, foam pits, aerial activities, keeping the original columns and height, recreational atmosphere, photorealistic, sports photography",
    
    laser_game: "Transform this interior into a laser tag arena, with tactical environments, interactive obstacles, gaming technology, keeping the original architecture for atmosphere, competitive gaming environment, photorealistic, gaming photography",
    
    playground: "Transform this interior into an innovative playground, with creative play structures, educational activities, family spaces, keeping the original architecture safe and accessible, child-friendly atmosphere, photorealistic, family photography",
    
    third_place: "Transform this interior into a community third place, with flexible social spaces, gathering areas, cultural activities, keeping the original architecture welcoming, inclusive community atmosphere, photorealistic, lifestyle photography",
    
    fablab: "Transform this interior into a fabrication laboratory, with maker spaces, digital manufacturing tools, creative workshops, keeping the original architecture inspiring, innovation atmosphere, photorealistic, tech photography",
    
    ice_rink: "Transform this interior into an ice rink, with skating surfaces in the nave area, spectator seating, winter sports facilities, keeping the original architecture, recreational ice sports atmosphere, photorealistic, sports photography",
    
    cat_cuddling: "Transform this interior into a cat sanctuary and cuddling café, with comfortable seating, cat play areas, adoption facilities, keeping the original architecture peaceful, nurturing feline atmosphere, photorealistic, lifestyle photography",
    
    // Advanced/futuristic transformation types
    biophilic_sanctuary: "Transform this interior into a biophilic sanctuary, with living walls, natural ecosystems, organic architecture integration, keeping the original stone structure, human-nature harmony atmosphere, photorealistic, environmental photography",
    
    holographic_museum: "Transform this interior into a holographic museum, with immersive digital displays, interactive projections, virtual reality experiences, keeping the original architecture as framework, cutting-edge technology atmosphere, photorealistic, tech photography",
    
    vertical_farm: "Transform this interior into a vertical farm, with multi-level growing systems, hydroponic towers, automated cultivation, keeping the original height and structure, sustainable agriculture atmosphere, photorealistic, agricultural photography",
    
    quantum_research: "Transform this interior into a quantum research facility, with advanced laboratories, precision equipment, clean room environments, keeping the original architecture contemplative, scientific research atmosphere, photorealistic, laboratory photography",
    
    metamorphic_theater: "Transform this interior into a metamorphic theater, with transformable stages, adaptive seating, dynamic performance spaces, keeping the original architecture dramatic, flexible theatrical atmosphere, photorealistic, theater photography",
    
    neural_interface_lab: "Transform this interior into a neural interface laboratory, with brain-computer research stations, meditation chambers, consciousness exploration areas, keeping the original architecture transcendent, advanced neurotechnology atmosphere, photorealistic, scientific photography",
    
    crystalline_conservatory: "Transform this interior into a crystalline conservatory, with crystal formations, mineral displays, geological exhibits, keeping the original architecture luminous, harmonic resonance atmosphere, photorealistic, geological photography",
    
    atmospheric_processor: "Transform this interior into an atmospheric processor, with climate control systems, air purification technology, environmental monitoring, keeping the original architecture expansive, environmental technology atmosphere, photorealistic, industrial photography",
    
    temporal_archive: "Transform this interior into a temporal archive, with preservation chambers, historical storage systems, time-locked vaults, keeping the original architecture timeless, eternal knowledge atmosphere, photorealistic, archival photography",
    
    symbiotic_habitat: "Transform this interior into a symbiotic habitat, with human-nature integration, bio-responsive architecture, living building systems, keeping the original structure organic, ecological harmony atmosphere, photorealistic, environmental photography",
    
    // Additional variants for existing types
    concert_hall: "Transform this interior into a professional concert hall, with orchestral stage in the chancel, tiered seating, world-class acoustics, keeping the original architecture majestic, classical music atmosphere, photorealistic, concert photography",
    
    market_hall: "Transform this interior into a historic market hall, with artisanal food stalls, local vendors, central circulation, keeping the original stone architecture, community commerce atmosphere, photorealistic, market photography",
    
    community_center: "Transform this interior into a vibrant community center, with multipurpose halls, meeting rooms, social gathering spaces, keeping the original architecture welcoming, community services atmosphere, photorealistic, community photography",
    
    wellness_spa: "Transform this interior into a serene wellness spa, with treatment rooms, relaxation areas, thermal pools, keeping the original architecture peaceful, holistic wellness atmosphere, photorealistic, spa photography",
    
    gaming_arena: "Transform this interior into a modern gaming arena, with esports stations, tournament seating, broadcast facilities, keeping the original architecture impressive, competitive gaming atmosphere, photorealistic, esports photography"
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
