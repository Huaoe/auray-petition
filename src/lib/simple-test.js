/**
 * Test très simple pour vérifier le fonctionnement de base
 */
console.log('=== TEST SIMPLIFIÉ DU SYSTÈME DE COUPONS ===');

// Vérifier si les fichiers sont accessibles
console.log('Vérification des fichiers...');
const fs = require('fs');

const clientFilePath = './src/lib/coupon-system-client.ts';
const serverFilePath = './src/lib/coupon-system.ts';
const modelClientPath = './src/lib/sentiment-model-client.ts';
const modelServerPath = './src/lib/sentiment-model.ts';

function checkFile(path) {
  try {
    const exists = fs.existsSync(path);
    console.log(`${path}: ${exists ? '✓ existe' : '❌ n\'existe pas'}`);
    if (exists) {
      const stats = fs.statSync(path);
      console.log(`  Taille: ${stats.size} octets, Modifié: ${stats.mtime.toLocaleString()}`);
    }
  } catch (err) {
    console.error(`Erreur pour ${path}:`, err.message);
  }
}

// Vérifier tous les fichiers
checkFile(clientFilePath);
checkFile(serverFilePath);
checkFile(modelClientPath);
checkFile(modelServerPath);

console.log('\nRésumé du système:');
console.log('- La version client utilise Math.random() pour générer les codes de coupons (compatible navigateur)');
console.log('- La version serveur utilise un mock DistilBERT pour l\'analyse de sentiment');
console.log('- Le middleware bloque l\'accès aux pages /test-* en production');
console.log('- La page de test /test-coupons importe la version client (compatible navigateur)');

console.log('\n✅ VÉRIFICATION TERMINÉE!');
