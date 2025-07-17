// Script de test manuel pour le système de coupons avec intégration DistilBERT
import {
  analyzeSentiment,
  analyzeSentimentRules,
  calculateEngagement,
  createCoupon,
  validateCoupon,
  COUPON_CONFIG,
  generateReferralCode,
  recordReferral,
  type CouponData,
  type EngagementDetails,
  type SignatureData
} from './coupon-system';

async function runTests() {
  console.log('=== TESTS DU SYSTÈME DE COUPONS AVEC DistilBERT ===');
  
  // 1. Test des fonctions d'analyse de sentiment
  console.log('\n1. Tests d\'analyse de sentiment:');
  
  // Test de l'analyse par règles (synchrone)
  const commentPositif = "J'adore cette idée, elle est vraiment exceptionnelle !";
  const resultatsRegles = analyzeSentimentRules(commentPositif);
  console.log('Analyse par règles (synchrone):', resultatsRegles);
  console.assert(resultatsRegles.sentiment === 'positive', 'Devrait détecter un sentiment positif');
  
  // Test de l'analyse IA (asynchrone)
  try {
    console.log('\nAnalyse IA (asynchrone) en cours...');
    const resultatsIA = await analyzeSentiment(commentPositif);
    console.log('Analyse IA (DistilBERT):', resultatsIA);
    console.assert(resultatsIA.sentiment && resultatsIA.score !== undefined, 'Devrait retourner un sentiment et un score');
  } catch (error) {
    console.error('Erreur dans l\'analyse IA:', error);
  }
  
  // 2. Test du calcul d'engagement
  console.log('\n2. Tests du calcul d\'engagement:');
  const donneesSignature: SignatureData = {
    name: 'Jean Dupont',
    email: 'test@example.com',
    city: 'Auray',
    comment: 'Super initiative !',
    newsletter: true,
    socialShares: ['facebook', 'twitter']
  };
  
  try {
    console.log('Calcul d\'engagement en cours...');
    const engagement = await calculateEngagement(donneesSignature);
    console.log('Résultat du calcul d\'engagement:', engagement);
    console.assert(engagement.score > 0, 'Le score d\'engagement devrait être positif');
    console.assert(engagement.level, 'Le niveau d\'engagement devrait être défini');
  } catch (error) {
    console.error('Erreur dans le calcul d\'engagement:', error);
  }
  
  // 3. Test de création et validation des coupons
  console.log('\n3. Tests de création et validation des coupons:');
  const engagementTest: EngagementDetails = {
    details: donneesSignature,
    score: 15,
    level: 'BASIC'
  };
  
  const coupon = createCoupon(engagementTest);
  console.log('Coupon créé:', coupon);
  console.assert(coupon.code, 'Le coupon devrait avoir un code');
  console.assert(coupon.generationsLeft > 0, 'Le coupon devrait avoir des générations disponibles');
  
  const validationResult = validateCoupon(coupon.code);
  console.log('Résultat de la validation:', validationResult);
  console.assert(validationResult.valid === true, 'Le coupon devrait être valide');
  
  // 4. Test du système de parrainage
  console.log('\n4. Tests du système de parrainage:');
  const referralCode = generateReferralCode('test@example.com');
  console.log('Code de parrainage généré:', referralCode);
  console.assert(referralCode, 'Devrait générer un code de parrainage');
  
  const referralSuccess = recordReferral('friend@example.com', referralCode);
  console.log('Enregistrement du parrainage:', referralSuccess);
  
  console.log('\n=== TESTS TERMINÉS ===');
}

runTests().catch(console.error);
