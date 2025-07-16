// Configuration IA (côté serveur uniquement)
// Ce fichier ne doit être importé que dans les API routes

// Configuration DALL-E 3
export const AI_CONFIG = {
  dalle: {
    model: 'dall-e-3' as const,
    size: '1024x1024' as const,
    quality: 'hd' as const,
    style: 'vivid' as const,
  },
  pricing: {
    dalleHD: 0.08, // $0.080 per image for DALL-E 3 HD
    dalleStandard: 0.04, // $0.040 per image for DALL-E 3 Standard
  },
  limits: {
    maxRequestsPerMinute: 5,
    maxRequestsPerDay: 50,
    maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours
  }
} as const;

// Prompts optimisés pour l'église Saint-Gildas d'Auray
export const getBasePrompt = () => `
A beautiful historic French church interior with Gothic architecture, high vaulted ceilings, stone pillars, stained glass windows, wooden pews, and ornate religious details. The church is located in Auray, Brittany, France.
`;

export const getTransformationPrompt = (transformationPrompt: string, customPrompt?: string) => {
  const basePrompt = getBasePrompt();
  const specificPrompt = customPrompt || transformationPrompt;
  
  return `${basePrompt}\n\n${specificPrompt}\n\nMaintain the architectural integrity and grandeur of the original church structure while clearly showing the new purpose. The transformation should be realistic, respectful, and inspiring.`;
};
