// Configuration des coupons
const COUPON_CONFIG = {
  totalGenerations: 5,
  expirationDays: 30, // Expire après 30 jours
  codeLength: 12
};

/**
 * Génère un code de coupon unique
 */
export function generateCouponCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < COUPON_CONFIG.codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
    
    // Ajouter des tirets pour la lisibilité (XXXX-XXXX-XXXX)
    if (i === 3 || i === 7) {
      result += '-';
    }
  }
  
  return result;
}

/**
 * Crée un nouveau coupon pour un signataire
 */
export function createCoupon(email: string): CouponData {
  const now = new Date();
  const expirationDate = new Date(now);
  expirationDate.setDate(now.getDate() + COUPON_CONFIG.expirationDays);
  
  return {
    id: generateCouponCode(),
    email: email.toLowerCase().trim(),
    generationsRemaining: COUPON_CONFIG.totalGenerations,
    totalGenerations: COUPON_CONFIG.totalGenerations,
    createdAt: now.toISOString(),
    expiresAt: expirationDate.toISOString(),
    used: false
  };
}

/**
 * Valide et utilise un coupon (côté client - localStorage)
 */
export function validateAndUseCoupon(couponCode: string): CouponValidationResult {
  if (!couponCode || couponCode.length < 10) {
    return {
      valid: false,
      message: 'Code de coupon invalide'
    };
  }

  try {
    // Récupérer les coupons depuis localStorage
    const storedCoupons = localStorage.getItem('ai-generation-coupons');
    const coupons: CouponData[] = storedCoupons ? JSON.parse(storedCoupons) : [];
    
    // Chercher le coupon correspondant
    const couponIndex = coupons.findIndex(c => c.id === couponCode.toUpperCase());
    
    if (couponIndex === -1) {
      return {
        valid: false,
        message: 'Code de coupon non trouvé'
      };
    }
    
    const coupon = coupons[couponIndex];
    
    // Vérifier l'expiration
    if (new Date() > new Date(coupon.expiresAt)) {
      return {
        valid: false,
        message: 'Ce coupon a expiré'
      };
    }
    
    // Vérifier s'il reste des générations
    if (coupon.generationsRemaining <= 0) {
      return {
        valid: false,
        message: 'Ce coupon a épuisé toutes ses générations'
      };
    }
    
    return {
      valid: true,
      coupon,
      message: `Coupon valide! ${coupon.generationsRemaining} générations restantes`
    };
    
  } catch (error) {
    console.error('Erreur validation coupon:', error);
    return {
      valid: false,
      message: 'Erreur lors de la validation du coupon'
    };
  }
}

/**
 * Utilise une génération d'un coupon
 */
export function useCouponGeneration(couponCode: string): CouponData | null {
  try {
    const storedCoupons = localStorage.getItem('ai-generation-coupons');
    const coupons: CouponData[] = storedCoupons ? JSON.parse(storedCoupons) : [];
    
    const couponIndex = coupons.findIndex(c => c.id === couponCode.toUpperCase());
    
    if (couponIndex === -1) return null;
    
    const coupon = coupons[couponIndex];
    
    if (coupon.generationsRemaining <= 0) return null;
    
    // Décrémenter les générations restantes
    coupon.generationsRemaining--;
    coupon.used = true;
    
    // Sauvegarder dans localStorage
    localStorage.setItem('ai-generation-coupons', JSON.stringify(coupons));
    
    return coupon; // Retourner le coupon mis à jour
  } catch (error) {
    console.error('Erreur utilisation coupon:', error);
    return null;
  }
}

/**
 * Ajoute un coupon au localStorage
 */
export function storeCoupon(coupon: CouponData): void {
  try {
    const storedCoupons = localStorage.getItem('ai-generation-coupons');
    const coupons: CouponData[] = storedCoupons ? JSON.parse(storedCoupons) : [];
    
    // Vérifier si le coupon existe déjà
    const existingIndex = coupons.findIndex(c => c.id === coupon.id);
    
    if (existingIndex !== -1) {
      // Mettre à jour le coupon existant
      coupons[existingIndex] = coupon;
    } else {
      // Ajouter le nouveau coupon
      coupons.push(coupon);
    }
    
    localStorage.setItem('ai-generation-coupons', JSON.stringify(coupons));
  } catch (error) {
    console.error('Erreur stockage coupon:', error);
  }
}

/**
 * Récupère tous les coupons de l'utilisateur
 */
export function getUserCoupons(): CouponData[] {
  try {
    const storedCoupons = localStorage.getItem('ai-generation-coupons');
    return storedCoupons ? JSON.parse(storedCoupons) : [];
  } catch (error) {
    console.error('Erreur récupération coupons:', error);
    return [];
  }
}

/**
 * Récupère le coupon actif (avec générations restantes)
 */
export function getActiveCoupon(): CouponData | null {
  const coupons = getUserCoupons();
  const now = new Date();
  
  return coupons.find(coupon => 
    coupon.generationsRemaining > 0 && 
    new Date(coupon.expiresAt) > now
  ) || null;
}

export interface CouponData {
  id: string;
  email: string;
  generationsRemaining: number;
  totalGenerations: number;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: CouponData;
  message: string;
}
