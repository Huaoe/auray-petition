import { CONSTANTS } from "./utils";
import { TransformationType, TRANSFORMATION_TYPES } from "./types";

/**
 * Interface for transformation data
 */
export interface TransformationData {
  id: string;
  transformationType: TransformationType;
  imageUrl: string;
  description: string;
  createdAt: string;
  likes: number;
  shares: number;
  comments: TransformationComment[];
}

/**
 * Interface for transformation comments
 */
export interface TransformationComment {
  id: string;
  author: string;
  text: string;
  date: string;
}

/**
 * Get transformation by ID
 */
export const getTransformationById = async (id: string): Promise<TransformationData | null> => {
  try {
    // In a real app, this would fetch from a database
    // For now, we'll return mock data
    const transformationType = TRANSFORMATION_TYPES.find(t => t.id === id.split('-')[0]) || TRANSFORMATION_TYPES[0];
    
    return {
      id,
      transformationType,
      // Use the correct Google Cloud Storage URL format
      imageUrl: `https://storage.googleapis.com/auray-church-transformations/transformations/${id}`,
      description: `${transformationType.name} - ${transformationType.description}`,
      createdAt: new Date().toISOString(),
      likes: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50),
      comments: [
        {
          id: '1',
          author: 'Marie Dupont',
          text: 'Cette transformation est magnifique ! J\'adore comment l\'espace a été repensé.',
          date: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
        },
        {
          id: '2',
          author: 'Jean Martin',
          text: 'Très belle vision pour notre église. J\'espère que ce projet pourra se réaliser !',
          date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching transformation:', error);
    return null;
  }
};

/**
 * Generate a URL for a transformation
 */
export const getTransformationUrl = (id: string, absolute = false): string => {
  const baseUrl = absolute 
    ? (typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_SITE_URL || 'https://petition-eglise-auray.fr')
    : '';
  
  return `${baseUrl}/transformation/${id}`;
};

/**
 * Get Open Graph metadata for a transformation
 */
export const getTransformationMetadata = async (id: string) => {
  const transformation = await getTransformationById(id);
  
  if (!transformation) {
    return {
      title: `Transformation d'église - ${CONSTANTS.CHURCH_NAME}`,
      description: `Découvrez comment ${CONSTANTS.CHURCH_NAME} pourrait être transformée pour servir la communauté.`,
      // Use the correct Google Cloud Storage URL format for the fallback image
      imageUrl: `https://storage.googleapis.com/auray-church-transformations/transformations/default`,
    };
  }
  
  return {
    title: `${transformation.transformationType.name} - ${CONSTANTS.CHURCH_NAME}`,
    description: transformation.description,
    imageUrl: transformation.imageUrl,
  };
};