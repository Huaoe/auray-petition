// Types pour le système d'engagement
export type EngagementLevel = 'BASIC' | 'ENGAGED' | 'PASSIONATE' | 'CHAMPION';

export interface SignatureEngagementData {
  comment?: string;
  newsletterConsent?: boolean;
  socialShares?: number;
  referrals?: number;
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

export interface EnhancedCouponData extends CouponData {
  engagementScore: number;
  engagementLevel: EngagementLevel;
  levelName: string;
  levelBadge: string;
  levelColor: string;
  signatureData: SignatureEngagementData;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: CouponData | EnhancedCouponData;
  message: string;
}

// Configuration des coupons avancée
const COUPON_CONFIG = {
  // Configuration de base
  expirationDays: 30, // Expire après 30 jours
  codeLength: 12,
  
  // Système de niveaux d'engagement
  engagementLevels: {
    BASIC: {
      name: 'Supporter',
      minScore: 0,
      maxScore: 49,
      generations: 2,
      color: '#6B7280', // gray-500
      badge: '🌱'
    },
    ENGAGED: {
      name: 'Engagé',
      minScore: 50,
      maxScore: 99,
      generations: 3,
      color: '#3B82F6', // blue-500
      badge: '⭐'
    },
    PASSIONATE: {
      name: 'Passionné',
      minScore: 100,
      maxScore: 199,
      generations: 4,
      color: '#8B5CF6', // violet-500
      badge: '🔥'
    },
    CHAMPION: {
      name: 'Champion',
      minScore: 200,
      maxScore: Infinity,
      generations: 5,
      color: '#F59E0B', // amber-500
      badge: '👑'
    }
  },
  
  // Système de scoring d'engagement
  scoring: {
    baseSignature: 10,
    commentLength: {
      short: 5,    // < 50 chars
      medium: 15,  // 50-150 chars
      long: 25     // > 150 chars
    },
    newsletter: 10,
    socialShare: 20,
    referral: 30,
    // Bonus d'analyse de sentiment IA
    sentimentBonus: {
      positive: 15,    // Commentaire très positif
      neutral: 5,      // Commentaire neutre/constructif
      negative: 0      // Commentaire négatif (pas de bonus)
    }
  }
};

/**
 * Analyse le sentiment d'un commentaire et retourne un score bonus
 * Utilise une approche basée sur des mots-clés et patterns pour déterminer la positivité
 */
export function analyzeSentiment(comment: string): {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  confidence: number;
  keywords: string[];
} {
  if (!comment || !comment.trim()) {
    return {
      sentiment: 'neutral',
      score: 0,
      confidence: 0,
      keywords: []
    };
  }

  const text = comment.toLowerCase().trim();
  
  // Mots-clés positifs spécifiques au contexte de la pétition
  const positiveKeywords = [
    // Support et encouragement
    'soutien', 'soutiens', 'approuve', 'approuvons', 'excellent', 'parfait',
    'formidable', 'génial', 'fantastique', 'merveilleux', 'magnifique',
    'bravo', 'félicitations', 'courage', 'continue', 'continuez',
    
    // Qualité de vie et bien-être
    'qualité de vie', 'bien-être', 'tranquille', 'paisible', 'serein',
    'repos', 'sommeil', 'détente', 'calme', 'silence', 'paix',
    
    // Engagement et action
    'important', 'essentiel', 'nécessaire', 'urgent', 'priorité',
    'constructif', 'dialogue', 'solution', 'amélioration', 'progrès',
    'changement positif', 'avancer', 'ensemble', 'unité',
    
    // Communauté et solidarité
    'communauté', 'voisins', 'habitants', 'citoyens', 'solidarité',
    'partage', 'partager', 'diffuser', 'recommande', 'inviter',
    
    // Respect et équilibre
    'respect', 'respectueux', 'équilibre', 'équilibré', 'juste',
    'raisonnable', 'modéré', 'adapté', 'approprié', 'harmonieux'
  ];
  
  // Mots-clés négatifs
  const negativeKeywords = [
    'contre', 'opposé', 'refuse', 'rejette', 'désaccord', 'pas d\'accord',
    'stupide', 'idiot', 'ridicule', 'inutile', 'n\'importe quoi',
    'perte de temps', 'absurde', 'scandaleux', 'honteux', 'inadmissible',
    'colère', 'furieux', 'énervé', 'agacé', 'irrité',
    'jamais', 'impossible', 'irréaliste', 'utopique'
  ];
  
  // Patterns positifs (expressions)
  const positivePatterns = [
    /je soutiens? (totalement|complètement|entièrement)/,
    /c'est (très|vraiment|absolument) (important|essentiel|nécessaire)/,
    /excellente? (initiative|idée|démarche)/,
    /je recommande? (vivement|fortement)/,
    /il faut (absolument|vraiment|impérativement)/,
    /j'espère (que|vraiment)/,
    /merci (beaucoup|infiniment) pour/,
    /félicitations? pour/
  ];
  
  // Patterns négatifs
  const negativePatterns = [
    /je suis (contre|opposé)/,
    /c'est (ridicule|stupide|inutile)/,
    /n'importe quoi/,
    /perte de temps/,
    /jamais (d'accord|acceptable)/
  ];
  
  let positiveScore = 0;
  let negativeScore = 0;
  const foundKeywords: string[] = [];
  
  // Analyse des mots-clés positifs
  positiveKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      positiveScore += 1;
      foundKeywords.push(keyword);
    }
  });
  
  // Analyse des mots-clés négatifs
  negativeKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      negativeScore += 1;
      foundKeywords.push(`-${keyword}`);
    }
  });
  
  // Analyse des patterns positifs
  positivePatterns.forEach(pattern => {
    if (pattern.test(text)) {
      positiveScore += 2; // Les patterns ont plus de poids
    }
  });
  
  // Analyse des patterns négatifs
  negativePatterns.forEach(pattern => {
    if (pattern.test(text)) {
      negativeScore += 2;
    }
  });
  
  // Bonus pour la longueur et la structure (commentaires détaillés)
  if (text.length > 100) {
    positiveScore += 0.5;
  }
  
  // Bonus pour les signes de ponctuation positifs
  if (text.includes('!') && !text.includes('?!')) {
    positiveScore += 0.5;
  }
  
  // Détermination du sentiment
  const netScore = positiveScore - negativeScore;
  let sentiment: 'positive' | 'neutral' | 'negative';
  let confidence: number;
  
  if (netScore > 1.5) {
    sentiment = 'positive';
    confidence = Math.min(netScore / 3, 1);
  } else if (netScore < -1) {
    sentiment = 'negative';
    confidence = Math.min(Math.abs(netScore) / 3, 1);
  } else {
    sentiment = 'neutral';
    confidence = 0.5;
  }
  
  const bonusScore = COUPON_CONFIG.scoring.sentimentBonus[sentiment];
  
  return {
    sentiment,
    score: bonusScore,
    confidence,
    keywords: foundKeywords
  };
}

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
 * Calcule le score d'engagement d'un signataire avec analyse de sentiment IA
 */
