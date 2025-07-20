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
import { getStabilityBalance } from "@/lib/stability-balance";

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
  imageBuffer: Buffer,
  prompt: string
): Promise<{ imageUrl: string; cost: number; actualCost?: number }> {
  try {
    console.log("🎨 Starting Stability AI generation...");
    
    // 📊 MONITORING: Solde AVANT génération
    const balanceBefore = await getStabilityBalance();
    console.log(`💰 Balance AVANT génération: ${balanceBefore} crédits`);
    
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("image", new Blob([imageBuffer]), "image.webp");
    formData.append("strength", "0.7");
    formData.append("aspect_ratio", STABILITY_CONFIG.ASPECT_RATIO);
    formData.append("output_format", STABILITY_CONFIG.OUTPUT_FORMAT);

    const response = await fetch(STABILITY_CONFIG.API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        Accept: "image/*",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Stability AI API error:", response.status, errorText);
      throw new Error(`Stability AI error: ${response.status}`);
    }

    // Ultra API returns the image directly as binary data
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    
    // 📊 MONITORING: Solde APRÈS génération
    const balanceAfter = await getStabilityBalance();
    const actualCost = balanceBefore - balanceAfter;
    
    console.log(`💰 Balance APRÈS génération: ${balanceAfter} crédits`);
    console.log(`💰 Coût RÉEL: ${actualCost} crédits (estimé: ${STABILITY_CONFIG.PRICING.per_generation})`);
    
    // Convert to base64 data URL for consistency with existing code
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/webp;base64,${base64Image}`;

    return {
      imageUrl: dataUrl,
      cost: STABILITY_CONFIG.PRICING.per_generation, // Coût estimé pour compatibilité
      actualCost: actualCost, // Coût réel mesuré
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

    // Valider le format du coupon (XXXX-XXXX-XXXX ou XXXXXXXXXXXX pour compatibilité)
    const couponRegexWithDashes = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    const couponRegexWithoutDashes = /^[A-Z0-9]{10,12}$/;
    const normalizedCoupon = couponCode.toUpperCase();
    
    if (!couponRegexWithDashes.test(normalizedCoupon) && !couponRegexWithoutDashes.test(normalizedCoupon)) {
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

    // Générer l'image avec monitoring des coûts
    const { imageUrl: tempImageUrl, cost, actualCost } = await generateWithStabilityAI(
      baseImageBuffer,
      prompt
    );

    console.log(`🎨 Image generated successfully`);
    console.log(`💰 Cost monitoring - Estimated: $${cost}, Actual: ${actualCost} credits`);

    // Upload vers GCS
    const finalImageUrl = await uploadImageToGCS(
      tempImageUrl,
      fileName,
      "image/webp"
    );

    const endTime = Date.now();
    const generationTime = endTime - startTime;

    // Retourner les deux coûts pour analyse
    return NextResponse.json({
      success: true,
      imageUrl: finalImageUrl,
      cost: cost, // Coût estimé (pour compatibilité)
      actualCost: actualCost, // Coût réel mesuré
      generationTime,
      metadata: {
        transformationType,
        prompt: prompt.substring(0, 100) + "...",
        cacheUsed: false,
        costAnalysis: {
          estimated: cost,
          actual: actualCost,
          difference: actualCost ? Math.abs(cost - actualCost) : 0,
        }
      },
    });

  } catch (error) {
    console.error("❌ Transformation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
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

async function getStabilityBalance(): Promise<number> {
  const response = await fetch('https://api.stability.ai/v1/user/balance', {
    headers: { 'Authorization': `Bearer ${process.env.STABILITY_API_KEY}` }
  });
  const data = await response.json();
  return data.credits || 0;
}
