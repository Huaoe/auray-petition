"use client";

// Importer le modèle client au lieu de la version serveur
import { getToxicityClassifier, extractKeywords } from './sentiment-model-client';

// Configuration du système de coupons
export const COUPON_CONFIG = {
  levels: {
    BASIC: {
      minScore: 0,
      generations: 2,
      color: 'bg-gradient-to-r from-emerald-500 to-green-500',
      label: 'Basique'
    },
    ENGAGED: {
      minScore: 5,
      generations: 2,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      label: 'Engagé'
    },
    PASSIONATE: {
      minScore: 15,
      generations: 3,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      label: 'Passionné'
    },
    CHAMPION: {
      minScore: 25,
      generations: 4,
      color: 'bg-gradient-to-r from-amber-500 to-yellow-400',
      label: 'Champion'
    }
  },
  scoring: {
    base: 1,
    commentLength: {
      short: 1, // 1-50 caractères
      medium: 2, // 51-150 caractères
      long: 3 // 151+ caractères
    },
    sentimentBonus: {
      positive: 3,
      neutral: 0,
      negative: -1
    },
    newsletter: 2,
    socialShare: 2,
    referral: 2
  },
  referral: {
    referrerBonus: 1, // +1 génération pour le parrain
    refereeBonus: 1, // +1 génération pour le filleul
    codeLength: 6, // Longueur des codes de parrainage
    validityDays: 90 // Validité des codes de parrainage en jours
  },
  // Durée de validité des coupons en millisecondes (30 jours)
  validityDuration: 30 * 24 * 60 * 60 * 1000
};

// Types
export type CouponLevel = 'BASIC' | 'ENGAGED' | 'PASSIONATE' | 'CHAMPION';

export interface SignatureData {
  name: string;
  email: string;
  city?: string;
  postalCode?: string;
  comment?: string;
  newsletter?: boolean;
  socialShares?: string[];
  referralCode?: string;
}

export interface EngagementDetails {
  details: SignatureData;
  score: number;
  level: CouponLevel;
  sentimentAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
    confidence: number;
    keywords: string[];
  };
}

export interface CouponData {
  code: string;
  level: CouponLevel;
  generationsLeft: number;
  totalGenerations: number;
  email: string;
  createdAt: number;
  expiresAt: number;
  engagement: EngagementDetails;
}

export interface ValidationResult {
  valid: boolean;
  coupon?: CouponData;
  error?: string;
  message?: string;
}

// Constantes de stockage
const COUPONS_STORAGE_KEY = 'petition_coupons';
const REFERRALS_STORAGE_KEY = 'petition_referrals';

/**
 * Fonction utilitaire pour générer un code aléatoire
 * Version compatible navigateur avec Math.random()
 */
export function generateRandomCode(length: number = 8): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

/**
 * Charge les coupons du stockage local
 * Compatible navigateur
 */
export function loadCoupons(): CouponData[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const storedCoupons = localStorage.getItem(COUPONS_STORAGE_KEY);
  return storedCoupons ? JSON.parse(storedCoupons) : [];
}

/**
 * Sauvegarde les coupons dans le stockage local
 * Compatible navigateur
 */