export function calculateEngagementScore(signatureData: {
  comment?: string;
  newsletterConsent?: boolean;
  socialShares?: number;
  referrals?: number;
}): {
  totalScore: number;
  breakdown: {
    base: number;
    comment: number;
    sentiment: number;
    newsletter: number;
    socialShares: number;
    referrals: number;
  };
  sentimentAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    keywords: string[];
  };
} {
  let score = COUPON_CONFIG.scoring.baseSignature;
  const breakdown = {
    base: COUPON_CONFIG.scoring.baseSignature,
    comment: 0,
    sentiment: 0,
    newsletter: 0,
    socialShares: 0,
    referrals: 0
  };
  
  let sentimentAnalysis: {
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    keywords: string[];
  } | undefined;
  
  // Score pour commentaire (longueur + sentiment)
  if (signatureData.comment && signatureData.comment.trim().length > 0) {
    const commentLength = signatureData.comment.trim().length;
    let commentScore = 0;
    
    // Score basé sur la longueur
    if (commentLength < 50) {
      commentScore = COUPON_CONFIG.scoring.commentLength.short;
    } else if (commentLength <= 150) {
      commentScore = COUPON_CONFIG.scoring.commentLength.medium;
    } else {
      commentScore = COUPON_CONFIG.scoring.commentLength.long;
    }
    
    breakdown.comment = commentScore;
    score += commentScore;
    
    // Analyse de sentiment IA
    const sentiment = analyzeSentiment(signatureData.comment);
    sentimentAnalysis = {
      sentiment: sentiment.sentiment,
      confidence: sentiment.confidence,
      keywords: sentiment.keywords
    };
    
    breakdown.sentiment = sentiment.score;
    score += sentiment.score;
    
    // Log en mode développement
    if (process.env.NODE_ENV === 'development') {
      console.log('🧠 Analyse de sentiment:', {
        commentaire: signatureData.comment.substring(0, 100) + '...',
        sentiment: sentiment.sentiment,
        confidence: Math.round(sentiment.confidence * 100) + '%',
        bonusScore: sentiment.score,
        keywords: sentiment.keywords
      });
    }
  }
  
  // Score pour newsletter
  if (signatureData.newsletterConsent) {
    breakdown.newsletter = COUPON_CONFIG.scoring.newsletter;
    score += COUPON_CONFIG.scoring.newsletter;
  }
  
  // Score pour partages sociaux
  if (signatureData.socialShares) {
    breakdown.socialShares = signatureData.socialShares * COUPON_CONFIG.scoring.socialShare;
    score += breakdown.socialShares;
  }
  
  // Score pour parrainages
  if (signatureData.referrals) {
    breakdown.referrals = signatureData.referrals * COUPON_CONFIG.scoring.referral;
    score += breakdown.referrals;
  }
  
  return {
    totalScore: score,
    breakdown,
    sentimentAnalysis
  };
}

