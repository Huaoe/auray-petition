// @ts-check
// Script de test pour le système de coupons avec intégration DistilBERT
import { 
  analyzeSentiment, 
  analyzeSentimentRules,
  calculateEngagement,
  createCoupon, 
  validateCoupon,
  useGeneration,
  saveCoupons,
  loadCoupons,
  generateReferralCode,
  recordReferral,
  countReferralBonuses 
} from './coupon-system';

// Simuler localStorage pour les tests
global.localStorage = {
  store: {},
  length: 0,
  key(index) {
    return Object.keys(this.store)[index] || null;
  },
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value.toString();
    this.length = Object.keys(this.store).length;
  },
  removeItem(key) {
    delete this.store[key];
    this.length = Object.keys(this.store).length;
  },
  clear() {
    this.store = {};
    this.length = 0;
  }
};

/**
 * Fonction principale de test
 */
async function runTests() {
  console.log('=== TEST COMPLET SYSTÈME DE COUPONS AVEC INTÉGRATION DistilBERT ===');
  
  try {
    await testSentimentAnalysis();
    await testEngagementCalculation();
    testCouponCreation();
    testCouponValidation();
    testReferralSystem();
    testLocalStorage();
    
    console.log('\n✅ TOUS LES TESTS ONT RÉUSSI!');
  } catch (error) {
    console.error('\n❌ ÉCHEC DES TESTS:', error);
    process.exit(1);
  }
}

/**
 * Test des fonctions d'analyse de sentiment
 */
async function testSentimentAnalysis() {
  console.log('\n1️⃣ TEST ANALYSE DE SENTIMENT');
  
  // Test de l'analyse par règles (synchrone)
  const commentPositif = "J'adore cette idée, c'est merveilleux!";
  const commentNegatif = "C'est une idée terrible, je déteste";
  
  const resultatsPositif = analyzeSentimentRules(commentPositif);
  console.log('  ✓ Analyse règles (positif):', resultatsPositif.sentiment);
  if (resultatsPositif.sentiment !== 'positive') throw new Error('Devrait détecter un sentiment positif');
  
  const resultatsNegatif = analyzeSentimentRules(commentNegatif);
  console.log('  ✓ Analyse règles (négatif):', resultatsNegatif.sentiment);
  if (resultatsNegatif.sentiment !== 'negative') throw new Error('Devrait détecter un sentiment négatif');

  // Test de l'analyse IA (asynchrone) avec DistilBERT
  console.log('  → Test DistilBERT (asynchrone)...');
  const resultatsIA = await analyzeSentiment(commentPositif);
  console.log('  ✓ Analyse IA:', resultatsIA.sentiment, 'score:', resultatsIA.score.toFixed(2), 'confiance:', resultatsIA.confidence.toFixed(2));
  if (!resultatsIA.sentiment || resultatsIA.score === undefined) throw new Error('Analyse IA incomplète');
  
  console.log('  ✅ Tests d\'analyse de sentiment réussis!');
}

/**
 * Test du calcul d'engagement
 */
async function testEngagementCalculation() {
  console.log('\n2️⃣ TEST CALCUL D\'ENGAGEMENT');
  
  const donneesBase = {
    name: 'Jean Dupont',
    email: 'test@example.com',
    city: 'Auray',
    postalCode: '56400',
  };
  
  // Test avec engagement minimal
  const engagementMinimal = await calculateEngagement(donneesBase);
  console.log('  ✓ Engagement minimal:', engagementMinimal.score, 'points, niveau:', engagementMinimal.level);
  if (engagementMinimal.score <= 0) throw new Error('Score d\'engagement devrait être positif');
  
  // Test avec engagement complet
  const donneesCompletes = {
    ...donneesBase,
    comment: 'Je soutiens pleinement cette initiative exceptionnelle!',
    newsletter: true,
    socialShares: ['facebook', 'twitter', 'whatsapp']
  };
  
  const engagementComplet = await calculateEngagement(donneesCompletes);
  console.log('  ✓ Engagement complet:', engagementComplet.score, 'points, niveau:', engagementComplet.level);
  if (engagementComplet.score <= engagementMinimal.score) throw new Error('Score d\'engagement complet devrait être supérieur');
  
  console.log('  ✅ Tests de calcul d\'engagement réussis!');
}

/**
 * Test de création des coupons
 */
