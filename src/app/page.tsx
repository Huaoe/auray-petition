"use client";

import { useState, useEffect } from "react";
import SignatureForm from "@/components/SignatureForm";
import { Clock, Users, MapPin } from "lucide-react";
import Header from "@/components/Header";
import { RealTimeSignatureCounter } from "@/components/RealTimeSignatureCounter";
import { AnimatedGradient } from "@/components/ui/animated-gradient";

interface Statistics {
  totalSignatures: number;
  daysActive: number;
  approvalRate: number;
}

const HomePage = () => {
  // État des statistiques
  const [stats, setStats] = useState<Statistics>({
    totalSignatures: 0,
    daysActive: 1,
    approvalRate: 0,
  });

  const [showConfetti, setShowConfetti] = useState(false);

  // Charger les statistiques au montage
  useEffect(() => {
    fetchStatistics();
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Header />
      <AnimatedGradient />
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Add confetti component here */}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Pour une Régulation des Sonneries de Cloches à
            <span className="text-green-600"> Auray</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ensemble, trouvons un équilibre respectueux entre tradition
            religieuse et qualité de vie. Votre signature compte pour ouvrir le
            dialogue.
          </p>

          {/* Statistiques temps réel */}
          <div className="flex justify-center mb-12">
            <RealTimeSignatureCounter />{" "}
            <div className="flex justify-center">
              <img
                src="/icons/logo.png"
                alt="Logo pétition Auray"
                className="h-96 w-96 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Button */}
      <section className="py-12 px-4 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <button
            onClick={() =>
              document
                .getElementById("petition")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-white text-green-700 px-12 py-6 rounded-full text-2xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 hover:bg-green-50 border-4 border-white"
          >
            📝 Signer la Pétition Maintenant
          </button>
          <p className="text-white mt-4 text-lg font-medium">
            Votre voix compte pour réguler les cloches d'Auray
          </p>
        </div>
      </section>

      {/* Contexte et Analyse Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Contexte : Religion et Laïcité en France
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Une approche équilibrée entre respect du patrimoine religieux et
              qualité de vie citoyenne
            </p>
          </div>

          {/* Statistiques Religion France */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              📊 Répartition Religieuse en France 2024
            </h3>
            
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-green-600 mb-2">56%</div>
                <p className="text-lg font-semibold text-gray-800 mb-1">Non-croyants/Athées</p>
                <p className="text-sm text-gray-500">Eurobaromètre 2024</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-purple-600 mb-2">29%</div>
                <p className="text-lg font-semibold text-gray-800 mb-1">Catholiques</p>
                <p className="text-lg font-semibold text-red-600">dont 1,5% messe hebdomadaire</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-4xl font-bold text-purple-600 mb-2">10%</div>
                <p className="text-lg font-semibold text-gray-800 mb-1">Musulmans</p>
                <p className="text-lg font-semibold text-red-600">2,1M pratiquants</p>
              </div>
            </div>

            {/* Statistiques détaillées */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                Répartition Religieuse Détaillée
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">🟢 Non-croyants/Athées</span>
                    <span className="font-bold text-green-600">56%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">✝️ Catholiques</span>
                    <span className="font-bold text-purple-600">29%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">☪️ Musulmans</span>
                    <span className="font-bold text-purple-600">10%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">⛪ Protestants</span>
                    <span className="font-bold text-blue-600">3%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">✡️ Juifs</span>
                    <span className="font-bold text-indigo-600">0,7%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">🕉️ Autres religions</span>
                    <span className="font-bold text-indigo-600">2,3%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>Sources :</strong> INSEE 2023, IFOP 2024, Pew Research 2024, Eurobaromètre 2024, 
                  Conseil Représentatif des Institutions Juives de France
                </p>
              </div>
            </div>
          </div>

          {/* Le Problème à Auray */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <div className="bg-red-50 rounded-xl p-8 border border-red-100">
              <h3 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                <Clock className="h-8 w-8 mr-3" />
                Le Problème Concret
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Sonneries de 15+ minutes, 7j/7, y compris la nuit</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Impact sur 10 000+ habitants du centre-ville</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Perturbation du sommeil, télétravail, santé</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Écoles, résidences seniors, commerces impactés</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-8 border border-green-100">
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <Users className="h-8 w-8 mr-3" />
                Notre Solution Équilibrée
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Respect de la tradition religieuse</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span>Horaires raisonnables : <strong>9h-21h</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span>Durée réduite : <strong>maximum 2 minutes</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Dialogue constructif avec toutes les parties</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Laïcité et Modernisation */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              ⚖️ Laïcité et Modernisation : Un Équilibre Nécessaire
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-purple-800 mb-4">
                  La Loi de 1905 : Un Cadre Centenaire
                </h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  La loi de séparation des Églises et de l'État, <strong>adoptée il y a
                  plus de 118 ans</strong>, établit la liberté de conscience tout en
                  garantissant le libre exercice des cultes.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Cependant, les réalités urbaines,
                  démographiques et sociales de 2025 nécessitent une adaptation
                  respectueuse de ces principes.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-800 mb-4">
                  Modernisation Respectueuse
                </h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Avec 56% de Français sans religion déclarée et une diversité
                  croissante, l'espace public doit concilier toutes les
                  sensibilités.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Notre démarche ne remet pas en cause la laïcité, mais propose
                  un
                  <strong> dialogue constructif</strong> pour adapter les
                  pratiques aux réalités contemporaines.
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
              <p className="text-center text-gray-800 font-medium italic">
                "La laïcité n'est pas l'ennemi de la religion, mais le garant de
                la coexistence pacifique de toutes les convictions dans l'espace
                public."
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                - Principe républicain français
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 text-center">
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
                <p className="text-gray-600 text-center font-medium">
                  (22h-9h)
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-orange-400">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto transform hover:rotate-12 transition-transform">
                  <span className="text-3xl">🔊</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-center text-xl">
                  Réduction de l'intensité sonore et la durée des sonneries
                </h4>
                <p className="text-gray-600 text-center font-medium">
                  à 2 minutes
                </p>
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
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Témoignages des Habitants
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-gray-700 mb-4 italic">
                "Réveillée chaque matin à 8h50 par les cloches alors que je
                travaille de nuit. Vous n'êtes pas tout seuls !"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-800 font-semibold">ML</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Marie L.</p>
                  <p className="text-sm text-gray-600">Centre-ville</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-gray-700 mb-4 italic">
                "En télétravail, impossible de se concentrer avec les sonneries
                qui durent 15 minutes. C'est épuisant..."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-800 font-semibold">PD</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Pierre D.</p>
                  <p className="text-sm text-gray-600">Rue du Château</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-gray-700 mb-4 italic">
                "Ma grand-mère de 85 ans ne peut plus faire la sieste. Les
                cloches la réveillent constamment. peut-on faire des pauses ?"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-800 font-semibold">SM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sophie M.</p>
                  <p className="text-sm text-gray-600">
                    Place de la République
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de signature */}
      <section
        id="petition"
        className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Signez la Pétition
            </h2>
            <p className="text-lg text-gray-600">
              Ensemble, demandons des horaires raisonnables pour les cloches
              d'Auray
            </p>
          </div>

          <SignatureForm onSuccess={handleSignatureSuccess} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/icons/logo.png"
              alt="Logo pétition Auray"
              className="h-8 w-8 object-contain"
            />
          </div>
          <p className="text-gray-400 mb-6">
            Pétition citoyenne pour la régulation des sonneries de l'église
            Saint-Gildas d'Auray
          </p>
          
          {/* Buy me a coffee button */}
          <div className="mb-6">
            <a
              href="https://www.buymeacoffee.com/auray-petition"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="text-xl">☕</span>
              <span>Soutenez cette initiative</span>
            </a>
            <p className="text-xs text-gray-500 mt-2">
              Aidez-nous à maintenir ce site et à organiser des actions citoyennes
            </p>
          </div>
          
          <p className="text-sm text-gray-500">
            Initiative citoyenne locale • Auray, Morbihan • 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