export function saveCoupons(coupons: CouponData[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
}

/**
 * Analyse le sentiment d'un commentaire avec DistilBERT multilingue
 * Version client qui utilise notre modèle mock
 */
export async function analyzeSentimentAI(comment: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  confidence: number;
  keywords: string[];
}> {
  if (!comment || !comment.trim()) {
    return { sentiment: 'neutral', score: 0, confidence: 0, keywords: [] };
  }
  
  try {
    // Initialiser et utiliser le classificateur de toxicité (client version)
    const toxicityClassifier = getToxicityClassifier();
    await toxicityClassifier.load();
    
    // Prédiction de toxicité
    const predictions = await toxicityClassifier.classify(comment);
    
    // Extraction des résultats
    const toxicScore = predictions.toxic || 0;
    
    // Interprétation inverse: moins toxique = plus positif
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let confidence = 0;
    
    if (toxicScore < 0.2) {
      sentiment = 'positive';
      confidence = 1 - toxicScore;
    } else if (toxicScore > 0.6) {
      sentiment = 'negative';
      confidence = toxicScore;
    } else {
      sentiment = 'neutral';
      confidence = 1 - Math.abs((toxicScore - 0.4) * 2);
    }
    
    // Calculer le score pour le système de coupons
    const bonusScoreBase = COUPON_CONFIG.scoring.sentimentBonus[sentiment];
    const sentimentMultiplier: Record<string, number> = {
      positive: confidence >= 0.7 ? 1 : 0.8,
      neutral: 0.5,
      negative: 0.2
    };
    const bonusScore = Math.round(bonusScoreBase * sentimentMultiplier[sentiment]);
    
    // DistilBERT ne fournit pas directement de keywords, utiliser notre extracteur
    const keywords = extractKeywords(comment);
    
    return {
      sentiment,
      score: bonusScore,
      confidence,
      keywords
    };
  } catch (error) {
    console.error('Erreur lors de l\'analyse avec DistilBERT:', error);
    return analyzeSentimentRules(comment);
  }
}

/**
 * Analyse le sentiment d'un commentaire et retourne un score bonus
 * Version par règles (fallback si l'IA n'est pas disponible)
 */
export function analyzeSentimentRules(comment: string): {
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
    'soutien', 'soutiens', 'approuve', 'approuvons', 'excellent', 'parfait',
    'formidable', 'génial', 'fantastique', 'merveilleux', 'magnifique',
    'bravo', 'félicitations', 'courage', 'continue', 'continuez',
    'super', 'top', 'extraordinaire', 'sublime', 'brillant'
  ];
  
  // Mots-clés négatifs
  const negativeKeywords = [
    'horrible', 'terrible', 'mauvais', 'nul', 'déteste', 'détestons',
    'pire', 'affreux', 'catastrophe', 'catastrophique', 'médiocre',
    'insuffisant', 'décevant', 'décevante', 'déçu', 'déçue'
  ];
  
  // Négations qui inversent la polarité
  const negations = [
    'ne', 'pas', 'plus', 'jamais', 'aucun', 'aucune', 'sans', 'ni'
  ];
  
  // Fonction pour détecter si un mot est précédé d'une négation dans une fenêtre de 3 mots
  function isNegationPresent(position: number, words: string[]): boolean {
    if (position === 0) return false;
    
    // Vérifier jusqu'à 3 mots avant
    const startIdx = Math.max(0, position - 3);
    for (let i = startIdx; i < position; i++) {
      if (negations.includes(words[i])) {
        return true;
      }
    }
    
    return false;
  }
  
  // Compter occurrences
  const words = text.split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  // Analyser chaque mot par rapport aux listes
  words.forEach((word, index) => {
    const isNegated = isNegationPresent(index, words);
    
    if (positiveKeywords.includes(word)) {
      positiveCount += isNegated ? -1 : 1;
    } else if (negativeKeywords.includes(word)) {
      negativeCount += isNegated ? -1 : 1;
    }
  });
  
  // Déterminer le sentiment global
  let sentiment: 'positive' | 'neutral' | 'negative';
  let sentimentScore: number;
  let confidence: number;
  
  const totalKeywords = positiveCount + negativeCount;
  const sentimentDiff = positiveCount - negativeCount;
  
  if (totalKeywords === 0) {
    sentiment = 'neutral';
    sentimentScore = 0;
    confidence = 0.5;
  } else if (sentimentDiff > 0) {
    sentiment = 'positive';
    sentimentScore = COUPON_CONFIG.scoring.sentimentBonus.positive;
    confidence = Math.min(sentimentDiff / totalKeywords, 1);
  } else if (sentimentDiff < 0) {
    sentiment = 'negative';
    sentimentScore = COUPON_CONFIG.scoring.sentimentBonus.negative;
    confidence = Math.min(Math.abs(sentimentDiff) / totalKeywords, 1);
  } else {
    sentiment = 'neutral';
    sentimentScore = COUPON_CONFIG.scoring.sentimentBonus.neutral;
    confidence = 0.5;
  }
  
  // Extraire mots-clés
  const extractedKeywords = extractKeywords(comment);
  
  return {
    sentiment,
    score: sentimentScore,
    confidence,
    keywords: extractedKeywords
  };

}

/**
 * Analyse le sentiment d'un commentaire (wrapper)
 * Utilise DistilBERT en priorité, puis fallback sur la méthode par règles
 */
export async function analyzeSentiment(comment: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  confidence: number;
  keywords: string[];
}> {
  try {
    // Essayer d'abord l'analyse IA
    return await analyzeSentimentAI(comment);
  } catch (error) {
    console.warn('Fallback sur analyse par règles:', error);
    // Fallback sur l'analyse par règles
    return analyzeSentimentRules(comment);
  }
}

/**
 * Calcule le score d'engagement à partir des données de signature
 * Version asynchrone qui attend l'analyse de sentiment
 */
export async function calculateEngagement(data: SignatureData): Promise<EngagementDetails> {
  let score = COUPON_CONFIG.scoring.base;
  
  // Bonus pour commentaire
  if (data.comment) {
    const commentLength = data.comment.length;
    
    // Bonus par longueur
    if (commentLength > 0 && commentLength <= 50) {
      score += COUPON_CONFIG.scoring.commentLength.short;
    } else if (commentLength > 50 && commentLength <= 150) {
      score += COUPON_CONFIG.scoring.commentLength.medium;
    } else if (commentLength > 150) {
      score += COUPON_CONFIG.scoring.commentLength.long;
    }
    
    // Bonus pour sentiment positif
    const sentimentAnalysis = await analyzeSentiment(data.comment);
    score += sentimentAnalysis.score;
  }
  
  // Bonus pour inscription newsletter
  if (data.newsletter) {
    score += COUPON_CONFIG.scoring.newsletter;
  }
  
  // Bonus pour partages sociaux
  if (data.socialShares && data.socialShares.length > 0) {
    score += COUPON_CONFIG.scoring.socialShare;
  }
  
  // Bonus pour utilisation d'un code de parrainage
  if (data.referralCode) {
    score += COUPON_CONFIG.scoring.referral;
  }
  
  // Déterminer le niveau d'engagement
  const level = determineCouponLevel(score);
  
  return {
    details: data,
    score,
    level
  };
}