/**
 * Détermine le niveau d'engagement basé sur le score
 */
export function getEngagementLevel(score: number): EngagementLevel {
  const levels = COUPON_CONFIG.engagementLevels;
  
  if (score >= levels.CHAMPION.minScore) return 'CHAMPION';
  if (score >= levels.PASSIONATE.minScore) return 'PASSIONATE';
  if (score >= levels.ENGAGED.minScore) return 'ENGAGED';
  return 'BASIC';
}

/**
 * Obtient les détails d'un niveau d'engagement
 */
export function getEngagementLevelDetails(level: EngagementLevel) {
  return COUPON_CONFIG.engagementLevels[level];
}

/**
 * Crée un nouveau coupon intelligent basé sur l'engagement avec analyse de sentiment IA
 */
export function createSmartCoupon(email: string, signatureData: {
  comment?: string;
  newsletterConsent?: boolean;
  socialShares?: number;
  referrals?: number;
}): EnhancedCouponData {
  const now = new Date();
  const expirationDate = new Date(now);
  expirationDate.setDate(now.getDate() + COUPON_CONFIG.expirationDays);
  
  const engagementResult = calculateEngagementScore(signatureData);
  const engagementLevel = getEngagementLevel(engagementResult.totalScore);
  const levelDetails = getEngagementLevelDetails(engagementLevel);
  
  return {
    id: generateCouponCode(),
    email: email.toLowerCase().trim(),
    generationsRemaining: levelDetails.generations,
    totalGenerations: levelDetails.generations,
    createdAt: now.toISOString(),
    expiresAt: expirationDate.toISOString(),
    used: false,
    // Nouvelles propriétés d'engagement avec analyse de sentiment
    engagementScore: engagementResult.totalScore,
    engagementLevel,
    levelName: levelDetails.name,
    levelBadge: levelDetails.badge,
    levelColor: levelDetails.color,
    signatureData,
    // Nouvelles propriétés d'analyse de sentiment
    scoreBreakdown: engagementResult.breakdown,
    sentimentAnalysis: engagementResult.sentimentAnalysis
  };
}

/**
 * Crée un nouveau coupon pour un signataire (version legacy)
 */
export function createCoupon(email: string): CouponData {
  const now = new Date();
  const expirationDate = new Date(now);
  expirationDate.setDate(now.getDate() + COUPON_CONFIG.expirationDays);
  
  return {
    id: generateCouponCode(),
    email: email.toLowerCase().trim(),
    generationsRemaining: 2, // Niveau BASIC par défaut
    totalGenerations: 2,
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
 * Ajoute un coupon au localStorage (support coupons avancés)
 */
export function storeCoupon(coupon: CouponData | EnhancedCouponData): void {
  try {
    const storedCoupons = localStorage.getItem('ai-generation-coupons');
    const coupons: (CouponData | EnhancedCouponData)[] = storedCoupons ? JSON.parse(storedCoupons) : [];
    
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
 * Stocke un coupon avancé avec données d'engagement
 */
export function storeEnhancedCoupon(coupon: EnhancedCouponData): void {
  storeCoupon(coupon);
}

/**
 * Récupère tous les coupons de l'utilisateur (support coupons avancés)
 */
export function getUserCoupons(): (CouponData | EnhancedCouponData)[] {
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
export function getActiveCoupon(): CouponData | EnhancedCouponData | null {
  const coupons = getUserCoupons();
  const now = new Date();
  
  return coupons.find(coupon => 
    coupon.generationsRemaining > 0 && 
    new Date(coupon.expiresAt) > now
  ) || null;
}

/**
 * Vérifie si un coupon est avancé (avec données d'engagement)
 */
export function isEnhancedCoupon(coupon: CouponData | EnhancedCouponData): coupon is EnhancedCouponData {
  return 'engagementScore' in coupon;
}

/**
 * Récupère les statistiques d'engagement d'un utilisateur
 */
export function getUserEngagementStats(): {
  totalScore: number;
  level: EngagementLevel;
  levelDetails: any;
  couponsCount: number;
  totalGenerations: number;
} {
  const coupons = getUserCoupons();
  const enhancedCoupons = coupons.filter(isEnhancedCoupon);
  
  const totalScore = enhancedCoupons.reduce((sum, coupon) => sum + coupon.engagementScore, 0);
  const level = getEngagementLevel(totalScore);
  const levelDetails = getEngagementLevelDetails(level);
  
  return {
    totalScore,
    level,
    levelDetails,
    couponsCount: coupons.length,
    totalGenerations: coupons.reduce((sum, coupon) => sum + coupon.totalGenerations, 0)
  };
}
