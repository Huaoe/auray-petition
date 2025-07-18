// Types pour les transformations (côté client safe)
export interface TransformationType {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
  style: 'realistic' | 'artistic' | 'modern' | 'creative';
  category: 'culture' | 'business' | 'community' | 'innovation';
}

export interface GenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    generationTime: number;
    cost: number;
    model: string;
    prompt: string;
  };
}

// Transformations disponibles (côté client safe)
export const TRANSFORMATION_TYPES: TransformationType[] = [
  {
    id: 'library',
    name: 'Bibliothèque Moderne',
    description: 'Une bibliothèque contemporaine avec espaces de lecture et technologie',
    icon: '📚',
    prompt: 'Transform this church into a modern public library with bookshelves, reading areas, comfortable seating, natural lighting, and digital workstations. Maintain the architectural beauty while creating a welcoming space for learning and community gathering.',
    style: 'modern',
    category: 'culture'
  },
  {
    id: 'restaurant',
    name: 'Restaurant Gastronomique',
    description: 'Un restaurant haut de gamme dans un cadre historique exceptionnel',
    icon: '🍽️',
    prompt: 'Transform this church into an elegant fine dining restaurant with sophisticated table settings, ambient lighting, a professional kitchen area, and wine displays. Preserve the grandeur while creating an intimate dining atmosphere.',
    style: 'realistic',
    category: 'business'
  },
  {
    id: 'coworking',
    name: 'Espace de Coworking',
    description: 'Un espace de travail collaboratif moderne et inspirant',
    icon: '💻',
    prompt: 'Transform this church into a modern coworking space with open work areas, private meeting rooms, comfortable lounge areas, and modern technology infrastructure. Blend historical architecture with contemporary workspace design.',
    style: 'modern',
    category: 'business'
  },
  {
    id: 'concert_hall',
    name: 'Salle de Concert',
    description: 'Une salle de spectacle acoustiquement parfaite',
    icon: '🎵',
    prompt: 'Transform this church into a concert hall with professional stage, audience seating, acoustic panels, and performance lighting. Enhance the natural acoustics while maintaining the architectural integrity.',
    style: 'artistic',
    category: 'culture'
  },
  {
    id: 'art_gallery',
    name: 'Galerie d\'Art',
    description: 'Un espace d\'exposition pour l\'art contemporain et classique',
    icon: '🎨',
    prompt: 'Transform this church into an art gallery with professional lighting, display walls, sculpture pedestals, and viewing areas. Create a sophisticated space that showcases artwork while respecting the historical architecture.',
    style: 'artistic',
    category: 'culture'
  },
  {
    id: 'community_center',
    name: 'Centre Communautaire',
    description: 'Un lieu de rassemblement pour la communauté locale',
    icon: '🏛️',
    prompt: 'Transform this church into a community center with flexible meeting spaces, activity areas, a small stage, and social gathering zones. Create a welcoming environment for community events and activities.',
    style: 'modern',
    category: 'community'
  },
  {
    id: 'wellness_spa',
    name: 'Centre de Bien-être',
    description: 'Un spa luxueux pour la détente et le ressourcement',
    icon: '🧘',
    prompt: 'Transform this church into a wellness spa with meditation areas, treatment rooms, relaxation pools, and zen gardens. Create a peaceful, healing environment that promotes tranquility and well-being.',
    style: 'modern',
    category: 'community'
  },
  {
    id: 'innovation_lab',
    name: 'Laboratoire d\'Innovation',
    description: 'Un espace high-tech pour la recherche et l\'innovation',
    icon: '🔬',
    prompt: 'Transform this church into a high-tech innovation laboratory with modern equipment, research stations, collaborative spaces, and digital displays. Blend cutting-edge technology with the historical architecture.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'market_hall',
    name: 'Marché Couvert',
    description: 'Un marché artisanal et gastronomique local',
    icon: '🛒',
    prompt: 'Transform this church into a covered market with artisanal food stalls, local produce vendors, seating areas, and a central gathering space. Create a vibrant marketplace that celebrates local culture and cuisine.',
    style: 'realistic',
    category: 'community'
  },
  {
    id: 'gaming_arena',
    name: 'Arène Gaming',
    description: 'Un espace gaming et e-sport de nouvelle génération',
    icon: '🎮',
    prompt: 'Transform this church into a modern gaming arena with high-end gaming stations, tournament seating, streaming equipment, and LED lighting. Create an exciting esports venue while maintaining architectural respect.',
    style: 'creative',
    category: 'innovation'
  },
  {
    id: 'biophilic_sanctuary',
    name: 'Sanctuaire Biophilique',
    description: 'Un espace de reconnexion avec la nature intégrant végétation et architecture',
    icon: '🌿',
    prompt: 'Transform this church into a cutting-edge biophilic sanctuary with living walls, suspended gardens, natural water features, and organic architectural elements. Integrate advanced hydroponic systems, climate-controlled micro-ecosystems, and biomimetic design patterns that blur the boundaries between interior and nature.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'holographic_museum',
    name: 'Musée Holographique',
    description: 'Un musée immersif utilisant la réalité augmentée et les hologrammes',
    icon: '🔮',
    prompt: 'Transform this church into a futuristic holographic museum with transparent OLED displays, volumetric projection systems, interactive AR installations, and floating holographic exhibits. Feature sleek minimalist design with hidden technology infrastructure and dynamic lighting that responds to visitor presence.',
    style: 'creative',
    category: 'culture'
  },
  {
    id: 'vertical_farm',
    name: 'Ferme Verticale Urbaine',
    description: 'Une ferme verticale high-tech pour l\'agriculture urbaine durable',
    icon: '🌱',
    prompt: 'Transform this church into a revolutionary vertical farm with multi-story growing towers, automated hydroponic systems, LED grow lights, robotic harvesting systems, and transparent growing chambers. Integrate sustainable technology with Gothic architecture, featuring glass cultivation pods and climate-controlled growing environments.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'quantum_research',
    name: 'Centre de Recherche Quantique',
    description: 'Un laboratoire de recherche quantique avec équipements de pointe',
    icon: '⚛️',
    prompt: 'Transform this church into a quantum research facility with cryogenic chambers, quantum computers, electromagnetic isolation chambers, and advanced scientific equipment. Feature ultra-modern clean room environments, particle accelerator components, and holographic data visualization systems within the preserved Gothic structure.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'metamorphic_theater',
    name: 'Théâtre Métamorphique',
    description: 'Un théâtre avec scène transformable et architecture adaptative',
    icon: '🎭',
    prompt: 'Transform this church into a metamorphic theater with shape-shifting stage configurations, moveable architectural elements, dynamic acoustic panels, and programmable lighting systems. Feature retractable seating, modular performance spaces, and kinetic architectural components that can reconfigure for different types of performances.',
    style: 'creative',
    category: 'culture'
  },
  {
    id: 'neural_interface_lab',
    name: 'Laboratoire d\'Interface Neuronale',
    description: 'Un centre de recherche sur les interfaces cerveau-machine',
    icon: '🧠',
    prompt: 'Transform this church into a neural interface research laboratory with brain-computer interface stations, neural mapping equipment, meditation chambers with EEG monitoring, and consciousness research facilities. Integrate cutting-edge neurotechnology with serene, contemplative spaces that honor the spiritual heritage.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'crystalline_conservatory',
    name: 'Conservatoire Cristallin',
    description: 'Un conservatoire de musique avec acoustique cristalline révolutionnaire',
    icon: '💎',
    prompt: 'Transform this church into a crystalline conservatory with geometric crystal-inspired architecture, resonant crystal formations for natural acoustics, prismatic light diffusion systems, and mineral-based sound chambers. Feature crystalline performance pods, geode-inspired practice rooms, and harmonic crystal installations.',
    style: 'artistic',
    category: 'culture'
  },

  {
    id: 'temporal_archive',
    name: 'Archive Temporelle',
    description: 'Un centre de préservation numérique avec technologie de stockage quantique',
    icon: '⏳',
    prompt: 'Transform this church into a temporal archive with quantum storage systems, holographic data preservation chambers, time-locked vaults, and digital eternity installations. Feature crystalline data storage matrices, temporal visualization displays, and preservation pods that maintain digital heritage for millennia.',
    style: 'creative',
    category: 'culture'
  },
  {
    id: 'symbiotic_habitat',
    name: 'Habitat Symbiotique',
    description: 'Un écosystème vivant où humains et nature coexistent harmonieusement',
    icon: '🦋',
    prompt: 'Transform this church into a symbiotic habitat with living architecture, bio-responsive materials, symbiotic organism cultivation, and human-nature integration systems. Feature breathing walls, organic growth chambers, bio-luminescent lighting, and spaces where the boundary between built environment and living ecosystem dissolves completely.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'climbing',
    name: 'Centre d\'Escalade',
    description: 'Un centre d\'escalade moderne avec murs d\'escalade et espaces d\'entraînement',
    icon: '🧗',
    prompt: 'Transform this church into a modern climbing center with artificial climbing walls of various difficulties, bouldering areas, safety equipment storage, and training spaces. Integrate climbing routes that utilize the church\'s height and architectural features while maintaining structural integrity.',
    style: 'modern',
    category: 'community'
  },
  {
    id: 'swimming_pool',
    name: 'Centre Aquatique',
    description: 'Un complexe aquatique avec piscines et espaces de bien-être aquatique',
    icon: '🏊',
    prompt: 'Transform this church into an aquatic center with swimming pools, spa facilities, hydrotherapy areas, and relaxation zones. Feature modern pool systems, underwater lighting, and water features that complement the architectural grandeur while creating a serene aquatic environment.',
    style: 'modern',
    category: 'community'
  },
  {
    id: 'sauna_hammam',
    name: 'Sauna Hammam Massage',
    description: 'Un centre de bien-être avec sauna, hammam et espaces de massage',
    icon: '🧖',
    prompt: 'Transform this church into a luxurious sauna and hammam center with traditional steam rooms, dry saunas, massage therapy rooms, and relaxation areas. Feature natural stone finishes, ambient lighting, and therapeutic water features that create a serene wellness sanctuary.',
    style: 'modern',
    category: 'community'
  },
  {
    id: 'indoor_skydiving',
    name: 'Soufflerie Chute Libre',
    description: 'Un centre de chute libre indoor avec soufflerie verticale',
    icon: '🪂',
    prompt: 'Transform this church into an indoor skydiving facility with a vertical wind tunnel, viewing areas, training spaces, and equipment storage. Integrate the high-tech wind generation system with the church\'s vertical architecture while maintaining safety and excitement.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'trampoline_park',
    name: 'Parc de Trampolines',
    description: 'Un parc de trampolines avec zones de saut et activités aériennes',
    icon: '🤸',
    prompt: 'Transform this church into a trampoline park with interconnected trampolines, foam pits, dodgeball courts, and aerial activity zones. Utilize the church\'s height for spectacular jumping experiences while ensuring safety with protective padding and modern equipment.',
    style: 'creative',
    category: 'community'
  },
  {
    id: 'laser_game',
    name: 'Laser Game',
    description: 'Une arène de laser game avec parcours futuristes et effets spéciaux',
    icon: '🔫',
    prompt: 'Transform this church into a laser tag arena with multi-level playing fields, futuristic obstacles, LED lighting effects, and fog machines. Create an immersive sci-fi environment with strategic hiding spots and dynamic lighting that enhances the gaming experience.',
    style: 'creative',
    category: 'innovation'
  },
  {
    id: 'playground',
    name: 'Parc de Jeu',
    description: 'Un parc de jeu indoor avec structures ludiques et espaces familiaux',
    icon: '🎠',
    prompt: 'Transform this church into an indoor playground with climbing structures, slides, ball pits, and family activity areas. Create a safe, colorful environment with soft play equipment, interactive games, and comfortable seating areas for parents.',
    style: 'creative',
    category: 'community'
  },
  {
    id: 'third_place',
    name: 'Tiers Lieu',
    description: 'Un espace hybride combinant travail, culture et vie sociale',
    icon: '🏘️',
    prompt: 'Transform this church into a third place combining coworking spaces, cultural activities, café areas, and community meeting rooms. Create a flexible, multi-functional environment that serves as a social hub for work, learning, and community engagement.',
    style: 'modern',
    category: 'community'
  },
  {
    id: 'fablab',
    name: 'FabLab',
    description: 'Un laboratoire de fabrication numérique avec imprimantes 3D et outils',
    icon: '🔧',
    prompt: 'Transform this church into a fabrication laboratory with 3D printers, laser cutters, CNC machines, electronics workbenches, and maker spaces. Combine high-tech digital fabrication tools with traditional craftsmanship areas in an inspiring creative environment.',
    style: 'modern',
    category: 'innovation'
  },
  {
    id: 'ice_rink',
    name: 'Patinoire',
    description: 'Une patinoire couverte avec espaces de patinage et gradins',
    icon: '⛸️',
    prompt: 'Transform this church into an indoor ice rink with professional ice surface, spectator seating, changing rooms, and warming areas. Integrate modern refrigeration systems and lighting while preserving the architectural grandeur for a unique skating experience.',
    style: 'modern',
    category: 'community'
  },
  {
    id: 'cat_cuddling',
    name: 'Cat Cuddling',
    description: 'Un café à chats avec espaces de détente et adoption féline',
    icon: '🐱',
    prompt: 'Transform this church into a cat café with comfortable seating areas, cat play structures, adoption spaces, and cozy nooks for human-feline interaction. Create a peaceful, hygienic environment with cat-friendly furniture and calming design elements.',
    style: 'modern',
    category: 'community'
  }
];
