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
  }
];
