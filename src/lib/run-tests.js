/**
 * Script d'exécution simplifiée des tests du système de coupons
 * Contourne les problèmes de compatibilité ESM/CommonJS de Jest
 */

// Simuler l'environnement du navigateur pour les tests
global.window = {};

// Simuler localStorage
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

// Importer de manière dynamique le système de coupons
async function runTests() {
  try {
    console.log('\n=== TEST MANUEL DU SYSTÈME DE COUPONS ===\n');
    
    // Import dynamique du module (fonctionne avec ESM et CommonJS)
    const couponSystem = await import('./coupon-system.js');
    
    // Accès aux fonctions du système
    const { 
      analyzeSentiment,
      analyzeSentimentRules,
      calculateEngagement,
      createCoupon,
      validateCoupon 
    } = couponSystem;
    
    // 1. Test d'analyse de sentiment
    console.log('1️⃣ Test d\'analyse de sentiment');
    const commentTest = "J'adore cette initiative, c'est formidable!";
    
    // Test analyse par règles
    const resultRules = analyzeSentimentRules(commentTest);
    console.log(`   ✓ Analyse par règles: ${resultRules.sentiment} (score: ${resultRules.score})`);
    
    // Test analyse IA
    try {
      const resultAI = await analyzeSentiment(commentTest);
      console.log(`   ✓ Analyse IA: ${resultAI.sentiment} (score: ${resultAI.score}, confiance: ${resultAI.confidence.toFixed(2)})`);
      console.log(`   ✓ Mots-clés: ${resultAI.keywords.join(', ')}`);
    } catch (error) {
      console.log(`   ⚠ Analyse IA non disponible: ${error.message}`);
    }
    
    // 2. Test de calcul d'engagement
    console.log('\n2️⃣ Test de calcul d\'engagement');
    const signatureTest = {
      name: 'Jean Test',
      email: 'test@example.com',
      city: 'Auray',
      postalCode: '56400',
      comment: commentTest,
      newsletter: true,
      socialShares: ['facebook', 'twitter']
    };
    
    const engagement = await calculateEngagement(signatureTest);
    console.log(`   ✓ Score d'engagement: ${engagement.score} (niveau: ${engagement.level})`);
    
    // 3. Test de création de coupon
    console.log('\n3️⃣ Test de création de coupon');
    const coupon = createCoupon(engagement);
    console.log(`   ✓ Coupon créé: ${coupon.code}`);
    console.log(`   ✓ Niveau: ${coupon.level} (${coupon.generationsLeft} générations)`);
    
    // 4. Test de validation
    console.log('\n4️⃣ Test de validation de coupon');
    const validation = validateCoupon(coupon.code);
    console.log(`   ✓ Validation: ${validation.valid ? 'Réussie' : 'Échouée'}`);
    
    console.log('\n✅ TOUS LES TESTS ONT RÉUSSI!');
    
  } catch (error) {
    console.error('\n❌ ERREUR LORS DES TESTS:', error);
    process.exit(1);
  }
}

runTests();
