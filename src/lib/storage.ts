// Service Google Cloud Storage pour images IA
import { Storage } from '@google-cloud/storage';

// Configuration GCS
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const BUCKET_NAME = process.env.GOOGLE_CLOUD_BUCKET_NAME || 'auray-church-transformations';
const bucket = storage.bucket(BUCKET_NAME);

export interface StorageResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload une image vers Google Cloud Storage
 */
export async function uploadImageToGCS(
  imageBuffer: Buffer,
  fileName: string,
  contentType: string = 'image/jpeg'
): Promise<StorageResult> {
  try {
    const file = bucket.file(`transformations/${fileName}`);
    
    await file.save(imageBuffer, {
      metadata: {
        contentType,
        cacheControl: 'public, max-age=86400', // Cache 24h
      },
      public: true, // Rendre l'image publique
    });

    // URL publique
    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/transformations/${fileName}`;
    
    console.log(`✅ Image uploaded to GCS: ${publicUrl}`);
    return { success: true, url: publicUrl };
    
  } catch (error) {
    console.error('❌ GCS Upload Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
}

/**
 * Vérifie si une image existe déjà dans GCS
 */
export async function checkImageExists(fileName: string): Promise<string | null> {
  try {
    const file = bucket.file(`transformations/${fileName}`);
    const [exists] = await file.exists();
    
    if (exists) {
      const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/transformations/${fileName}`;
      console.log(`✅ Image found in GCS: ${publicUrl}`);
      return publicUrl;
    }
    
    return null;
  } catch (error) {
    console.error('❌ GCS Check Error:', error);
    return null;
  }
}

/**
 * Télécharge une image depuis une URL et la convertit en Buffer
 */
export async function downloadImageAsBuffer(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Génère un nom de fichier unique basé sur la transformation
 */
export function generateFileName(
  transformationType: string, 
  customPrompt?: string,
  extension: string = 'jpg'
): string {
  const content = `${transformationType}-${customPrompt || ''}`;
  const hash = Buffer.from(content).toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 12);
  
  return `church-${transformationType}-${hash}.${extension}`;
}

/**
 * Nettoie les anciennes images (optionnel, pour économiser l'espace)
 */
export async function cleanupOldImages(daysOld: number = 30): Promise<void> {
  try {
    const [files] = await bucket.getFiles({ prefix: 'transformations/' });
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    for (const file of files) {
      const [metadata] = await file.getMetadata();
      const createdDate = new Date(metadata.timeCreated);
      
      if (createdDate < cutoffDate) {
        await file.delete();
        console.log(`🗑️ Deleted old image: ${file.name}`);
      }
    }
  } catch (error) {
    console.error('❌ Cleanup Error:', error);
  }
}
