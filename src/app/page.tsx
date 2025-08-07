"use client";

import { useState, useEffect } from "react";
import SignatureForm from "@/components/SignatureForm";
import { Coffee } from "lucide-react"; // Import the Coffee icon
import { AnimatedGradient } from "@/components/ui/animated-gradient"; // Import the new component
import Header from "@/components/Header"; // Import the new Header component
import { AnimatedCounter } from "@/components/ui/animated-counter"; // Import animated counter
import { RealTimeSignatureCounter } from "@/components/RealTimeSignatureCounter"; // Import real-time counter

interface Statistics {
  totalSignatures: number;
  daysActive: number;
  approvalRate: number;
}

interface DynamicStats {
  generations: number;
  users: number;
  avgTime: number;
  popularity: number;
}

const HomePage = () => {
  // État des statistiques
  const [stats, setStats] = useState<Statistics>({
    totalSignatures: 0,
    daysActive: 1,
    approvalRate: 0,
  });

  // État des statistiques dynamiques
  const [dynamicStats, setDynamicStats] = useState<DynamicStats>({
    generations: 42,
    users: 15,
    avgTime: 4.2,
    popularity: 1,
  });

  const [showConfetti, setShowConfetti] = useState(false);

  // Charger les statistiques au montage
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Animation des compteurs dynamiques
  useEffect(() => {
    const interval = setInterval(
      () => {
        setDynamicStats((prev) => ({
          generations: prev.generations + Math.floor(Math.random() * 3) + 1, // +1 à +3
          users: prev.users + (Math.random() > 0.7 ? 1 : 0), // Nouvel utilisateur parfois
          avgTime: Math.max(3, prev.avgTime + (Math.random() - 0.5) * 0.3), // Fluctuation du temps
          popularity: Math.min(
            100,
            prev.popularity + (Math.random() > 0.8 ? 1 : 0)
          ), // Popularité croissante
        }));
      },
      2000 + Math.random() * 3000
    ); // Intervalle aléatoire entre 2-5 secondes

    return () => clearInterval(interval);
  }, []);

  // Set body background to transparent for the gradient effect
  useEffect(() => {
    document.body.style.backgroundColor = "transparent";
    // Cleanup function to reset the background color when the component unmounts
    return () => {
      document.body.style.backgroundColor = ""; // Or set it back to the default color
    };
  }, []);

  const fetchStatistics = async () => {
    try {
      console.log("🔄 Chargement des statistiques...");
      const response = await fetch("/api/signatures");

      if (response.ok) {
        const data = await response.json();
        console.log("📊 Données reçues:", data);

        if (data.success && data.statistics) {
          setStats(data.statistics);
          console.log("✅ Statistiques mises à jour:", data.statistics);
        } else {
          console.error("❌ Structure de données incorrecte:", data);
        }
      } else {
        console.error("❌ Erreur HTTP:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des statistiques:", error);
    }
  };

  // Callback pour mettre à jour les stats après signature
  const handleSignatureSuccess = () => {
    setShowConfetti(true);
    // Recharger les stats si pas fournies
    fetchStatistics();

    // Hide confetti after 3 seconds to prevent blocking interactions
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  return (
    <>
      <Header />
      <AnimatedGradient />
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Add confetti component here */}
        </div>
      )}
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto sm:px-0 md:px-4 lg:px-8 py-8">
          {/* Hero Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Pour une Régulation des Sonneries de Cloches à Auray
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Ensemble, trouvons un équilibre respectueux entre tradition
                religieuse et qualité de vie. Votre signature compte pour ouvrir
                le dialogue.
              </p>

              <button
                onClick={() =>
                  document
                    .getElementById("petition")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-green-800 transition-colors"
              >
                Signer la Pétition Maintenant
              </button>
            </div>
          </div>

          {/* Notre Demande Cards */}
          <div className="mb-12 relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-blue-500 h-1 w-32 rounded-full"></div>
            
            {/* Main container with gradient background */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl shadow-lg p-8 border border-blue-100">
              <h3 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-blue-700">
                Notre Demande
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-blue-400">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto transform hover:rotate-12 transition-transform">
                    <span className="text-3xl">🌙</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-center text-xl">
                    Limitation nocturne
                  </h4>
                  <p className="text-gray-600 text-center font-medium">(22h-9h)</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-orange-400">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto transform hover:rotate-12 transition-transform">
                    <span className="text-3xl">🔊</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-center text-xl">
                    Réduction de l'intensité sonore et la durée des sonneries
                  </h4>
                  <p className="text-gray-600 text-center font-medium">à 2 minutes</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-green-400">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto transform hover:rotate-12 transition-transform">
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-center text-xl">
                    Dialogue municipalité/citoyens
                  </h4>
                  <p className="text-gray-600 text-center font-medium">
                    Concertation et solutions équilibrées
                  </p>
                </div>
              </div>
              
              {/* Bottom decorative element */}
              <div className="mt-8 text-center">
                <span className="inline-block px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                  respectable
                </span>
              </div>
            </div>
          </div>
          {/* Real-time Signature Counter */}
          <div className="mb-8">
            <RealTimeSignatureCounter
              initialStats={stats}
              updateInterval={30000}
              showTrend={true}
              compact={false}
            />
          </div>

          {/* Petition Form Card */}
          <div
            id="petition"
            className="bg-white rounded-2xl shadow-lg lg:p-8 mb-8"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold rounded-full  text-gray-900 mb-4 flex items-center justify-center gap-3">
                <img
                  src="/icons/icons/manifest-icon-192.maskable.png"
                  alt="Icône pétition"
                  className="w-32 h-32 rounded-full animate-pulse-glow hover:animate-vibrate transition-all duration-300 cursor-pointer ml-12"
                />
                Signez la Pétition
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Votre signature sera transmise au conseil municipal d'Auray et
                aux autorités compétentes. Ensemble, ouvrons le dialogue pour
                une solution équilibrée.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 lg:gap-8">
              {/* Confidentialité Card */}
              <div className="lg:col-span-1">
                <div className="bg-green-50 rounded-xl p-6 border border-green-100 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-lg">🔒</span>
                    </div>
                    <h4 className="ml-3 text-lg font-semibold text-gray-900">
                      Confidentialité
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Vos données sont protégées (RGPD). Seules les statistiques
                    globales sont publiques. Transparence totale sur
                    l'utilisation.
                  </p>{" "}
                  {/* Buy Me a Coffee Card */}
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100 mt-8">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Coffee className="text-yellow-600" />
                      </div>
                      <h4 className="ml-3 text-lg font-semibold text-gray-900">
                        Soutenir le projet
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Si cette initiative vous est utile, vous pouvez offrir un
                      café pour aider à couvrir les frais techniques.
                    </p>
                    <a
                      href="https://buymeacoffee.com/huaoe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                    >
                      <Coffee className="mr-2 h-4 w-4" />
                      Offrir un café
                    </a>
                  </div>
                </div>
              </div>

              {/* Formulaire */}
              <div className="lg:col-span-3">
                <div className="bg-gray-50 rounded-xl lg:p-6">
                  <SignatureForm onSuccess={handleSignatureSuccess} />
                </div>
              </div>
            </div>
          </div>

          {/* Context & Proposition Cards */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Contexte Card */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="ml-4 text-2xl font-bold text-gray-900">
                  Comprendre le Contexte
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Les sonneries quotidiennes de l'Église Saint-Gildas impactent
                significativement la qualité de vie des résidents,
                particulièrement ceux vivant à proximité immédiate du
                centre-ville.
              </p>
            </div>

            {/* Proposition Card */}
            <div className="bg-green-50 rounded-xl shadow-md p-8 border border-green-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="ml-4 text-2xl font-bold text-gray-900">
                  Notre Proposition
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Établir un dialogue constructif pour définir des créneaux
                horaires respectueux, préservant à la fois la tradition
                religieuse et la tranquillité publique.
              </p>
              <div className="text-center">
                <a
                  href="/contexte"
                  className="inline-flex items-center text-green-700 font-semibold hover:text-green-800 transition-colors"
                >
                  En savoir plus
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          </div>
          {/* Statistiques Dynamiques en Temps Réel */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">
                🚀 Activité en Temps Réel
              </h3>
              <p className="text-purple-100">
                Notre plateforme révolutionnaire transforme l'engagement citoyen
                en respectant son patrimoine architectural.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Générations */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👁️</span>
                </div>
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter
                    value={dynamicStats.generations}
                    duration={1500}
                  />
                </div>
                <div className="text-sm text-purple-100 font-medium">
                  Générations
                </div>
              </div>

              {/* Utilisateurs */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter value={dynamicStats.users} duration={1200} />
                </div>
                <div className="text-sm text-purple-100 font-medium">
                  Utilisateurs
                </div>
              </div>

              {/* Temps Moyen */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⏱️</span>
                </div>
                <div className="text-3xl font-bold mb-1">
                  {dynamicStats.avgTime.toFixed(1)}s
                </div>
                <div className="text-sm text-purple-100 font-medium">
                  Génération
                </div>
              </div>

              {/* Popularité */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="text-3xl font-bold mb-1">
                  #{dynamicStats.popularity}
                </div>
                <div className="text-sm text-purple-100 font-medium">
                  Populaire
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  Mise à jour en temps réel
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
