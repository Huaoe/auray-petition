import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import crypto from "crypto";
import { STABILITY_CONFIG, validateAIConfig } from "@/lib/ai-config";
import { GenerationResponse, TRANSFORMATION_TYPES } from "@/lib/types";
import {
  uploadImageToGCS,
  checkImageExists,
  downloadImageAsBuffer,
  generateFileName,
} from "@/lib/storage";

// Rate limiting simple (en mémoire)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = {
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
};

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT.windowMs) {
    // Reset ou nouvelle entrée
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return false; // Rate limit dépassé
  }

  record.count++;
  return true;
}

async function getBaseImageAsBuffer(baseImageName?: string): Promise<Buffer> {
  try {
    // Utiliser l'image spécifiée ou l'image par défaut
    const imageName = baseImageName || "Saint-Gildas-Auray-768x576.webp";

    // Chemin vers l'image de l'église dans public/images
    const imagePath = path.join(process.cwd(), "public", "images", imageName);

    // Lire l'image comme buffer
    const imageBuffer = await fs.readFile(imagePath);
    return imageBuffer;
  } catch (error) {
    console.error("Error reading base church image:", error);
    throw new Error("Failed to load base church image");
  }
}

async function resizeImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    console.log("🖼️ Starting image resize process...");

    // Résoudre les dimensions de l'image
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    console.log(`📏 Original dimensions: ${width}x${height}`);

    // Définir les dimensions maximales autorisées par Stability AI
    const maxWidth = 1536;
    const maxHeight = 1536;
    const minWidth = 320;
    const minHeight = 320;

    // Calculer les nouvelles dimensions tout en maintenant le rapport d'aspect
    let newWidth = width;
    let newHeight = height;

    if (width > maxWidth || height > maxHeight) {
      console.log("⚠️ Image too large, resizing down...");
      if (width > height) {
        newWidth = maxWidth;
        newHeight = Math.round(height * (maxWidth / width));
      } else {
        newHeight = maxHeight;
        newWidth = Math.round(width * (maxHeight / height));
      }
    } else if (width < minWidth || height < minHeight) {
      console.log("⚠️ Image too small, resizing up...");
      if (width < height) {
        newWidth = minWidth;
        newHeight = Math.round(height * (minWidth / width));
      } else {
        newHeight = minHeight;
        newWidth = Math.round(width * (minHeight / height));
      }
    } else {
      console.log("✅ Image dimensions are within acceptable range");
    }

    console.log(`📐 Target dimensions: ${newWidth}x${newHeight}`);

    // Redimensionner l'image
    const resizedImage = await sharp(imageBuffer)
      .resize(newWidth, newHeight)
      .toFormat("webp")
      .toBuffer();

    console.log("✅ Image resized successfully");
    return resizedImage;
  } catch (error) {
    console.error("❌ Error resizing image:", error);
    throw new Error("Failed to resize image");
  }
}

