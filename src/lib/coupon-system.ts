import { getToxicityClassifier, extractKeywords } from './sentiment-model';

/**
 * Analyse le sentiment d'un commentaire avec DistilBERT multilingue
 * Utilise un modèle optimisé pour la toxicité en français et multilingue
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
    // Initialiser et utiliser le classificateur de toxicité
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
 * Utilise une approche basée sur des mots-clés, patterns, émojis et négations
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
    // Support et encouragement
    'soutien', 'soutiens', 'approuve', 'approuvons', 'excellent', 'parfait',
    'formidable', 'génial', 'fantastique', 'merveilleux', 'magnifique',
    'bravo', 'félicitations', 'courage', 'continue', 'continuez',
    'super', 'top', 'extraordinaire', 'sublime', 'brillant', 'impressionnant',
    'enthousiaste', 'favorable', 'admirable', 'remarquable',
    
    // Qualité de vie et bien-être
    'qualité de vie', 'bien-être', 'tranquille', 'paisible', 'serein',
    'repos', 'sommeil', 'détente', 'calme', 'silence', 'paix',
    'santé', 'vivable', 'agréable', 'harmonieux', 'équilibré',
    'revitalisant', 'ressourçant', 'bénéfique', 'sain', 'salutaire',
    
    // Engagement et action
    'important', 'essentiel', 'nécessaire', 'urgent', 'priorité',
    'constructif', 'dialogue', 'solution', 'amélioration', 'progrès',
    'changement positif', 'avancer', 'ensemble', 'unité',
    'mobilisation', 'participatif', 'signer', 'partager', 'contribuer',
    'collaboratif', 'efficace', 'pertinent',
    
    // Communauté et solidarité
    'communauté', 'voisins', 'habitants', 'citoyens', 'solidarité',
    'partage', 'partager', 'diffuser', 'recommande', 'inviter',
    'collectif', 'entraide', 'cohésion', 'convivial', 'inclusive',
    'fraternité', 'voisinage', 'quartier', 'proximité', 'lien social',
    
    // Respect et équilibre
    'respect', 'respectueux', 'équilibre', 'équilibré', 'juste',
    'raisonnable', 'modéré', 'adapté', 'approprié', 'harmonieux',
    'intégrité', 'éthique', 'durable', 'préservation', 'conservation',
    
    // Patrimoine et culture
    'patrimoine', 'historique', 'culturel', 'architecture', 'héritage',
    'tradition', 'préserver', 'conserver', 'authentique', 'valeur',
    'richesse', 'trésor', 'identité', 'charme', 'caractère',
    
    // Vision d'avenir
    'futur', 'avenir', 'génération future', 'durable', 'pérenne',
    'vision', 'perspective', 'potentiel', 'prometteur', 'opportunité'
  ];
  
  // Mots-clés négatifs
  const negativeKeywords = [
    // Opposition et refus
    'contre', 'opposé', 'refuse', 'rejette', 'désaccord', 'pas d\'accord',
    'non', 'jamais', 'anti', 'stopper', 'empêcher', 'bloquer',
    'contestation', 'protestation', 'manifestation', 'boycott',
    
    // Critique et dévalorisation
    'stupide', 'idiot', 'ridicule', 'inutile', 'n\'importe quoi',
    'perte de temps', 'absurde', 'scandaleux', 'honteux', 'inadmissible',
    'insensé', 'déplacé', 'inapproprié', 'irresponsable', 'incompétent',
    'médiocre', 'superficiel', 'simpliste', 'amateurisme',
    
    // Émotions négatives
    'colère', 'furieux', 'énervé', 'agacé', 'irrité',
    'déçu', 'frustré', 'triste', 'inquiet', 'angoissé',
    'stressé', 'peur', 'anxieux', 'préoccupé', 'soucieux',
    
    // Pessimisme et fatalisme
    'impossible', 'irréaliste', 'utopique', 'échec', 'fiasco',
    'catastrophe', 'désastre', 'effondrement', 'menace', 'danger',
    'problématique', 'risque', 'préjudice', 'dommage',
    
    // Nuisances
    'bruit', 'nuisance', 'pollution', 'dérangement', 'perturbation',
    'incommode', 'désagréable', 'insupportable', 'invivable',
    'insalubre', 'intolérable', 'ennuyeux', 'fatigant'
  ];
  
  // Mots de négation qui inversent le sentiment
  const negationWords = [
    'ne', 'n\'', 'pas', 'plus', 'jamais', 'aucun', 'aucune', 'sans', 'ni',
    'personne', 'rien', 'guère', 'nullement'
  ];
  
  // Patterns positifs (expressions)
  const positivePatterns = [
    /je soutiens? (totalement|complètement|entièrement|pleinement|absolument)/i,
    /c'est (très|vraiment|absolument|tout à fait|incroyablement) (important|essentiel|nécessaire|urgent|prioritaire|bénéfique)/i,
    /excellente? (initiative|idée|démarche|proposition|projet|approche)/i,
    /je recommande? (vivement|fortement|sincèrement|chaleureusement|particulièrement)/i,
    /il faut (absolument|vraiment|impérativement|nécessairement|certainement)/i,
    /j'espère (que|vraiment|sincèrement|de tout cœur)/i,
    /merci (beaucoup|infiniment|énormément|sincèrement|chaleureusement) pour/i,
    /félicitations? (pour|à|aux|sincères|chaleureuses)/i,
    /bravo (pour|à|aux)/i,
    /tout (mon|notre) soutien/i,
    /j'adhère (complètement|totalement|entièrement|pleinement) à/i,
    /initiative (formidable|géniale|excellente|remarquable|parfaite)/i,
    /projet (fantastique|superbe|extraordinaire|important|essentiel)/i,
    /entièrement d'accord/i,
    /j'apprécie (beaucoup|énormément|grandement|particulièrement)/i
  ];
  
  // Patterns négatifs
  const negativePatterns = [
    /je (suis|reste) (contre|opposé|réticent|sceptique|dubitatif)/i,
    /c'est (ridicule|stupide|inutile|absurde|insensé|irréfléchi)/i,
    /n'importe quoi/i,
    /perte de temps/i,
    /jamais (d'accord|acceptable|tolérable|envisageable)/i,
    /pas (convaincu|d'accord|intéressé|favorable|optimiste)/i,
    /ne (résout|règle|change|répond|satisfait) (rien|pas|guère)/i,
    /manque (total|complet|flagrant|évident) de/i,
    /complètement (inutile|inadapté|inefficace|inapproprié)/i,
    /laisse (perplexe|sceptique|dubitatif|indifférent)/i,
    /je m'oppose (fermement|catégoriquement|totalement) à/i,
    /aucun (intérêt|avantage|bénéfice|sens)/i,
    /quelle (blague|honte|déception|tristesse|catastrophe)/i
  ];
  
  // Dictionnaire d'émojis avec leur valeur sentimentale
  const emojiSentiment: Record<string, number> = {
    // Émojis positifs
    '😀': 1, '😃': 1, '😄': 1, '😁': 1, '😊': 1, '😍': 1.5, '🥰': 1.5, 
    '❤️': 1.5, '💕': 1.5, '👍': 1, '👏': 1.2, '🙌': 1.2, '👌': 1, 
    '✅': 0.8, '✔️': 0.8, '💯': 1.2, '🎉': 1.2, '🌟': 1, '⭐': 1, 
    '🤩': 1.5, '🔥': 1, '👑': 1, '🏆': 1, '💪': 1, '🌱': 0.5,
    '🌿': 0.5, '🌳': 0.5, '🌍': 0.5, '☀️': 0.5, '🌈': 0.8,
    
    // Émojis négatifs
    '😠': -1, '😡': -1.2, '🤬': -1.5, '😒': -0.8, '😞': -0.8, '😔': -0.8, 
    '😟': -0.8, '😢': -1, '😭': -1, '😩': -0.8, '😫': -0.8, '👎': -1, 
    '❌': -0.8, '⛔': -1, '🚫': -1, '💔': -1, '⚠️': -0.5, '🤦': -0.8,
    '🙄': -0.8, '🤢': -1, '🤮': -1.2, '💩': -1, '💣': -0.8, '🧨': -0.8,
    '👺': -1, '👹': -1
  };
  
  // Variables pour l'analyse
  let positiveScore = 0;
  let negativeScore = 0;
  const foundKeywords: string[] = [];
  
  // Analyse des émojis
  for (const emoji in emojiSentiment) {
    // Compter les occurrences de l'emoji
    const regex = new RegExp(emoji, 'g');
    const matches = text.match(regex);
    if (matches) {
      const score = emojiSentiment[emoji] * matches.length;
      if (score > 0) {
        positiveScore += score;
        foundKeywords.push(`emoji:${emoji}`);
      } else {
        negativeScore += Math.abs(score);
        foundKeywords.push(`emoji:-${emoji}`);
      }
    }
  }
  
  // Fonction pour détecter si un mot est précédé d'une négation dans une fenêtre de 3 mots
  const isNegated = (position: number, words: string[]): boolean => {
    const windowStart = Math.max(0, position - 3);
    for (let i = windowStart; i < position; i++) {
      if (negationWords.includes(words[i])) {
        return true;
      }
    }
    return false;
  };
  
  // Analyse des mots-clés en tenant compte des négations
  const words = text.split(/\s+/);
  
  // Analyse des mots-clés positifs
  positiveKeywords.forEach(keyword => {
    if (keyword.includes(' ')) {
      // Expression avec plusieurs mots
      if (text.includes(keyword)) {
        const position = text.indexOf(keyword);
        const approxWordPos = text.substring(0, position).split(/\s+/).length;
        
        if (isNegated(approxWordPos, words)) {
          negativeScore += 1;
          foundKeywords.push(`-${keyword}`);
        } else {
          positiveScore += 1;
          foundKeywords.push(keyword);
        }
      }
    } else {
      // Mot unique
      const wordIndex = words.findIndex(w => w === keyword);
      if (wordIndex !== -1) {
        if (isNegated(wordIndex, words)) {
          negativeScore += 1;
          foundKeywords.push(`-${keyword}`);
        } else {
          positiveScore += 1;
          foundKeywords.push(keyword);
        }
      }
    }
  });
  
  // Analyse des mots-clés négatifs
  negativeKeywords.forEach(keyword => {
    if (keyword.includes(' ')) {
      // Expression avec plusieurs mots
      if (text.includes(keyword)) {
        const position = text.indexOf(keyword);
        const approxWordPos = text.substring(0, position).split(/\s+/).length;
        
        if (isNegated(approxWordPos, words)) {
          positiveScore += 0.5; // Négation d'un terme négatif est légèrement positif
        } else {
          negativeScore += 1;
          foundKeywords.push(`-${keyword}`);
        }
      }
    } else {
      // Mot unique
      const wordIndex = words.findIndex(w => w === keyword);
      if (wordIndex !== -1) {
        if (isNegated(wordIndex, words)) {
          positiveScore += 0.5; // Négation d'un terme négatif est légèrement positif
        } else {
          negativeScore += 1;
          foundKeywords.push(`-${keyword}`);
        }
      }
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
  if (text.length > 50 && text.length <= 150) {
    positiveScore += 0.5;
  } else if (text.length > 150 && text.length <= 300) {
    positiveScore += 1;
  } else if (text.length > 300) {
    positiveScore += 1.5; // Bonus plus important pour les commentaires très détaillés
  }
  
  // Bonus pour une structure articulée (utilisation de mots de liaison)
  const articulationWords = ['car', 'parce que', 'donc', 'ainsi', 'par conséquent', 'en effet', 'notamment', 'cependant', 'toutefois', 'néanmoins', 'mais'];
  let articulationCount = 0;
  
  articulationWords.forEach(word => {
    if (text.includes(word)) {
      articulationCount++;
    }
  });
  
  if (articulationCount >= 2) {
    positiveScore += 1; // Bonus pour un commentaire bien articulé
  }
  
  // Bonus pour les signes de ponctuation positifs
  if ((text.match(/!/g) || []).length === 1) {
    positiveScore += 0.5;
  } else if ((text.match(/!/g) || []).length >= 2) {
    positiveScore += 0.8; // Plusieurs points d'exclamation montrent de l'enthousiasme
  }
  
  // Détermination du sentiment
  const netScore = positiveScore - negativeScore;
  let sentiment: 'positive' | 'neutral' | 'negative';
  let confidence: number;
  
  if (netScore > 2) {
    sentiment = 'positive';
    confidence = Math.min(netScore / 4, 1);
  } else if (netScore >= 0.5 && netScore <= 2) {
    sentiment = 'positive';
    confidence = Math.min(netScore / 4, 0.7);
  } else if (netScore > -0.5 && netScore < 0.5) {
    sentiment = 'neutral';
    confidence = 0.5;
  } else if (netScore <= -0.5 && netScore >= -2) {
    sentiment = 'negative';
    confidence = Math.min(Math.abs(netScore) / 4, 0.7);
  } else {
    sentiment = 'negative';
    confidence = Math.min(Math.abs(netScore) / 4, 1);
  }
  
  // Limiter le nombre de mots-clés retournés pour éviter une sortie trop verbeuse
  const limitedKeywords = foundKeywords.slice(0, 15);
  
  // Ajustement des bonus en fonction du sentiment et de la confiance
  const sentimentMultiplier: Record<string, number> = {
    positive: confidence >= 0.7 ? 1 : 0.8,
    neutral: 0.5,
    negative: 0.2
  };
  
  // Calcul du score final
  const bonusScoreBase = COUPON_CONFIG.scoring.sentimentBonus[sentiment];
  const bonusScore = Math.round(bonusScoreBase * sentimentMultiplier[sentiment]);
  
  return {
    sentiment,
    score: bonusScore,
    confidence,
    keywords: limitedKeywords
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
  // Configuration qui permet de basculer entre AI et règles
  const useAI = true; // Peut être configuré par une variable d'env
  
  if (useAI) {
    try {
      // Utiliser l'analyse IA en priorité
      return await analyzeSentimentAI(comment);
    } catch (error) {
      console.warn('Fallback to rule-based sentiment analysis:', error);
      // En cas d'échec, utiliser la méthode par règles
      return analyzeSentimentRules(comment);
    }
  } else {
    return analyzeSentimentRules(comment);
  }
}

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
      minScore: 10,
      generations: 3,
      color: 'bg-gradient-to-r from-violet-500 to-purple-500',
      label: 'Passionné'
    },
    CHAMPION: {
      minScore: 15,
      generations: 4,
      color: 'bg-gradient-to-r from-amber-400 to-yellow-300',
      label: 'Champion'
    }
  },
  scoring: {
    commentLength: {
      short: 1, // 1-50 caractères
      medium: 2, // 51-150 caractères
      long: 3,   // 151+ caractères
    },
    sentimentBonus: {
      positive: 3,
      neutral: 1,
      negative: 0,
    },
    newsletter: 2,
    socialShare: 3,
    referral: 2
  },
  // Configuration du système de parrainage
  referral: {
    bonusGenerations: 1, // +1 génération par parrainage réussi
    maxBonusGenerations: 10, // Maximum 10 générations bonus par parrainage
    referrerBonus: 1, // +1 génération pour le parrain
    refereeBonus: 1, // +1 génération pour le filleul
    codeLength: 6, // Longueur des codes de parrainage
    validityDays: 90 // Validité des codes de parrainage en jours
  },
  // Durée de validité des coupons en millisecondes (30 jours)
  validityDuration: 30 * 24 * 60 * 60 * 1000
};

export type CouponLevel = keyof typeof COUPON_CONFIG.levels;

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

export interface SignatureEngagementData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  postalCode: string;
  comment?: string;
  newsletterConsent?: boolean;
  hasSocialShare: boolean;
  socialShares: number;
  referrals: number;
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
  id: string; // Alias pour code
  code: string;
  level: CouponLevel;
  generationsLeft: number;
  generationsRemaining: number; // Alias pour generationsLeft
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

export interface ReferralData {
  code: string;
  email: string;
  referrerEmail: string;
  createdAt: number;
  used: boolean;
  usedAt?: number;
  bonusAwarded?: boolean;
}

export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalBonusGenerations: number;
  conversionRate: number;
}

export interface EnhancedCouponData extends CouponData {
  referralBonuses: number;
  referralStats?: ReferralStats;
}

// Constantes de stockage
const COUPONS_STORAGE_KEY = 'petition_coupons';
const REFERRALS_STORAGE_KEY = 'petition_referrals';

// Fonction utilitaire pour générer un code aléatoire
function generateRandomCode(length: number = 8): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Évite les caractères ambigus comme I, O, 0, 1
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  
  return result;
}

// Charge les coupons du stockage local
export function loadCoupons(): CouponData[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const couponsJson = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (!couponsJson) return [];
    
    const coupons = JSON.parse(couponsJson);
    return Array.isArray(coupons) ? coupons : [];
  } catch (e) {
    console.error('Erreur lors du chargement des coupons:', e);
    return [];
  }
}

// Sauvegarde les coupons dans le stockage local
export function saveCoupons(coupons: CouponData[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
  } catch (e) {
    console.error('Erreur lors de la sauvegarde des coupons:', e);
  }
}

// Calcule le score d'engagement à partir des données de signature
export async function calculateEngagement(data: SignatureData): Promise<EngagementDetails> {
  let score = 0;
  
  // Score pour le commentaire
  if (data.comment && data.comment.trim()) {
    const commentLength = data.comment.trim().length;
    if (commentLength > 0 && commentLength <= 50) {
      score += COUPON_CONFIG.scoring.commentLength.short;
    } else if (commentLength > 50 && commentLength <= 150) {
      score += COUPON_CONFIG.scoring.commentLength.medium;
    } else if (commentLength > 150) {
      score += COUPON_CONFIG.scoring.commentLength.long;
    }
    // Bonus pour sentiment positif
  let sentimentScore = 0;
  let sentimentAnalysis = null;
  
  if (data.comment) {
    sentimentAnalysis = await analyzeSentiment(data.comment);
    sentimentScore = sentimentAnalysis.score;
    data.comment = data.comment.trim();
  }
    
  // Calcul du score final
  const totalScore = score + sentimentScore;
    
  return {
    details: data,
    score: totalScore,
    level: determineCouponLevel(totalScore),
    sentimentAnalysis
    };
  }
  
  // Bonus pour inscription newsletter
  if (data.newsletter) {
    score += COUPON_CONFIG.scoring.newsletter;
  }
  
  // Bonus pour partages sociaux
  if (data.socialShares && data.socialShares.length > 0) {
    score += COUPON_CONFIG.scoring.socialShare;
  }
  
  // Bonus pour parrainage
  if (data.referralCode) {
    score += COUPON_CONFIG.scoring.referral;
  }
  
  return {
    details: data,
    score,
    level: determineCouponLevel(score)
  };
}

// Détermine le niveau de coupon en fonction du score
function determineCouponLevel(score: number): CouponLevel {
  const levels = Object.entries(COUPON_CONFIG.levels) as [CouponLevel, { minScore: number }][];
  
  // Tri par score minimum décroissant
  const sortedLevels = levels.sort((a, b) => b[1].minScore - a[1].minScore);
  
  // Trouve le premier niveau dont le score minimum est <= au score
  const matchingLevel = sortedLevels.find(([_, { minScore }]) => score >= minScore);
  
  // Retourne le niveau correspondant ou BASIC par défaut
  return matchingLevel ? matchingLevel[0] : 'BASIC';
}

// Crée un coupon basé sur les données d'engagement
export function createCoupon(engagement: EngagementDetails): CouponData {
  const level = engagement.level;
  const totalGenerations = COUPON_CONFIG.levels[level].generations;
  
  // Ajouter les générations bonus pour les parrainages
  const referralBonuses = countReferralBonuses(engagement.details.email);
  const totalWithBonus = totalGenerations + referralBonuses;
  
  const code = generateRandomCode(10);
  const coupon: CouponData = {
    id: code,
    code,
    level,
    generationsLeft: totalWithBonus,
    generationsRemaining: totalWithBonus,
    totalGenerations: totalWithBonus,
    email: engagement.details.email,
    createdAt: Date.now(),
    expiresAt: Date.now() + COUPON_CONFIG.validityDuration,
    engagement
  };
  
  // Sauvegarde le coupon
  const coupons = loadCoupons();
  coupons.push(coupon);
  saveCoupons(coupons);
  
  // Si un code de parrainage a été utilisé, le marquer comme utilisé
  if (engagement.details.referralCode) {
    markReferralAsUsed(engagement.details.referralCode, engagement.details.email);
  }
  
  return coupon;
}

// Valide un coupon et retourne le résultat
export function validateCoupon(code: string): ValidationResult {
  if (!code) {
    return { valid: false, error: 'no_code', message: 'Aucun code fourni' };
  }
  
  const coupons = loadCoupons();
  const coupon = coupons.find(c => c.code === code.toUpperCase());
  
  if (!coupon) {
    return { valid: false, error: 'not_found', message: 'Coupon non trouvé' };
  }
  
  const now = Date.now();
  if (now > coupon.expiresAt) {
    return { valid: false, error: 'expired', message: 'Coupon expiré', coupon };
  }
  
  if (coupon.generationsLeft <= 0) {
    return { valid: false, error: 'depleted', message: 'Toutes les générations ont été utilisées', coupon };
  }
  
  return { valid: true, coupon, message: 'Coupon valide' };
}

// Utilise une génération d'un coupon
export function useGeneration(code: string): ValidationResult {
  const result = validateCoupon(code);
  
  if (!result.valid || !result.coupon) {
    return result;
  }
  
  // Met à jour le nombre de générations restantes
  const coupons = loadCoupons();
  const index = coupons.findIndex(c => c.code === code.toUpperCase());
  
  if (index !== -1 && coupons[index].generationsLeft > 0) {
    coupons[index].generationsLeft--;
    coupons[index].generationsRemaining = coupons[index].generationsLeft; // Keep in sync
    saveCoupons(coupons);
    
    return {
      valid: true,
      coupon: coupons[index],
      message: `Génération utilisée, ${coupons[index].generationsLeft} restantes`
    };
  }
  
  return { valid: false, error: 'depleted', message: 'Toutes les générations ont été utilisées', coupon: result.coupon };
}

// ========== SYSTÈME DE PARRAINAGE ==========

// Génère un code de parrainage pour un utilisateur
export function generateReferralCode(email: string): string {
  if (typeof window === 'undefined') return '';
  
  try {
    const referrals = loadReferrals();
    
    // Vérifier si l'utilisateur a déjà un code de parrainage
    const existingReferral = referrals.find(r => r.email === email && r.referrerEmail === email);
    
    if (existingReferral) {
      return existingReferral.code;
    }
    
    // Générer un nouveau code unique
    let referralCode: string;
    let attempts = 0;
    do {
      referralCode = generateRandomCode(COUPON_CONFIG.referral.codeLength);
      attempts++;
    } while (referrals.some(r => r.code === referralCode) && attempts < 10);
    
    // Enregistrer le code avec l'utilisateur comme parrain et filleul (pour marquer comme auto-généré)
    const newReferral: ReferralData = {
      code: referralCode,
      email: email,
      referrerEmail: email, // Marque que ce code est créé par cet email
      createdAt: Date.now(),
      used: false,
      bonusAwarded: false
    };
    
    referrals.push(newReferral);
    saveReferrals(referrals);
    
    return referralCode;
  } catch (e) {
    console.error('Erreur lors de la génération du code de parrainage:', e);
    return '';
  }
}

// Vérifie et enregistre un code de parrainage utilisé
export function recordReferral(referralCode: string, userEmail: string): boolean {
  if (typeof window === 'undefined' || !referralCode || !userEmail) return false;
  
  try {
    const referrals = loadReferrals();
    
    // Vérifier si le code existe et n'appartient pas à l'utilisateur actuel
    const referralEntry = referrals.find(r =>
      r.code === referralCode.toUpperCase() &&
      r.email === r.referrerEmail && // Vérifie que c'est un code auto-généré
      r.email !== userEmail // Pas son propre code
    );
    
    if (!referralEntry) {
      return false;
    }
    
    // Vérifier si ce parrainage a déjà été enregistré
    const alreadyReferred = referrals.some(r =>
      r.referrerEmail === referralEntry.email &&
      r.email === userEmail
    );
    
    if (alreadyReferred) {
      return true; // Déjà référé, on considère que c'est ok
    }
    
    // Enregistrer le nouveau parrainage
    const newReferral: ReferralData = {
      code: referralCode.toUpperCase(),
      email: userEmail,
      referrerEmail: referralEntry.email,
      createdAt: Date.now(),
      used: false,
      bonusAwarded: false
    };
    
    referrals.push(newReferral);
    saveReferrals(referrals);
    
    return true;
  } catch (e) {
    console.error('Erreur lors de l\'enregistrement du parrainage:', e);
    return false;
  }
}

// Valide un code de parrainage
export function validateReferralCode(referralCode: string, userEmail?: string): {
  valid: boolean;
  referrer?: string;
  error?: string;
} {
  if (!referralCode) {
    return { valid: false, error: 'Code de parrainage requis' };
  }
  
  if (typeof window === 'undefined') {
    return { valid: false, error: 'Validation côté serveur requise' };
  }
  
  try {
    const referrals = loadReferrals();
    const code = referralCode.toUpperCase();
    
    // Trouver le code de parrainage
    const referralEntry = referrals.find(r =>
      r.code === code &&
      r.email === r.referrerEmail // Code auto-généré
    );
    
    if (!referralEntry) {
      return { valid: false, error: 'Code de parrainage invalide' };
    }
    
    // Vérifier que l'utilisateur n'utilise pas son propre code
    if (userEmail && referralEntry.email === userEmail) {
      return { valid: false, error: 'Vous ne pouvez pas utiliser votre propre code' };
    }
    
    // Vérifier la validité temporelle
    const validityPeriod = COUPON_CONFIG.referral.validityDays * 24 * 60 * 60 * 1000;
    if (Date.now() - referralEntry.createdAt > validityPeriod) {
      return { valid: false, error: 'Code de parrainage expiré' };
    }
    
    return {
      valid: true,
      referrer: referralEntry.email
    };
  } catch (e) {
    console.error('Erreur lors de la validation du code de parrainage:', e);
    return { valid: false, error: 'Erreur de validation' };
  }
}

// Marque un parrainage comme utilisé et attribue les bonus
export function markReferralAsUsed(referralCode: string, userEmail: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const referrals = loadReferrals();
    
    // Trouver le parrainage correspondant
    const index = referrals.findIndex(r =>
      r.code === referralCode.toUpperCase() &&
      r.email === userEmail &&
      !r.used
    );
    
    if (index === -1) {
      return false;
    }
    
    // Marquer comme utilisé
    referrals[index].used = true;
    referrals[index].usedAt = Date.now();
    saveReferrals(referrals);
    
    // Attribuer le bonus au parrain
    awardReferralBonus(referrals[index].referrerEmail, userEmail);
    
    return true;
  } catch (e) {
    console.error('Erreur lors du marquage du parrainage:', e);
    return false;
  }
}

// Attribue un bonus de parrainage au parrain
export function awardReferralBonus(referrerEmail: string, refereeEmail: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const coupons = loadCoupons();
    
    // Trouver le coupon du parrain
    const referrerCouponIndex = coupons.findIndex(c => c.email === referrerEmail);
    
    if (referrerCouponIndex !== -1) {
      // Ajouter le bonus au coupon existant
      const bonusGenerations = COUPON_CONFIG.referral.referrerBonus;
      coupons[referrerCouponIndex].generationsLeft += bonusGenerations;
      coupons[referrerCouponIndex].generationsRemaining = coupons[referrerCouponIndex].generationsLeft; // Keep in sync
      coupons[referrerCouponIndex].totalGenerations += bonusGenerations;
      
      // Ajouter les bonus de parrainage si c'est un EnhancedCouponData
      if ('referralBonuses' in coupons[referrerCouponIndex]) {
        (coupons[referrerCouponIndex] as any).referralBonuses += bonusGenerations;
      } else {
        (coupons[referrerCouponIndex] as any).referralBonuses = bonusGenerations;
      }
      
      saveCoupons(coupons);
      
      console.log(`✅ Bonus de parrainage attribué: +${bonusGenerations} générations pour ${referrerEmail}`);
      return true;
    }
    
    return false;
  } catch (e) {
    console.error('Erreur lors de l\'attribution du bonus:', e);
    return false;
  }
}

// Calcule les statistiques de parrainage pour un utilisateur
export function getReferralStats(email: string): ReferralStats {
  if (typeof window === 'undefined') {
    return {
      totalReferrals: 0,
      successfulReferrals: 0,
      pendingReferrals: 0,
      totalBonusGenerations: 0,
      conversionRate: 0
    };
  }
  
  try {
    const referrals = loadReferrals();
    
    // Filtrer les parrainages de cet utilisateur
    const userReferrals = referrals.filter(r =>
      r.referrerEmail === email &&
      r.email !== email // Exclure son propre code
    );
    
    const totalReferrals = userReferrals.length;
    const successfulReferrals = userReferrals.filter(r => r.used).length;
    const pendingReferrals = totalReferrals - successfulReferrals;
    const totalBonusGenerations = successfulReferrals * COUPON_CONFIG.referral.referrerBonus;
    const conversionRate = totalReferrals > 0 ? (successfulReferrals / totalReferrals) * 100 : 0;
    
    return {
      totalReferrals,
      successfulReferrals,
      pendingReferrals,
      totalBonusGenerations,
      conversionRate: Math.round(conversionRate * 100) / 100
    };
  } catch (e) {
    console.error('Erreur lors du calcul des statistiques:', e);
    return {
      totalReferrals: 0,
      successfulReferrals: 0,
      pendingReferrals: 0,
      totalBonusGenerations: 0,
      conversionRate: 0
    };
  }
}

// Compte le nombre de parrainages réussis pour un utilisateur
export function countReferrals(email: string): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const referrals = loadReferrals();
    
    // Compter les parrainages réussis (utilisés)
    return referrals.filter(r => 
      r.referrerEmail === email && 
      r.email !== email && // Ne pas compter son propre code
      r.used
    ).length;
  } catch (e) {
    console.error('Erreur lors du comptage des parrainages:', e);
    return 0;
  }
}

// Calcule le nombre de générations bonus basées sur les parrainages
export function countReferralBonuses(email: string): number {
  // Chaque parrainage réussi donne +1 génération
  return countReferrals(email);
}

// Charge les parrainages du stockage local
export function loadReferrals(): ReferralData[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const referralsJson = localStorage.getItem(REFERRALS_STORAGE_KEY);
    if (!referralsJson) return [];
    
    const referrals = JSON.parse(referralsJson);
    return Array.isArray(referrals) ? referrals : [];
  } catch (e) {
    console.error('Erreur lors du chargement des parrainages:', e);
    return [];
  }
}

// Sauvegarde les parrainages dans le stockage local
export function saveReferrals(referrals: ReferralData[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(REFERRALS_STORAGE_KEY, JSON.stringify(referrals));
  } catch (e) {
    console.error('Erreur lors de la sauvegarde des parrainages:', e);
  }
}

// Récupère les détails d'un parrainage par code
export function getReferralByCode(code: string): ReferralData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const referrals = loadReferrals();
    return referrals.find(r => r.code === code.toUpperCase()) || null;
  } catch (e) {
    console.error('Erreur lors de la récupération du parrainage:', e);
    return null;
  }
}

// ========== SYSTÈME DE COUPONS AMÉLIORÉ ==========

// Calcule le score d'engagement avec support des parrainages
export async function calculateEngagementScore(data: SignatureEngagementData): Promise<number> {
  let score = 0;
  
  // Score pour le commentaire
  if (data.comment && data.comment.trim()) {
    const commentLength = data.comment.trim().length;
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
  if (data.newsletterConsent) {
    score += COUPON_CONFIG.scoring.newsletter;
  }
  
  // Bonus pour partages sociaux
  if (data.hasSocialShare || data.socialShares > 0) {
    score += COUPON_CONFIG.scoring.socialShare;
  }
  
  // Bonus pour utilisation d'un code de parrainage
  if (data.referralCode) {
    score += COUPON_CONFIG.scoring.referral;
  }
  
  return score;
}

// Détermine le niveau d'engagement
export function getEngagementLevel(score: number): CouponLevel {
  const levels = Object.entries(COUPON_CONFIG.levels) as [CouponLevel, { minScore: number }][];
  const sortedLevels = levels.sort((a, b) => b[1].minScore - a[1].minScore);
  const matchingLevel = sortedLevels.find(([_, { minScore }]) => score >= minScore);
  return matchingLevel ? matchingLevel[0] : 'BASIC';
}

// Obtient les détails d'un niveau d'engagement
export function getEngagementLevelDetails(level: CouponLevel) {
  const config = COUPON_CONFIG.levels[level];
  const badges = {
    BASIC: '🌱',
    ENGAGED: '💙',
    PASSIONATE: '💜',
    CHAMPION: '👑'
  };
  
  return {
    name: config.label,
    badge: badges[level],
    color: config.color,
    generations: config.generations,
    minScore: config.minScore
  };
}

// Crée un coupon intelligent avec support des parrainages
export function createSmartCoupon(email: string, engagementData: SignatureEngagementData): EnhancedCouponData {
  const score = engagementData.referrals; // Score temporaire, sera calculé de manière asynchrone
  const level = getEngagementLevel(score);
  const levelDetails = getEngagementLevelDetails(level);
  
  // Générations de base
  let totalGenerations = levelDetails.generations;
  
  // Bonus pour parrainage utilisé (pour le filleul)
  if (engagementData.referralCode) {
    totalGenerations += COUPON_CONFIG.referral.refereeBonus;
  }
  
  // Bonus pour parrainages réussis
  const referralBonuses = countReferralBonuses(email);
  totalGenerations += referralBonuses;
  
  const code = generateRandomCode(12); // Format XXXX-XXXX-XXXX
  const coupon: EnhancedCouponData = {
    id: code,
    code,
    level,
    generationsLeft: totalGenerations,
    generationsRemaining: totalGenerations,
    totalGenerations,
    email,
    createdAt: Date.now(),
    expiresAt: Date.now() + COUPON_CONFIG.validityDuration,
    engagement: {
      details: {
        name: `${engagementData.firstName} ${engagementData.lastName}`,
        email: engagementData.email,
        city: engagementData.city,
        postalCode: engagementData.postalCode,
        comment: engagementData.comment,
        newsletter: engagementData.newsletterConsent,
        socialShares: engagementData.hasSocialShare ? ['petition'] : [],
        referralCode: engagementData.referralCode
      },
      score,
      level
    },
    referralBonuses,
    referralStats: getReferralStats(email)
  };
  
  // Formater le code au format XXXX-XXXX-XXXX
  coupon.code = formatCouponCode(coupon.code);
  
  return coupon;
}

// Formate un code de coupon au format XXXX-XXXX-XXXX
function formatCouponCode(code: string): string {
  // Assurer que le code fait 12 caractères
  const paddedCode = code.padEnd(12, '0').substring(0, 12);
  return `${paddedCode.substring(0, 4)}-${paddedCode.substring(4, 8)}-${paddedCode.substring(8, 12)}`;
}

// Stocke un coupon amélioré
export function storeEnhancedCoupon(coupon: EnhancedCouponData): void {
  const coupons = loadCoupons();
  coupons.push(coupon);
  saveCoupons(coupons);
  
  // Si un code de parrainage a été utilisé, l'enregistrer
  if (coupon.engagement.details.referralCode) {
    recordReferral(coupon.engagement.details.referralCode, coupon.email);
  }
}

// ========== FONCTIONS UTILITAIRES POUR L'INTERFACE ==========

// Récupère le coupon actif pour l'utilisateur actuel (basé sur localStorage)
export function getActiveCoupon(): CouponData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const coupons = loadCoupons();
    
    // Trouver le coupon le plus récent qui n'est pas expiré et a des générations restantes
    const now = Date.now();
    const activeCoupons = coupons.filter(coupon =>
      coupon.expiresAt > now &&
      coupon.generationsLeft > 0
    );
    
    // Retourner le plus récent
    if (activeCoupons.length > 0) {
      return activeCoupons.sort((a, b) => b.createdAt - a.createdAt)[0];
    }
    
    return null;
  } catch (e) {
    console.error('Erreur lors de la récupération du coupon actif:', e);
    return null;
  }
}

// Interface pour la validation et l'utilisation des coupons (compatible avec l'interface existante)
export interface CouponValidationResult {
  valid: boolean;
  coupon?: CouponData;
  message: string;
}

// Valide et utilise un coupon (fonction wrapper pour l'interface)
export function validateAndUseCoupon(code: string): CouponValidationResult {
  const validation = validateCoupon(code);
  
  return {
    valid: validation.valid,
    coupon: validation.coupon,
    message: validation.message || (validation.error ? `Erreur: ${validation.error}` : 'Coupon invalide')
  };
}

// Utilise une génération d'un coupon (fonction wrapper)
export function useCouponGeneration(code: string): CouponData | null {
  const result = useGeneration(code);
  return result.valid ? result.coupon || null : null;
}

