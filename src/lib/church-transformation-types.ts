import { TransformationType, SocialMediaAccount } from "@/lib/types";
import { InpaintImage, HDPainterMethod } from "@/lib/inpaint-config";
import { CouponData, CouponValidationResult } from "@/lib/coupon-system";

export interface FamousLocation {
  id: string;
  name: string;
  location: string;
  description: string;
  architecturalStyle: string;
  keyFeatures: string[];
  promptEnhancement: string;
  imageUrl: string;
}

export interface GenerationState {
  isGenerating: boolean;
  selectedTransformation: TransformationType | null;
  selectedLocation: FamousLocation | null;
  generatedImage: string | null;
  originalImage: string;
  generationTime: number | null;
  cost: number | null;
  customPrompt: string;
  forceNewGeneration: boolean;
  couponCode: string;
  activeCoupon: CouponData | null;
  couponValidation: CouponValidationResult | null;
  selectedInpaintImage: InpaintImage | null;
  hdPainterMethod: HDPainterMethod;
  showMaskPreview: boolean;
  showShareModal: boolean;
  negativePrompt: string;
  showNegativePromptPresets: boolean;
  activeNegativePresets: Set<string>;
  isNegativePromptCollapsed: boolean;
}