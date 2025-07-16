import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import crypto from "crypto";
import { STABILITY_CONFIG, validateAIConfig } from "@/lib/ai-config";
import { GenerationResponse } from "@/lib/types";
import {
  uploadImageToGCS,
  checkImageExists,
  downloadImageAsBuffer,
  generateFileName,
} from "@/lib/storage";
import { 
  INPAINT_IMAGES, 
  HD_PAINTER_CONFIG,
  generateInpaintCacheKey,
  type HDPainterMethod,
  type InpaintRequest
} from "@/lib/inpaint-config";

// Rate limiting simple (en mémoire)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = {
  maxRequests: 3, // Plus restrictif pour l'inpainting HD
  windowMs: 60 * 1000, // 1 minute
};

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT.windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

async function getImageAsBuffer(imagePath: string): Promise<Buffer> {
  try {
    const fullPath = path.join(process.cwd(), "public", imagePath.startsWith("/") ? imagePath.slice(1) : imagePath);
    const imageBuffer = await fs.readFile(fullPath);
    return imageBuffer;
  } catch (error) {
    console.error(`Error reading image ${imagePath}:`, error);
    throw new Error(`Failed to load image: ${imagePath}`);
  }
}

async function resizeImageForInpainting(imageBuffer: Buffer, resolution: keyof typeof HD_PAINTER_CONFIG.resolutions = "hd", type: "base" | "mask" = "base"): Promise<Buffer> {
  try {
    const maxSize = HD_PAINTER_CONFIG.resolutions[resolution].maxSize;
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    console.log(`📏 Original dimensions: ${width}x${height}`);

    // HD-Painter supporte des résolutions plus élevées
    let newWidth = width;
    let newHeight = height;

    if (Math.max(width, height) > maxSize) {
      console.log(`⚠️ Resizing to max ${maxSize}px (${resolution})`);
      if (width > height) {
        newWidth = maxSize;
        newHeight = Math.round(height * (maxSize / width));
      } else {
        newHeight = maxSize;
        newWidth = Math.round(width * (maxSize / height));
      }
    }

    console.log(`📐 Target dimensions: ${newWidth}x${newHeight}`);

    // Pour l'API officielle /edit/inpaint: PNG format requis
    let sharpInstance = sharp(imageBuffer)
      .resize(newWidth, newHeight);
    
    if (type === "mask") {
      // Pour les masques: binarisation stricte (noir=préserver, blanc=changer)
      sharpInstance = sharpInstance
        .threshold(128) // Pixels >128 deviennent blancs (255), <=128 deviennent noirs (0)
        .png(); // Format PNG pour masques
    } else {
      // Pour les images de base: format PNG sans alpha
      sharpInstance = sharpInstance
        .png({ compressionLevel: 6 }); // PNG optimisé
    }
    
    const resizedImage = await sharpInstance.toBuffer();

    return resizedImage;
  } catch (error) {
    console.error("❌ Error resizing image:", error);
    throw new Error("Failed to resize image");
  }
}

