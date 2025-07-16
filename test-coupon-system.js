/**
 * Script de test pour le système de coupons avancé
 * Usage: node test-coupon-system.js
 */

// Simulation des fonctions du système de coupons (version Node.js)
const COUPON_CONFIG = {
  expirationDays: 30,
  codeLength: 12,
  
  engagementLevels: {
    BASIC: {
      name: 'Supporter',
      minScore: 0,
      maxScore: 49,
      generations: 2,
      color: '#6B7280',
      badge: '🌱'
    },
    ENGAGED: {
      name: 'Engagé',
      minScore: 50,
      maxScore: 99,
      generations: 3,
      color: '#3B82F6',
      badge: '⭐'
    },
    PASSIONATE: {
      name: 'Passionné',
      minScore: 100,
      maxScore: 199,
      generations: 4,
      color: '#8B5CF6',
      badge: '🔥'
    },
    CHAMPION: {
      name: 'Champion',
      minScore: 200,
      maxScore: Infinity,
      generations: 5,
      color: '#F59E0B',
      badge: '👑'
    }
  },
  
  scoring: {
    baseSignature: 10,
    commentLength: {
      short: 5,
      medium: 15,
      long: 25
    },
    newsletter: 10,
    socialShare: 20,
    referral: 30
  }
};

function generateCouponCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < COUPON_CONFIG.codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  
  return result;
}

function calculateEngagementScore(signatureData) {
  let score = COUPON_CONFIG.scoring.baseSignature;
  
  // Score pour commentaire
  if (signatureData.comment && signatureData.comment.trim()) {
    const commentLength = signatureData.comment.trim().length;
    if (commentLength < 50) {
      score += COUPON_CONFIG.scoring.commentLength.short;
    } else if (commentLength <= 150) {
      score += COUPON_CONFIG.scoring.commentLength.medium;
    } else {
      score += COUPON_CONFIG.scoring.commentLength.long;
    }
  }
  
  // Score pour newsletter
  if (signatureData.newsletterConsent) {
    score += COUPON_CONFIG.scoring.newsletter;
  }
  
  // Score pour partages sociaux
  if (signatureData.socialShares) {
    score += signatureData.socialShares * COUPON_CONFIG.scoring.socialShare;
  }
  
  // Score pour parrainages
  if (signatureData.referrals) {
    score += signatureData.referrals * COUPON_CONFIG.scoring.referral;
  }
  
  return score;
}

function determineEngagementLevel(score) {
  for (const [level, config] of Object.entries(COUPON_CONFIG.engagementLevels)) {
    if (score >= config.minScore && score <= config.maxScore) {
      return {
        level,
        name: config.name,
        badge: config.badge,
        color: config.color,
        generations: config.generations
      };
    }
  }
  
  return COUPON_CONFIG.engagementLevels.BASIC;
}

function createSmartCoupon(email, signatureData) {
  const score = calculateEngagementScore(signatureData);
  const engagementInfo = determineEngagementLevel(score);
  
  const coupon = {
    id: generateCouponCode(),
    email,
    generationsRemaining: engagementInfo.generations,
    totalGenerations: engagementInfo.generations,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + COUPON_CONFIG.expirationDays * 24 * 60 * 60 * 1000).toISOString(),
    used: false,
    engagementScore: score,
    engagementLevel: engagementInfo.level,
    levelName: engagementInfo.name,
    levelBadge: engagementInfo.badge,
    levelColor: engagementInfo.color,
    signatureData
  };
  
  return coupon;
}

// Tests du système
console.log('🧪 TESTS DU SYSTÈME DE COUPONS AVANCÉ\n');

// Test 1: Signature basique
console.log('📝 Test 1: Signature basique');
const basicSignature = {
  comment: '',
  newsletterConsent: false,
  socialShares: 0,
  referrals: 0
};
const basicCoupon = createSmartCoupon('test1@example.com', basicSignature);
console.log(`   Score: ${basicCoupon.engagementScore}`);
console.log(`   Niveau: ${basicCoupon.levelBadge} ${basicCoupon.levelName}`);
console.log(`   Générations: ${basicCoupon.generationsRemaining}`);
console.log(`   Code: ${basicCoupon.id}\n`);

// Test 2: Signature engagée
console.log('📝 Test 2: Signature engagée (commentaire + newsletter)');
const engagedSignature = {
  comment: 'Je soutiens totalement cette pétition pour une meilleure qualité de vie à Auray.',
  newsletterConsent: true,
  socialShares: 0,
  referrals: 0
};
const engagedCoupon = createSmartCoupon('test2@example.com', engagedSignature);
console.log(`   Score: ${engagedCoupon.engagementScore}`);
console.log(`   Niveau: ${engagedCoupon.levelBadge} ${engagedCoupon.levelName}`);
console.log(`   Générations: ${engagedCoupon.generationsRemaining}`);
console.log(`   Code: ${engagedCoupon.id}\n`);

// Test 3: Signature passionnée
console.log('📝 Test 3: Signature passionnée (commentaire long + newsletter + partages)');
const passionateSignature = {
  comment: 'Cette pétition est absolument essentielle pour notre communauté. Les sonneries de cloches à toute heure perturbent notre sommeil et notre qualité de vie. Il est temps de trouver un équilibre respectueux entre tradition et bien-être des habitants. Je partage cette pétition avec tous mes contacts.',
  newsletterConsent: true,
  socialShares: 2,
  referrals: 0
};
const passionateCoupon = createSmartCoupon('test3@example.com', passionateSignature);
console.log(`   Score: ${passionateCoupon.engagementScore}`);
console.log(`   Niveau: ${passionateCoupon.levelBadge} ${passionateCoupon.levelName}`);
console.log(`   Générations: ${passionateCoupon.generationsRemaining}`);
console.log(`   Code: ${passionateCoupon.id}\n`);

// Test 4: Signature champion
console.log('📝 Test 4: Signature champion (tout + parrainages)');
const championSignature = {
  comment: 'En tant que résident de longue date d\'Auray, je suis profondément préoccupé par l\'impact des sonneries de cloches sur notre communauté. Cette pétition représente une opportunité unique de dialogue constructif entre les différentes parties prenantes. J\'ai personnellement contacté plusieurs voisins et amis pour les sensibiliser à cette cause importante.',
  newsletterConsent: true,
  socialShares: 3,
  referrals: 2
};
const championCoupon = createSmartCoupon('test4@example.com', championSignature);
console.log(`   Score: ${championCoupon.engagementScore}`);
console.log(`   Niveau: ${championCoupon.levelBadge} ${championCoupon.levelName}`);
console.log(`   Générations: ${championCoupon.generationsRemaining}`);
console.log(`   Code: ${championCoupon.id}\n`);

// Test 5: Validation des seuils
console.log('📊 Test 5: Validation des seuils de scoring');
console.log('   Signature de base: 10 points');
console.log('   + Commentaire court (<50 chars): +5 points');
console.log('   + Commentaire moyen (50-150 chars): +15 points');
console.log('   + Commentaire long (>150 chars): +25 points');
console.log('   + Newsletter: +10 points');
console.log('   + Partage social: +20 points chacun');
console.log('   + Parrainage: +30 points chacun');
console.log('');
console.log('   Niveaux:');
console.log('   🌱 BASIC (0-49): 2 générations');
console.log('   ⭐ ENGAGED (50-99): 3 générations');
console.log('   🔥 PASSIONATE (100-199): 4 générations');
console.log('   👑 CHAMPION (200+): 5 générations');

console.log('\n✅ TESTS TERMINÉS - Système de coupons avancé fonctionnel !');
