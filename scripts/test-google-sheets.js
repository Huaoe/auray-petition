// Script de test pour Google Sheets - Compatible Next.js ES modules
import { config } from 'dotenv';

// Charger les variables d'environnement
config({ path: '.env.local' });

console.log('🔧 Test de l\'intégration Google Sheets...\n');

// Test 1: Vérifier les variables d'environnement
console.log('1️⃣ Vérification des variables d\'environnement:');
const requiredEnvs = [
  'GOOGLE_SHEETS_CLIENT_EMAIL',
  'GOOGLE_SHEETS_PRIVATE_KEY', 
  'GOOGLE_SHEETS_SHEET_ID'
];

let allEnvsPresent = true;
for (const env of requiredEnvs) {
  const value = process.env[env];
  const status = value ? '✅ Défini' : '❌ Manquant';
  console.log(`   ${env}: ${status}`);
  
  if (!value) {
    allEnvsPresent = false;
    console.log(`   ⚠️  Veuillez configurer ${env} dans .env.local`);
  }
}

if (!allEnvsPresent) {
  console.log('\n❌ Configuration incomplète !');
  console.log('📝 Créez un fichier .env.local avec les variables manquantes.');
  console.log('💡 Copiez .env.example et remplissez les vraies valeurs.');
  console.log('\n📖 Guide rapide:');
  console.log('   1. Aller sur https://console.cloud.google.com');
  console.log('   2. Créer un projet et activer Google Sheets API');
  console.log('   3. Créer un Service Account et télécharger le JSON');
  console.log('   4. Extraire client_email et private_key du JSON');
  console.log('   5. Créer une Google Sheet et la partager avec client_email');
  process.exit(1);
}

// Test 2: Appel API local (si le serveur dev est lancé)
console.log('\n2️⃣ Test API locale (si yarn dev est lancé):');
async function testLocalAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/signatures');
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ API accessible');
      console.log('   📊 Données:', JSON.stringify(data, null, 2));
    } else {
      console.log('   ❌ API erreur:', response.status);
    }
  } catch (error) {
    console.log('   ⚠️  Serveur dev non démarré (yarn dev)');
    console.log('   💡 Lancez "yarn dev" dans un autre terminal pour tester l\'API');
  }
}

// Exécuter le test API
await testLocalAPI();

console.log('\n✅ Configuration vérifiée !');
console.log('🚀 Étapes suivantes:');
console.log('   1. Configurer .env.local avec vos vraies valeurs Google Sheets');
console.log('   2. Lancer "yarn dev"');
console.log('   3. Tester l\'application: http://localhost:3000');
