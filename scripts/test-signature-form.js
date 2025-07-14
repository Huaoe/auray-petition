#!/usr/bin/env node

/**
 * Script de test pour le formulaire de signature
 * Teste l'API POST /api/signatures avec les nouvelles données
 */

const testSignatureSubmission = async () => {
  console.log('🧪 Test du formulaire de signature...\n');

  // Données de test
  const testSignature = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    city: 'Auray',
    postalCode: '56400',
    comment: 'Test de signature automatique',
    rgpdConsent: true,
    newsletterConsent: false,
    timestamp: new Date().toISOString(),
    userAgent: 'Test Script/1.0'
  };

  try {
    console.log('📤 Envoi de la signature de test...');
    console.log('Données:', JSON.stringify(testSignature, null, 2));

    const response = await fetch('http://localhost:3000/api/signatures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testSignature)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Signature ajoutée avec succès !');
      console.log('Réponse:', JSON.stringify(result, null, 2));
      
      // Test de récupération des statistiques
      console.log('\n📊 Test de récupération des statistiques...');
      const statsResponse = await fetch('http://localhost:3000/api/signatures');
      const statsResult = await statsResponse.json();
      
      if (statsResponse.ok) {
        console.log('✅ Statistiques récupérées avec succès !');
        console.log('Statistiques:', JSON.stringify(statsResult, null, 2));
      } else {
        console.log('❌ Erreur lors de la récupération des statistiques');
        console.log('Erreur:', statsResult);
      }
    } else {
      console.log('❌ Erreur lors de l\'ajout de la signature');
      console.log('Status:', response.status);
      console.log('Erreur:', result);
    }

  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('\n💡 Assurez-vous que le serveur Next.js est démarré avec: yarn dev');
  }
};

// Fonction de test de validation
const testValidation = async () => {
  console.log('\n🔍 Test de validation des données...\n');

  const invalidTests = [
    {
      name: 'Email manquant',
      data: { firstName: 'Jean', lastName: 'Dupont', city: 'Auray', postalCode: '56400', rgpdConsent: true }
    },
    {
      name: 'Consentement RGPD manquant',
      data: { firstName: 'Jean', lastName: 'Dupont', email: 'test@example.com', city: 'Auray', postalCode: '56400' }
    },
    {
      name: 'Code postal invalide',
      data: { firstName: 'Jean', lastName: 'Dupont', email: 'test@example.com', city: 'Auray', postalCode: '123', rgpdConsent: true }
    },
    {
      name: 'Email invalide',
      data: { firstName: 'Jean', lastName: 'Dupont', email: 'email-invalide', city: 'Auray', postalCode: '56400', rgpdConsent: true }
    }
  ];

  for (const test of invalidTests) {
    try {
      console.log(`🧪 Test: ${test.name}`);
      const response = await fetch('http://localhost:3000/api/signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.data)
      });

      const result = await response.json();
      
      if (response.status === 400) {
        console.log(`✅ Validation correcte - ${result.error}`);
      } else {
        console.log(`❌ Validation échouée - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Erreur de test: ${error.message}`);
    }
    console.log('');
  }
};

// Exécution des tests
const runTests = async () => {
  console.log('🚀 Démarrage des tests du formulaire de signature\n');
  console.log('=' .repeat(50));
  
  await testSignatureSubmission();
  await testValidation();
  
  console.log('=' .repeat(50));
  console.log('✨ Tests terminés !');
};

// Vérifier si le script est exécuté directement
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testSignatureSubmission, testValidation };
