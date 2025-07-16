import { NextRequest, NextResponse } from 'next/server';
import { 
  getTransformationPrompt,
  AI_CONFIG
} from '@/lib/ai-config';
import { 
  TRANSFORMATION_TYPES, 
  type GenerationResponse 
} from '@/lib/types';
import {
  uploadImageToGCS,
  checkImageExists,
  downloadImageAsBuffer,
  generateFileName
} from '@/lib/storage';

// Rate limiting simple (en production, utiliser Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = requestCounts.get(ip);
  
  if (!limit || now > limit.resetTime) {
    // Reset ou première requête
    requestCounts.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute
    return true;
  }
  
  if (limit.count >= AI_CONFIG.limits.maxRequestsPerMinute) {
    return false;
  }
  
  limit.count++;
  return true;
}

// Cache simple en mémoire (pour démo - en production utiliser Redis/DB)
const imageCache = new Map<string, { url: string; timestamp: number }>();

function getCacheKey(transformationType: string, customPrompt?: string): string {
  const content = `${transformationType}-${customPrompt || ''}`;
  // Simple hash pour éviter les collisions
  return Buffer.from(content).toString('base64').slice(0, 16);
}

function getCachedImage(cacheKey: string): string | null {
  const cached = imageCache.get(cacheKey);
  if (!cached) return null;
  
  // Cache valide 24h
  const isExpired = Date.now() - cached.timestamp > 24 * 60 * 60 * 1000;
  if (isExpired) {
    imageCache.delete(cacheKey);
    return null;
  }
  
  return cached.url;
}

function setCachedImage(cacheKey: string, url: string): void {
  imageCache.set(cacheKey, { url, timestamp: Date.now() });
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Récupération IP pour rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Vérification rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded. Maximum 5 requests per minute.'
      }, { status: 429 });
    }

    // Parse du body
    const body: any = await request.json();
    const { transformationType, customPrompt, style = 'vivid', quality = 'hd' } = body;

    // Validation des paramètres
    if (!transformationType) {
      return NextResponse.json({
        success: false,
        error: 'Transformation type is required'
      }, { status: 400 });
    }

    // Recherche du type de transformation
    const transformation = TRANSFORMATION_TYPES.find(t => t.id === transformationType);
    if (!transformation) {
      return NextResponse.json({
        success: false,
        error: 'Invalid transformation type'
      }, { status: 400 });
    }

    // Vérification de la clé API
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not configured');
      return NextResponse.json({
        success: false,
        error: 'AI service temporarily unavailable'
      }, { status: 503 });
    }

    // Génération du prompt optimisé
    const prompt = getTransformationPrompt(transformation, customPrompt);
    
    console.log(`🎨 Generating image for: ${transformation.name}`);
    console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

    const cacheKey = getCacheKey(transformationType, customPrompt);
    const cachedImage = getCachedImage(cacheKey);
    if (cachedImage) {
      console.log(`✅ Image found in cache`);
      const result: GenerationResponse = {
        success: true,
        imageUrl: cachedImage,
        metadata: {
          prompt: prompt,
          model: AI_CONFIG.dalle.model,
          generationTime: Date.now() - startTime,
          cost: quality === 'hd' ? AI_CONFIG.pricing.dalleHD : AI_CONFIG.pricing.dalleStandard
        }
      };
      return NextResponse.json(result);
    }

    const openaiInstance = new (await import('openai')).default({ apiKey: process.env.OPENAI_API_KEY! });
    const response = await openaiInstance.images.generate({
      model: AI_CONFIG.dalle.model,
      prompt,
      n: 1,
      size: AI_CONFIG.dalle.size,
      quality,
      style,
    });

    const generationTime = Date.now() - startTime;
    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    // Calcul du coût
    const cost = quality === 'hd' ? AI_CONFIG.pricing.dalleHD : AI_CONFIG.pricing.dalleStandard;

    console.log(`✅ Image generated successfully in ${generationTime}ms`);
    console.log(`💰 Cost: $${cost}`);

    setCachedImage(cacheKey, imageUrl);

    const result: GenerationResponse = {
      success: true,
      imageUrl: imageUrl,
      metadata: {
        prompt: prompt,
        model: AI_CONFIG.dalle.model,
        generationTime: generationTime,
        cost: cost
      }
    };

    return NextResponse.json(result);

  } catch (error: any) {
    const generationTime = Date.now() - startTime;
    
    console.error('❌ Error generating image:', error);
    
    // Gestion des erreurs spécifiques OpenAI
    let errorMessage = 'Failed to generate image';
    let statusCode = 500;

    if (error?.error?.code === 'rate_limit_exceeded') {
      errorMessage = 'AI service rate limit exceeded. Please try again later.';
      statusCode = 429;
    } else if (error?.error?.code === 'insufficient_quota') {
      errorMessage = 'AI service quota exceeded. Please contact support.';
      statusCode = 503;
    } else if (error?.error?.code === 'content_policy_violation') {
      errorMessage = 'Content violates AI service policies. Please try a different transformation.';
      statusCode = 400;
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      metadata: {
        generationTime: generationTime,
        model: AI_CONFIG.dalle.model
      }
    }, { status: statusCode });
  }
}

// GET endpoint pour récupérer les types de transformations disponibles
export async function GET() {
  return NextResponse.json({
    success: true,
    transformations: TRANSFORMATION_TYPES.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      icon: t.icon,
      category: t.category,
      style: t.style
    })),
    config: {
      maxRequestsPerMinute: AI_CONFIG.limits.maxRequestsPerMinute,
      maxRequestsPerDay: AI_CONFIG.limits.maxRequestsPerDay,
      supportedSizes: [AI_CONFIG.dalle.size],
      supportedQualities: ['standard', 'hd'],
      supportedStyles: ['vivid', 'natural']
    }
  });
}