async function generateWithStabilityInpainting(
  baseImageBuffer: Buffer,
  maskImageBuffer: Buffer,
  prompt: string,
  method: HDPainterMethod
): Promise<string> {
  try {
    console.log(`🎨 Generating with HD-Painter method: ${method}`);
    console.log(`📏 Base image size: ${baseImageBuffer.length} bytes`);
    console.log(`🎭 Mask size: ${maskImageBuffer.length} bytes`);
    console.log(`📝 Prompt: ${prompt}`);

    const formData = new FormData();
    
    // Image de base (PNG format for better compatibility)
    formData.append("image", new Blob([baseImageBuffer], { type: "image/png" }));
    
    // Masque d'inpainting (PNG format, black=preserve, white=change)
    formData.append("mask", new Blob([maskImageBuffer], { type: "image/png" }));

    // Prompt avec méthode HD-Painter
    const hdPainterPrompt = `[HD-Painter:${method}] ${prompt}`;
    formData.append("prompt", hdPainterPrompt);
    
    // Paramètres officiels pour /edit/inpaint
    formData.append("output_format", STABILITY_CONFIG.INPAINT_OUTPUT_FORMAT);
    formData.append("steps", STABILITY_CONFIG.INPAINT_STEPS.toString());
    formData.append("cfg_scale", STABILITY_CONFIG.INPAINT_CFG_SCALE.toString());
    
    // Optionnel: seed pour reproductibilité
    if (STABILITY_CONFIG.SEED > 0) {
      formData.append("seed", STABILITY_CONFIG.SEED.toString());
    }

    console.log(`⚙️  Params: steps=${STABILITY_CONFIG.INPAINT_STEPS}, cfg_scale=${STABILITY_CONFIG.INPAINT_CFG_SCALE}, format=${STABILITY_CONFIG.INPAINT_OUTPUT_FORMAT}`);

    // Utilisation de l'endpoint officiel /edit/inpaint
    const response = await fetch(STABILITY_CONFIG.INPAINT_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        Accept: "image/*", // API officielle exige image/* ou application/json
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Stability API error:", response.status, errorText);
      throw new Error(`Stability API error: ${response.status} - ${errorText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const dataUrl = `data:image/${STABILITY_CONFIG.INPAINT_OUTPUT_FORMAT};base64,${base64Image}`;

    console.log(`🎨 HD-Painter image generated successfully with method: ${method}`);
    return dataUrl;
  } catch (error) {
    console.error("❌ Error in generateWithStabilityInpainting:", error);
    throw error;
  }
}

interface InpaintRequestBody extends Omit<InpaintRequest, 'imagePath' | 'maskPath'> {
  baseImage: string; // Path to base image
  maskImage?: string; // Optional explicit mask path
  couponCode: string;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0].trim() || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before making another request.", success: false },
        { status: 429 }
      );
    }

    const body: InpaintRequestBody = await request.json();
    const {
      baseImage,
      maskImage,
      prompt,
      method = HD_PAINTER_CONFIG.defaults.method,
      resolution = HD_PAINTER_CONFIG.defaults.resolution,
      strength,
      guidance,
      steps,
      noCache = false,
      couponCode,
    } = body;

    console.log(`🎨 HD-Painter Inpainting Request: ${baseImage} with method ${method}`);

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

    // Trouver la configuration d'inpainting
    const inpaintConfig = INPAINT_IMAGES.find(img => img.path === baseImage);
    if (!inpaintConfig) {
      return NextResponse.json(
        { error: "Image configuration not found for HD-Painter inpainting", success: false },
        { status: 400 }
      );
    }

    // Utiliser le masque spécifié ou celui de la configuration
    const finalMaskPath = maskImage || inpaintConfig.maskPath;
    
    // Générer la clé de cache pour l'inpainting
    const cacheKey = generateInpaintCacheKey(baseImage, finalMaskPath, prompt, method);

    // Vérifier le cache sauf si noCache est activé
    if (!noCache) {
      const cachedImage = await checkImageExists(cacheKey);
      if (cachedImage) {
        console.log(`✅ Cache HIT - HD-Painter image served from cache: ${cacheKey}`);
        return NextResponse.json({
          imageUrl: cachedImage,
          cost: 0,
          cached: true,
          method,
          couponCode,
        });
      }
      console.log(`🔍 Cache MISS - Proceeding with HD-Painter generation: ${cacheKey}`);
    }

    // Charger l'image de base et le masque
    const baseImageBuffer = await getImageAsBuffer(baseImage);
    const maskImageBuffer = await getImageAsBuffer(finalMaskPath);
    
    console.log(`📸 Base image loaded: ${baseImageBuffer.length} bytes`);
    console.log(`🎭 Mask loaded: ${maskImageBuffer.length} bytes`);

    // Redimensionner les images selon la résolution HD-Painter
    const resizedBaseImage = await resizeImageForInpainting(baseImageBuffer, resolution);
    const resizedMaskImage = await resizeImageForInpainting(maskImageBuffer, resolution, "mask");

    // Vérification et ajout de l'exigence obligatoire "happy people"
    const enhancedPrompt = prompt.toLowerCase().includes("happy") && prompt.toLowerCase().includes("people")
      ? prompt
      : `${prompt}, happy people`;

    console.log(`📝 Enhanced prompt: ${enhancedPrompt}`);

    // Génération avec HD-Painter
    const tempImageUrl = await generateWithStabilityInpainting(
      resizedBaseImage,
      resizedMaskImage,
      enhancedPrompt,
      method
    );

    console.log(`🎨 HD-Painter image generated successfully with method: ${method}`);

    // Upload vers Google Cloud Storage
    let finalImageUrl = tempImageUrl;
    try {
      const base64Data = tempImageUrl.replace(/^data:image\/[a-z]+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");
      const storageResult = await uploadImageToGCS(imageBuffer, cacheKey);

      if (storageResult.success && storageResult.url) {
        finalImageUrl = storageResult.url;
        console.log(`☁️ HD-Painter image uploaded to GCS: ${cacheKey}`);
      }
    } catch (error) {
      console.error("❌ GCS Upload Error:", error);
    }

    const generationTime = Date.now() - startTime;
    const cost = STABILITY_CONFIG.PRICING.per_generation * 1.5; // Coût majoré pour l'inpainting HD

    return NextResponse.json({
      success: true,
      imageUrl: finalImageUrl,
      generationTime,
      cost,
      cached: false,
      method,
      resolution,
      maskPath: finalMaskPath,
      couponCode,
    } as GenerationResponse & { method: HDPainterMethod; resolution: string; maskPath: string });

  } catch (error) {
    console.error("HD-Painter API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        generationTime: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "HD-Painter Inpainting API with Stability AI",
    availableImages: INPAINT_IMAGES.map(img => ({
      path: img.path,
      maskPath: img.maskPath,
      recommendedMethod: img.hdPainterMethod,
      resolution: img.resolution,
      type: img.type,
    })),
    hdPainterMethods: Object.keys(HD_PAINTER_CONFIG.methods),
    methodDescriptions: HD_PAINTER_CONFIG.methods,
    pricing: {
      ...STABILITY_CONFIG.PRICING,
      inpainting_multiplier: 1.5,
    },
    rateLimit: RATE_LIMIT,
  });
}
