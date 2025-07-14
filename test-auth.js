
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Lire le fichier .env.local manuellement
function loadEnvLocal() {
  const envPath = path.join(__dirname, '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Fichier .env.local non trouvé');
    return {};
  }
  
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      let value = valueParts.join('=');
      
      // Enlever les guillemets si présents
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      env[key] = value;
    }
  });
  
  return env;
}

async function testAuth() {
  console.log('🔍 Test Google Sheets Authentication...\n');
  
  // Charger les variables d'environnement
  const env = loadEnvLocal();
  
  // Vérifier les variables d'environnement
  console.log('📋 Variables d\'environnement:');
  console.log('CLIENT_EMAIL:', env.GOOGLE_SHEETS_CLIENT_EMAIL ? '✅ Définie' : '❌ Manquante');
  console.log('PRIVATE_KEY:', env.GOOGLE_SHEETS_PRIVATE_KEY ? '✅ Définie (longueur: ' + env.GOOGLE_SHEETS_PRIVATE_KEY?.length + ')' : '❌ Manquante');
  console.log('SHEET_ID:', env.GOOGLE_SHEETS_SHEET_ID ? '✅ Définie' : '❌ Manquante');
  console.log();

  if (!env.GOOGLE_SHEETS_CLIENT_EMAIL || !env.GOOGLE_SHEETS_PRIVATE_KEY || !env.GOOGLE_SHEETS_SHEET_ID) {
    console.error('❌ Variables d\'environnement manquantes');
    return;
  }

  console.log('📧 Service Account Email:', env.GOOGLE_SHEETS_CLIENT_EMAIL);
  console.log('🆔 Sheet ID:', env.GOOGLE_SHEETS_SHEET_ID);
  console.log();

  try {
    // Test authentification
    console.log('🔐 Test authentification...');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    
    console.log('✅ Authentification réussie');
    
    // Test accès au spreadsheet
    console.log('📊 Test accès au spreadsheet...');
    const response = await sheets.spreadsheets.get({
      spreadsheetId: env.GOOGLE_SHEETS_SHEET_ID,
    });
    
    console.log('✅ Accès au spreadsheet réussi');
    console.log('📄 Nom du spreadsheet:', response.data.properties.title);
    console.log('🔗 URL:', `https://docs.google.com/spreadsheets/d/${env.GOOGLE_SHEETS_SHEET_ID}`);
    
    // Lister les feuilles
    console.log('\n📋 Feuilles disponibles:');
    response.data.sheets.forEach(sheet => {
      console.log(`  - ${sheet.properties.title}`);
    });
    
    // Test d'écriture simple
    console.log('\n✍️ Test d\'écriture...');
    await sheets.spreadsheets.values.append({
      spreadsheetId: env.GOOGLE_SHEETS_SHEET_ID,
      range: 'Sheet1!A:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['TEST', 'AUTH', 'test@example.com', '12345', 'Test auth script', 'Non', new Date().toISOString(), 'test-ip']]
      }
    });
    
    console.log('✅ Test d\'écriture réussi !');
    console.log('\n🎉 TOUT FONCTIONNE ! Le problème vient d\'ailleurs...');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('📍 Code d\'erreur:', error.code);
    
    if (error.code === 401) {
      console.log('\n🔧 Solutions pour erreur 401:');
      console.log('1. Service Account supprimé ou désactivé');
      console.log('2. Clé privée expirée ou corrompue');
      console.log('3. Projet Google Cloud désactivé');
      console.log('4. API Google Sheets désactivée');
    }
    
    if (error.code === 403) {
      console.log('\n🔧 Solutions pour erreur 403:');
      console.log('1. Sheet non partagé avec:', env.GOOGLE_SHEETS_CLIENT_EMAIL);
      console.log('2. Permissions insuffisantes (doit être Éditeur)');
    }
    
    if (error.code === 404) {
      console.log('\n🔧 Solutions pour erreur 404:');
      console.log('1. Sheet ID incorrect');
      console.log('2. Sheet supprimé');
    }
  }
}

testAuth();
