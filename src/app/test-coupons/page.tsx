"use client";

import { useState, useEffect } from "react";
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
  countReferralBonuses,
  type CouponLevel,
  type SignatureData,
  type EngagementDetails,
  COUPON_CONFIG
} from "@/lib/coupon-system-client";

type TestResult = {
  name: string;
  status: "success" | "error" | "pending" | "running";
  message: string;
  data?: any;
};

export default function TestCouponPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([
    "sentiment-rules", 
    "sentiment-ai", 
    "engagement", 
    "coupon-creation",
    "coupon-validation",
    "referral-system",
    "local-storage"
  ]);

  // Ajouter un résultat de test
  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  // Mettre à jour un résultat existant
  const updateResult = (name: string, update: Partial<TestResult>) => {
    setResults(prev => prev.map(r => 
      r.name === name ? { ...r, ...update } : r
    ));
  };

  // Tests d'analyse de sentiment (règles)
  const testSentimentRules = async () => {
    const testName = "sentiment-rules";
    addResult({
      name: testName,
      status: "running",
      message: "Test de l'analyse de sentiment par règles..."
    });

    try {
      const commentPositif = "J'adore cette initiative, c'est merveilleux!";
      const commentNegatif = "C'est une idée terrible, je déteste";
      
      const resultPositif = analyzeSentimentRules(commentPositif);
      const resultNegatif = analyzeSentimentRules(commentNegatif);
      
      if (resultPositif.sentiment !== 'positive') {
        throw new Error("Le commentaire positif n'a pas été détecté correctement");
      }
      
      if (resultNegatif.sentiment !== 'negative') {
        throw new Error("Le commentaire négatif n'a pas été détecté correctement");
      }
      
      updateResult(testName, {
        status: "success",
        message: "Analyse par règles validée ✓",
        data: { resultPositif, resultNegatif }
      });
    } catch (error) {
      updateResult(testName, {
        status: "error",
        message: `Erreur: ${error.message}`
      });
    }
  };

  // Tests d'analyse de sentiment (IA - DistilBERT)
  const testSentimentAI = async () => {
    const testName = "sentiment-ai";
    addResult({
      name: testName,
      status: "running",
      message: "Test de l'analyse de sentiment avec DistilBERT..."
    });

    try {
      const commentPositif = "J'adore cette initiative, c'est fantastique!";
      
      // Test du modèle DistilBERT
      const resultIA = await analyzeSentiment(commentPositif);
      
      if (!resultIA.sentiment || resultIA.score === undefined) {
        throw new Error("L'analyse IA n'a pas retourné les données attendues");
      }
      
      updateResult(testName, {
        status: "success",
        message: `Analyse IA réussie ✓ (${resultIA.sentiment}, score: ${resultIA.score.toFixed(2)})`,
        data: resultIA
      });
    } catch (error) {
      updateResult(testName, {
        status: "error",
        message: `Erreur: ${error.message}`
      });
    }
  };

  // Tests de calcul d'engagement
  const testEngagementCalculation = async () => {
    const testName = "engagement";
    addResult({
      name: testName,
      status: "running",
      message: "Test du calcul d'engagement..."
    });

    try {
      const donneesBase: SignatureData = {
        name: "Jean Test",
        email: "test@example.com",
        city: "Auray",
        postalCode: "56400"
      };
      
      // Test avec engagement minimal
      const engagementMinimal = await calculateEngagement(donneesBase);
      
      // Test avec engagement complet
      const donneesCompletes: SignatureData = {
        ...donneesBase,
        comment: "Je soutiens pleinement cette initiative exceptionnelle!",
        newsletter: true,
        socialShares: ["facebook", "twitter", "whatsapp"]
      };
      
      const engagementComplet = await calculateEngagement(donneesCompletes);
      
      if (engagementMinimal.score <= 0) {
        throw new Error("Le score d'engagement minimal devrait être positif");
      }
      
      if (engagementComplet.score <= engagementMinimal.score) {
        throw new Error("Le score d'engagement complet devrait être supérieur au score minimal");
      }
      
      updateResult(testName, {
        status: "success",
        message: `Calcul d'engagement validé ✓ (Base: ${engagementMinimal.score}, Complet: ${engagementComplet.score})`,
        data: { engagementMinimal, engagementComplet }
      });
    } catch (error) {
      updateResult(testName, {
        status: "error",
        message: `Erreur: ${error.message}`
      });
    }
  };

  // Tests de création des coupons
  const testCouponCreation = async () => {
    const testName = "coupon-creation";
    addResult({
      name: testName,
      status: "running",
      message: "Test de création des coupons..."
    });

    try {
      const engagementBasic: EngagementDetails = {
        details: {
          name: "Jean Dupont",
          email: "basic@example.com",
          city: "Auray"
        },
        score: 10,
        level: "BASIC"
      };
      
      const couponBasic = createCoupon(engagementBasic);
      
      const engagementChampion: EngagementDetails = {
        details: {
          name: "Marie Durand",
          email: "champion@example.com",
          city: "Auray",
          comment: "Superbe initiative!",
          newsletter: true,
          socialShares: ["facebook", "twitter", "linkedin"]
        },
        score: 50,
        level: "CHAMPION"
      };
      
      const couponChampion = createCoupon(engagementChampion);
      
      if (!couponBasic.code) {
        throw new Error("Le coupon BASIC n'a pas été créé correctement");
      }
      
      if (couponChampion.generationsLeft <= couponBasic.generationsLeft) {
        throw new Error("Le coupon CHAMPION devrait avoir plus de générations");
      }
      
      updateResult(testName, {
        status: "success",
        message: `Création de coupons validée ✓ (BASIC: ${couponBasic.generationsLeft} gen., CHAMPION: ${couponChampion.generationsLeft} gen.)`,
        data: { couponBasic, couponChampion }
      });
    } catch (error) {
      updateResult(testName, {
        status: "error",
        message: `Erreur: ${error.message}`
      });
    }
  };

  // Tests de validation des coupons
  const testCouponValidation = async () => {
    const testName = "coupon-validation";
    addResult({
      name: testName,
      status: "running",
      message: "Test de validation des coupons..."
    });

    try {
      // Création d'un coupon pour les tests
      const engagement: EngagementDetails = {
        details: {
          name: "Test User",
          email: "test@validation.com",
          city: "Test City"
        },
        score: 15,
        level: "BASIC"
      };
      
      const coupon = createCoupon(engagement);
      
      // Test de validation avec code valide
      const validationValide = validateCoupon(coupon.code);
      
      // Test avec code invalide
      const validationInvalide = validateCoupon("CODE-INVALIDE");
      
      // Test utilisation de génération
      const utilisation = useGeneration(coupon.code);
      
      if (!validationValide.valid) {
        throw new Error("Le code valide n'a pas été validé");
      }
      
      if (validationInvalide.valid) {
        throw new Error("Le code invalide ne devrait pas être validé");
      }
      
      if (!utilisation.valid) {
        throw new Error("L'utilisation d'une génération a échoué");
      }
      
      if (utilisation.coupon?.generationsLeft !== coupon.generationsLeft - 1) {
        throw new Error("Le nombre de générations n'a pas été décrémenté correctement");
      }
      
      updateResult(testName, {
        status: "success",
        message: "Validation des coupons réussie ✓",
        data: { validationValide, validationInvalide, utilisation }
      });
    } catch (error) {
      updateResult(testName, {
        status: "error",
        message: `Erreur: ${error.message}`
      });
    }
  };

  // Tests du système de parrainage
  const testReferralSystem = async () => {
    const testName = "referral-system";
    addResult({
      name: testName,
      status: "running",
      message: "Test du système de parrainage..."
    });

    try {
      // Génération de code de parrainage
      const email = "parrain@example.com";
      const referralCode = generateReferralCode(email);
      
      // Enregistrement de parrainage
      const recordSuccess = recordReferral("filleul@example.com", referralCode);
      
      // Comptage des bonus de parrainage
      const bonusCount = countReferralBonuses(email);
      
      if (!referralCode) {
        throw new Error("Le code de parrainage n'a pas été généré");
      }
      
      if (!recordSuccess) {
        throw new Error("L'enregistrement du parrainage a échoué");
      }
      
      if (bonusCount !== 1) {
        throw new Error(`Le comptage des bonus de parrainage a échoué (attendu: 1, reçu: ${bonusCount})`);
      }
      
      updateResult(testName, {
        status: "success",
        message: "Système de parrainage validé ✓",
        data: { referralCode, bonusCount }
      });
    } catch (error) {
      updateResult(testName, {
        status: "error",
        message: `Erreur: ${error.message}`
      });
    }
  };

  // Tests du stockage local
  const testLocalStorage = async () => {
    const testName = "local-storage";
    addResult({
      name: testName,
      status: "running",
      message: "Test du stockage local..."
    });

    try {
      // Création de coupons pour les tests
      const engagements: EngagementDetails[] = [
        {
          details: { name: "User 1", email: "user1@example.com", city: "City 1" },
          score: 10,
          level: "BASIC"
        },
        {
          details: { name: "User 2", email: "user2@example.com", city: "City 2" },
          score: 30,
          level: "ENGAGED"
        }
      ];
      
      const coupons = engagements.map(e => createCoupon(e));
      
      // Test de sauvegarde
      saveCoupons(coupons);
      
      // Test de chargement
      const loadedCoupons = loadCoupons();
      
      if (loadedCoupons.length !== coupons.length) {
        throw new Error(`Le nombre de coupons chargés ne correspond pas (attendu: ${coupons.length}, reçu: ${loadedCoupons.length})`);
      }
      
      updateResult(testName, {
        status: "success",
        message: `Stockage local validé ✓ (${loadedCoupons.length} coupons)`,
        data: { savedCoupons: coupons, loadedCoupons }
      });
    } catch (error) {
      updateResult(testName, {
        status: "error",
        message: `Erreur: ${error.message}`
      });
    }
  };

  // Exécuter tous les tests sélectionnés
  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    for (const test of selectedTests) {
      switch (test) {
        case "sentiment-rules":
          await testSentimentRules();
          break;
        case "sentiment-ai":
          await testSentimentAI();
          break;
        case "engagement":
          await testEngagementCalculation();
          break;
        case "coupon-creation":
          await testCouponCreation();
          break;
        case "coupon-validation":
          await testCouponValidation();
          break;
        case "referral-system":
          await testReferralSystem();
          break;
        case "local-storage":
          await testLocalStorage();
          break;
      }
    }

    setIsRunning(false);
  };

  // Toggle de sélection des tests
  const toggleTestSelection = (testName: string) => {
    setSelectedTests(prev => 
      prev.includes(testName) 
        ? prev.filter(t => t !== testName) 
        : [...prev, testName]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Test du Système de Coupons avec DistilBERT
      </h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Tests à exécuter</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "sentiment-rules", label: "Analyse sentiment (Règles)" },
            { id: "sentiment-ai", label: "Analyse sentiment (DistilBERT)" },
            { id: "engagement", label: "Calcul d'engagement" },
            { id: "coupon-creation", label: "Création de coupons" },
            { id: "coupon-validation", label: "Validation de coupons" },
            { id: "referral-system", label: "Système de parrainage" },
            { id: "local-storage", label: "Stockage local" },
          ].map(test => (
            <label 
              key={test.id} 
              className={`px-4 py-2 rounded-full cursor-pointer border ${
                selectedTests.includes(test.id) 
                  ? "bg-blue-100 border-blue-500" 
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedTests.includes(test.id)}
                onChange={() => toggleTestSelection(test.id)}
              />
              {test.label}
            </label>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <button
          onClick={runAllTests}
          disabled={isRunning || selectedTests.length === 0}
          className={`px-6 py-3 rounded-lg font-semibold ${
            isRunning || selectedTests.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isRunning 
            ? "Tests en cours..." 
            : `Exécuter ${selectedTests.length} test${selectedTests.length > 1 ? "s" : ""}`}
        </button>
      </div>
      
      <div className="space-y-4">
        {results.length === 0 && !isRunning && (
          <div className="p-4 bg-gray-100 rounded-lg text-gray-600">
            Aucun résultat. Cliquez sur "Exécuter tests" pour commencer.
          </div>
        )}
        
        {results.map((result, index) => (
          <div 
            key={`${result.name}-${index}`}
            className={`p-4 rounded-lg border ${
              result.status === "success" ? "bg-green-50 border-green-200" :
              result.status === "error" ? "bg-red-50 border-red-200" :
              "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <span 
                className={`w-4 h-4 rounded-full ${
                  result.status === "success" ? "bg-green-500" :
                  result.status === "error" ? "bg-red-500" :
                  "bg-yellow-500"
                }`}
              />
              <h3 className="font-semibold">
                {result.name === "sentiment-rules" ? "Analyse de sentiment (Règles)" :
                 result.name === "sentiment-ai" ? "Analyse de sentiment (DistilBERT)" :
                 result.name === "engagement" ? "Calcul d'engagement" :
                 result.name === "coupon-creation" ? "Création de coupons" :
                 result.name === "coupon-validation" ? "Validation de coupons" :
                 result.name === "referral-system" ? "Système de parrainage" :
                 result.name === "local-storage" ? "Stockage local" :
                 result.name}
              </h3>
              <span className="text-sm">
                {result.status === "running" ? "(en cours...)" : ""}
              </span>
            </div>
            
            <p className={`mt-2 ${
              result.status === "error" ? "text-red-600" : 
              result.status === "success" ? "text-green-600" : 
              "text-yellow-600"
            }`}>
              {result.message}
            </p>
            
            {result.status === "success" && result.data && (
              <div className="mt-3">
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 hover:underline">
                    Voir les détails
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-800 text-white overflow-x-auto rounded-md text-xs">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Résumé</h2>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex gap-6">
              <div>
                <span className="font-medium">Total:</span> {results.length}
              </div>
              <div>
                <span className="font-medium text-green-600">Réussite:</span> {results.filter(r => r.status === "success").length}
              </div>
              <div>
                <span className="font-medium text-red-600">Échec:</span> {results.filter(r => r.status === "error").length}
              </div>
              <div>
                <span className="font-medium text-yellow-600">En cours:</span> {results.filter(r => r.status === "running" || r.status === "pending").length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