async function generateWithStabilityAI(
  baseImageBuffer: Buffer,
  prompt: string
): Promise<{ imageUrl: string; cost: number }> {
  try {
    validateAIConfig();

    // Redimensionner l'image de base si nécessaire
    const resizedImageBuffer = await resizeImage(baseImageBuffer);

    const formData = new FormData();
    
    // Ultra v2beta uses "image" field (not "init_image")
    formData.append("image", new Blob([resizedImageBuffer], { type: "image/webp" }));

    // Prompt handling with Ultra v2beta format
    const maxPromptLength = 2000;
    const truncatedPrompt = prompt.length > maxPromptLength 
      ? prompt.substring(0, maxPromptLength - 4) + "..."
      : prompt;

    // Ultra v2beta specific parameters
    formData.append("prompt", truncatedPrompt);
    formData.append("mode", "image-to-image");
    formData.append("model", STABILITY_CONFIG.MODEL);
    formData.append("output_format", "webp");
    
    // Add negative prompt if supported
    formData.append("negative_prompt", 
      "empty, no people, few people, empty space, bland, boring, generic, low quality, blurry, distorted, malformed"
    );

    // Add generation parameters that are supported by Ultra
    formData.append("strength", STABILITY_CONFIG.PROMPT_STRENGTH.toString());
    formData.append("seed", "0");

    const response = await fetch(STABILITY_CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
        "Accept": "image/*",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Stability AI API Error:", response.status, errorText);
      throw new Error(`Stability AI API error: ${response.status}`);
    }

    // Ultra API returns the image directly as binary data
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    
    // Convert to base64 data URL for consistency with existing code
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/webp;base64,${base64Image}`;

    return {
      imageUrl: dataUrl,
      cost: STABILITY_CONFIG.PRICING.per_generation,
    };
  } catch (error) {
    console.error("Stability AI generation error:", error);
    throw error;
  }
}

interface TransformRequest {
  baseImage: string;
  transformationType: string;
  customPrompt?: string;
  noCache?: boolean;
  couponCode: string; // Code coupon requis
}
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Vérification du rate limiting (Next.js 15 compatible)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0].trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      request.headers.get("x-client-ip")?.trim() ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded. Please wait before making another request.",
          success: false,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { 
      transformationType, 
      baseImage, 
      customPrompt, 
      noCache,
      couponCode // Code coupon requis
    }: TransformRequest = body;

    console.log(`🎯 Transform request: ${transformationType} with image: ${baseImage}`);
    
    // VALIDATION DU COUPON OBLIGATOIRE
    if (!couponCode || couponCode.trim().length === 0) {
      console.log('❌ Coupon code missing');
      return NextResponse.json(
        { 
          error: 'Code de coupon requis',
          message: 'Vous devez signer la pétition pour obtenir un coupon de génération d\'images'
        },
        { status: 400 }
      );
    }

    // Valider le format du coupon (XXXX-XXXX-XXXX)
    const couponRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!couponRegex.test(couponCode.toUpperCase())) {
      console.log(`❌ Invalid coupon format: ${couponCode}`);
      return NextResponse.json(
        { 
          error: 'Format de coupon invalide',
          message: 'Le code de coupon doit avoir le format XXXX-XXXX-XXXX'
        },
        { status: 400 }
      );
    }

    console.log(`🎫 Coupon format validated: ${couponCode}`);

    // Validation des autres paramètres
    if (!transformationType || !baseImage) {
      return NextResponse.json(
        { error: "transformationType and baseImage are required", success: false },
        { status: 400 }
      );
    }

    // Generate cache key that includes custom prompt for uniqueness
    const promptHash = crypto.createHash('sha256').update(customPrompt || '').digest('hex').slice(0, 10);
    const cacheKey = `church-${transformationType}-${baseImage}-${promptHash}`;

    // If noCache is true, skip the cache check entirely
    if (!noCache) {
      // Check cache first
      const cachedImage = await checkImageExists(cacheKey);
      
      if (cachedImage) {
        console.log(`✅ Cache HIT - Image served from cache: ${cacheKey}`);
        return NextResponse.json({
          imageUrl: cachedImage,
          cost: 0, // No cost for cached images
          cached: true,
          couponCode: couponCode // Return coupon code for client tracking
        });
      }
      
      console.log(`🔍 Cache MISS - Proceeding with generation: ${cacheKey}`);
    } else {
      console.log(`🚫 Cache bypassed (noCache: true) for: ${cacheKey}`);
    }

    // Trouver la configuration de transformation dans le tableau
    const transformationConfig = TRANSFORMATION_TYPES.find(
      (t) => t.id === transformationType
    );
    if (!transformationConfig) {
      return NextResponse.json(
        { error: "Invalid transformation type", success: false },
        { status: 400 }
      );
    }

    console.log(`🎨 Starting img2img transformation: ${transformationType}`);

    // Obtenir l'image de base de l'église
    const baseImageBuffer = await getBaseImageAsBuffer(baseImage);
    console.log(
      `📸 Base image loaded: ${baseImageBuffer.length} bytes${baseImage ? ` (${baseImage})` : ""}`
    );

    // Générer le prompt optimisé
    const prompt = customPrompt || transformationConfig.prompt;
    console.log(`📝 Using prompt (${prompt.length} chars):`, prompt);

    // Vérifier si le prompt contient l'exigence obligatoire
    const hasMandatoryPeople =
      prompt.toLowerCase().includes("happy") &&
      prompt.toLowerCase().includes("people");
    console.log(
      `👥 Mandatory people requirement included: ${hasMandatoryPeople ? "✅" : "❌"}`
    );

    // Générer l'image avec Stability AI
    const { imageUrl: tempImageUrl, cost } = await generateWithStabilityAI(
      baseImageBuffer,
      prompt
    );

    console.log(`🎨 Image generated successfully`);

    // Uploader vers Google Cloud Storage
    let finalImageUrl = tempImageUrl;
    try {
      // Extraire le buffer de l'image de la data URL
      const base64Data = tempImageUrl.replace(
        /^data:image\/[a-z]+;base64,/,
        ""
      );
      const imageBuffer = Buffer.from(base64Data, "base64");

      // Appeler uploadImageToGCS avec le bon type de contenu
      const storageResult = await uploadImageToGCS(imageBuffer, cacheKey);

      // Utiliser l'URL GCS si le téléchargement a réussi
      if (storageResult.success && storageResult.url) {
        finalImageUrl = storageResult.url;
        console.log(`☁️ Image uploaded to GCS: ${cacheKey}`);
      } else {
        console.warn("⚠️ GCS upload failed, using fallback data URL");
      }
    } catch (error) {
      console.error("❌ GCS Upload Error:", error);
      // Continuer avec l'URL temporaire en fallback
    }

    const generationTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      imageUrl: finalImageUrl,
      generationTime,
      cost,
      cached: false,
      transformation: transformationConfig,
      couponCode: couponCode // Return coupon code for client tracking
    } as GenerationResponse);
  } catch (error) {
    console.error("API Error:", error);

    const generationTime = Date.now() - startTime;

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        generationTime,
      } as GenerationResponse,
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Church Transformation API with Stability AI img2img",
    availableTransformations: Object.keys(TRANSFORMATION_TYPES),
    pricing: STABILITY_CONFIG.PRICING,
    rateLimit: RATE_LIMIT,
  });
}