function testCouponCreation() {
  console.log('\n3️⃣ TEST CRÉATION DE COUPONS');
  
  const engagementBasic = {
    details: {
      name: 'Jean Dupont',
      email: 'basic@example.com',
      city: 'Auray'
    },
    score: 10,
    level: /** @type {import('./coupon-system').CouponLevel} */ ('BASIC')
  };
  
  const couponBasic = createCoupon(engagementBasic);
  console.log('  ✓ Coupon BASIC créé:', couponBasic.code, 'générations:', couponBasic.generationsLeft);
  if (!couponBasic.code || couponBasic.generationsLeft <= 0) throw new Error('Coupon invalide');
  
  const engagementChampion = {
    details: {
      name: 'Marie Dubois',
      email: 'champion@example.com',
      city: 'Auray',
      comment: 'Superbe initiative!',
      newsletter: true,
      socialShares: ['facebook', 'twitter', 'linkedin']
    },
    score: 50,
    level: /** @type {import('./coupon-system').CouponLevel} */ ('CHAMPION')
  };
  
  const couponChampion = createCoupon(engagementChampion);
  console.log('  ✓ Coupon CHAMPION créé:', couponChampion.code, 'générations:', couponChampion.generationsLeft);
  if (couponChampion.generationsLeft <= couponBasic.generationsLeft) throw new Error('Coupon CHAMPION devrait avoir plus de générations');
  
  console.log('  ✅ Tests de création de coupons réussis!');
}

/**
 * Test de validation des coupons
 */
function testCouponValidation() {
  console.log('\n4️⃣ TEST VALIDATION DE COUPONS');
  
  // Création d'un coupon pour les tests
  const engagement = {
    details: {
      name: 'Test User',
      email: 'test@validation.com',
      city: 'Test City'
    },
    score: 15,
    level: /** @type {import('./coupon-system').CouponLevel} */ ('BASIC')
  };
  
  const coupon = createCoupon(engagement);
  
  // Test de validation avec code valide
  const validationValide = validateCoupon(coupon.code);
  console.log('  ✓ Validation code valide:', validationValide.valid);
  if (!validationValide.valid) throw new Error('Code valide devrait être validé');
  
  // Test avec code invalide
  const validationInvalide = validateCoupon('CODE-INVALIDE');
  console.log('  ✓ Validation code invalide:', !validationInvalide.valid);
  if (validationInvalide.valid) throw new Error('Code invalide ne devrait pas être validé');
  
  // Test utilisation de génération
  const utilisation = useGeneration(coupon.code);
  console.log('  ✓ Utilisation génération:', utilisation.valid, 'générations restantes:', utilisation.coupon?.generationsLeft);
  if (!utilisation.valid) throw new Error('Utilisation devrait être valide');
  if (utilisation.coupon?.generationsLeft !== coupon.generationsLeft - 1) throw new Error('Le nombre de générations devrait être décrémenté');
  
  console.log('  ✅ Tests de validation de coupons réussis!');
}

/**
 * Test du système de parrainage
 */
function testReferralSystem() {
  console.log('\n5️⃣ TEST SYSTÈME DE PARRAINAGE');
  
  // Génération de code de parrainage
  const email = 'parrain@example.com';
  const referralCode = generateReferralCode(email);
  console.log('  ✓ Code de parrainage généré:', referralCode);
  if (!referralCode) throw new Error('Code de parrainage devrait être généré');
  
  // Enregistrement de parrainage
  const recordSuccess = recordReferral('filleul@example.com', referralCode);
  console.log('  ✓ Enregistrement parrainage:', recordSuccess);
  if (!recordSuccess) throw new Error('Parrainage devrait être enregistré');
  
  // Comptage des bonus de parrainage
  const bonusCount = countReferralBonuses('parrain@example.com');
  console.log('  ✓ Comptage bonus parrainage:', bonusCount);
  if (bonusCount !== 1) throw new Error('Devrait compter 1 bonus de parrainage');
  
  console.log('  ✅ Tests système de parrainage réussis!');
}

/**
 * Test des fonctionnalités de localStorage
 */
function testLocalStorage() {
  console.log('\n6️⃣ TEST STOCKAGE LOCAL');
  
  // Création de coupons pour les tests
  const engagements = [
    {
      details: { name: 'User 1', email: 'user1@example.com', city: 'City 1' },
      score: 10,
      level: /** @type {import('./coupon-system').CouponLevel} */ ('BASIC')
    },
    {
      details: { name: 'User 2', email: 'user2@example.com', city: 'City 2' },
      score: 30,
      level: /** @type {import('./coupon-system').CouponLevel} */ ('ENGAGED')
    }
  ];
  
  const coupons = engagements.map(e => createCoupon(e));
  
  // Test de sauvegarde
  saveCoupons(coupons);
  console.log('  ✓ Coupons sauvegardés dans localStorage');
  
  // Test de chargement
  const loadedCoupons = loadCoupons();
  console.log('  ✓ Coupons chargés:', loadedCoupons.length);
  if (loadedCoupons.length !== coupons.length) throw new Error('Devrait charger tous les coupons');
  
  console.log('  ✅ Tests de stockage local réussis!');
}

// Exécuter les tests
runTests().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
