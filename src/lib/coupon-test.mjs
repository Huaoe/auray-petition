// Test manuel du système de coupons avec DistilBERT
// Utilise l'extension .mjs pour le support natif des modules ES

import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Récupère le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Implémentation minimale de localStorage pour les tests Node.js
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value.toString();
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

// Charger dynamiquement le module coupon-system.ts via un import conditionnel
async function loadCouponSystem() {
  try {
    // Pour contourner l'impossibilité d'importer directement un .ts dans Node.js,
    // on importe le code du fichier coupon-system.ts en tant que texte
    const filePath = path.join(__dirname, 'coupon-system.ts');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // On crée un fichier temporaire .mjs avec le code converti
    const tempPath = path.join(__dirname, 'temp-coupon-system.mjs');
    
    // Remplacer les imports/exports TypeScript par du JavaScript compatible
    let jsContent = fileContent
      .replace(/import\s+.*\s+from\s+['"].*['"]/g, '// $&')
      .replace(/export\s+interface\s+(\w+)/g, '// export interface $1')
      .replace(/export\s+type\s+(\w+)/g, '// export type $1')
      .replace(/:\s*(\w+)(\[\])?(\s*=|\s*;|\s*\)|\s*,|\s*\}|\s*\|)/g, '$3')
      .replace(/export\s+const/g, 'export const')
      .replace(/export\s+(async\s+)?function/g, 'export $1function');
    
    fs.writeFileSync(tempPath, jsContent);
    
    // Importer dynamiquement le fichier temporaire
    console.log('Chargement du module coupon-system...');
    const couponSystem = await import('./temp-coupon-system.mjs');
    console.log('Module coupon-system chargé avec succès!');
    
    // Supprimer le fichier temporaire après l'importation
    fs.unlinkSync(tempPath);
    
    return couponSystem;
  } catch (error) {
    console.error('Erreur lors du chargement du module coupon-system:', error);
    throw error;
  }
}

/**
 * Tests manuels des fonctions principales
 */
async function runTests() {
  console.log('=== TESTS MANUELS DU SYSTÈME DE COUPONS AVEC DISTILBERT ===\n');

  try {
    console.log('Chargement du système de coupons...');
    const couponSystem = await loadCouponSystem();
    
    // 1. Test de l'analyse de sentiment synchrone
    console.log('\n1. TEST ANALYSE DE SENTIMENT (RÈGLES)\n');
    const commentPositif = "J'adore cette initiative, c'est fantastique !";
    const resultRegles = couponSystem.analyzeSentimentRules(commentPositif);
    console.log('Résultat analyse règles:', resultRegles);
    
    // 2. Test de l'analyse de sentiment asynchrone (DistilBERT)
    console.log('\n2. TEST ANALYSE DE SENTIMENT (DISTILBERT)\n');
    try {
      console.log('Analyse DistilBERT en cours...');
      const resultIA = await couponSystem.analyzeSentiment(commentPositif);
      console.log('Résultat analyse DistilBERT:', resultIA);
    } catch (e) {
      console.error('Erreur lors de l\'analyse DistilBERT:', e);
    }
    
    // 3. Test du calcul d'engagement
    console.log('\n3. TEST CALCUL D\'ENGAGEMENT\n');
    const donneesSignature = {
      name: 'Jean Test',
      email: 'test@example.com',
      city: 'Auray',
      postalCode: '56400',
      comment: 'Super initiative !',
      newsletter: true,
      socialShares: ['facebook', 'twitter']
    };
    
    try {
      console.log('Calcul d\'engagement en cours...');
      const engagement = await couponSystem.calculateEngagement(donneesSignature);
      console.log('Résultat engagement:', engagement);
    } catch (e) {
      console.error('Erreur lors du calcul d\'engagement:', e);
    }
    
    console.log('\n=== TESTS TERMINÉS ===');
  } catch (error) {
    console.error('Erreur lors des tests:', error);
  }
}

// Exécuter les tests
runTests().catch(console.error);