/**
 * Détermine le niveau de coupon en fonction du score
 */
export function determineCouponLevel(score: number): CouponLevel {
  if (score >= COUPON_CONFIG.levels.CHAMPION.minScore) {
    return 'CHAMPION';
  } else if (score >= COUPON_CONFIG.levels.PASSIONATE.minScore) {
    return 'PASSIONATE';
  } else if (score >= COUPON_CONFIG.levels.ENGAGED.minScore) {
    return 'ENGAGED';
  } else {
    return 'BASIC';
  }
}

/**
 * Crée un coupon basé sur les données d'engagement
 */
export function createCoupon(engagement: EngagementDetails): CouponData {
  const level = engagement.level;
  const levelConfig = COUPON_CONFIG.levels[level];
  
  // Valeurs par défaut si la configuration est manquante
  const generations = levelConfig?.generations || 2;
  
  const coupon: CouponData = {
    code: generateRandomCode(12),
    level,
    generationsLeft: generations,
    totalGenerations: generations,
    email: engagement.details.email,
    createdAt: Date.now(),
    expiresAt: Date.now() + COUPON_CONFIG.validityDuration,
    engagement
  };
  
  // Sauvegarder le coupon
  const coupons = loadCoupons();
  coupons.push(coupon);
  saveCoupons(coupons);
  
  return coupon;
}

/**
 * Valide un coupon et retourne le résultat
 */
export function validateCoupon(code: string): ValidationResult {
  const coupons = loadCoupons();
  const coupon = coupons.find(c => c.code === code);
  
  if (!coupon) {
    return {
      valid: false,
      error: 'invalid_code',
      message: 'Code de coupon invalide'
    };
  }
  
  if (coupon.expiresAt < Date.now()) {
    return {
      valid: false,
      coupon,
      error: 'expired',
      message: 'Ce coupon a expiré'
    };
  }
  
  if (coupon.generationsLeft <= 0) {
    return {
      valid: false,
      coupon,
      error: 'no_generations',
      message: 'Ce coupon n\'a plus de générations disponibles'
    };
  }
  
  return {
    valid: true,
    coupon,
    message: `Coupon valide: ${coupon.generationsLeft} génération(s) restante(s)`
  };
}

/**
 * Utilise une génération d'un coupon
 */
export function useGeneration(code: string): ValidationResult {
  const validation = validateCoupon(code);
  
  if (!validation.valid || !validation.coupon) {
    return validation;
  }
  
  const coupons = loadCoupons();
  const couponIndex = coupons.findIndex(c => c.code === code);
  
  if (couponIndex === -1) {
    return {
      valid: false,
      error: 'not_found',
      message: 'Coupon introuvable'
    };
  }
  
  // Décrémenter la génération
  coupons[couponIndex].generationsLeft -= 1;
  validation.coupon.generationsLeft -= 1;
  
  saveCoupons(coupons);
  
  return {
    valid: true,
    coupon: validation.coupon,
    message: `Génération utilisée: ${validation.coupon.generationsLeft} restante(s)`
  };
}

/**
 * Génère un code de parrainage pour un email
 */
export function generateReferralCode(email: string): string {
  const baseCode = email.substring(0, 3).toUpperCase() + generateRandomCode(COUPON_CONFIG.referral.codeLength - 3);
  return baseCode;
}

/**
 * Enregistre un parrainage
 */
export function recordReferral(referralCode: string, refereeEmail: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Récupérer l'email du parrain
  const coupons = loadCoupons();
  const referrerCoupon = coupons.find(c => c.code.includes(referralCode));
  
  if (!referrerCoupon) {
    return false;
  }
  
  const referrerEmail = referrerCoupon.email;
  
  // Récupérer les parrainages existants
  const storedReferralsStr = localStorage.getItem(REFERRALS_STORAGE_KEY);
  const storedReferrals = storedReferralsStr ? JSON.parse(storedReferralsStr) : [];
  
  // Ajouter le nouveau parrainage
  const newReferral = {
    code: referralCode,
    email: refereeEmail,
    referrerEmail,
    createdAt: Date.now(),
    used: true,
    usedAt: Date.now(),
    bonusAwarded: false
  };
  
  storedReferrals.push(newReferral);
  localStorage.setItem(REFERRALS_STORAGE_KEY, JSON.stringify(storedReferrals));
  
  return true;
}

/**
 * Compte les bonus de parrainage pour un email
 */
export function countReferralBonuses(email: string): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  
  const storedReferralsStr = localStorage.getItem(REFERRALS_STORAGE_KEY);
  if (!storedReferralsStr) {
    return 0;
  }
  
  const referrals = JSON.parse(storedReferralsStr);
  const successfulReferrals = referrals.filter(r => r.referrerEmail === email && r.used);
  
  return successfulReferrals.length * COUPON_CONFIG.referral.referrerBonus;
}
