"use client";

import { useState, useEffect } from "react";
import SignatureForm from "@/components/SignatureForm";
import { Bell, Clock, Users, MapPin } from "lucide-react";
import Header from "@/components/Header";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { RealTimeSignatureCounter } from "@/components/RealTimeSignatureCounter";

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
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Bell className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Régulons les Cloches d'
            <span className="text-green-600">Auray</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Pour un équilibre entre tradition et tranquillité. 
            Demandons des horaires raisonnables : <strong>7h à 22h</strong>
          </p>
          
          {/* Statistiques temps réel */}
          <div className="flex justify-center mb-12">
            <RealTimeSignatureCounter />
          </div>
        </div>
      </section>

      {/* Problématique Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Le Problème à Auray
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              L'église Saint-Gildas sonne toutes les 15 minutes, 24h/24, 
              perturbant le sommeil et la tranquillité de milliers d'habitants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-100">
              <Clock className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                24h/24 - 7j/7
              </h3>
              <p className="text-red-700">
                Sonneries toutes les 15 minutes, même la nuit
              </p>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-100">
              <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-orange-800 mb-2">
                ~3000 Habitants
              </h3>
              <p className="text-orange-700">
                Impactés dans un rayon de 500m autour de l'église
              </p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Centre-ville
              </h3>
              <p className="text-blue-700">
                Écoles, commerces, résidences seniors impactés
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Demande Section */}
      <section className="py-16 px-4 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl shadow-lg p-8 border border-blue-100">
            <h3 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-blue-700">
              Notre Demande
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-green-800 mb-3">
                    Horaires Raisonnables
                  </h4>
                  <p className="text-green-700">
                    Limitation des sonneries de 7h à 22h uniquement
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Bell className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-blue-800 mb-3">
                    Respect des Offices
                  </h4>
                  <p className="text-blue-700">
                    Maintien des sonneries pour les célébrations religieuses
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-purple-100 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-purple-800 mb-3">
                    Dialogue Constructif
                  </h4>
                  <p className="text-purple-700">
                    Concertation avec la paroisse et la municipalité
                  </p>
                </div>
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
                "Réveillée chaque nuit par les cloches de 2h du matin. 
                Mes enfants n'arrivent plus à dormir correctement."
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
                toutes les 15 minutes. C'est épuisant."
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
                "Ma grand-mère de 85 ans ne peut plus faire la sieste. 
                Les cloches la réveillent constamment."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-800 font-semibold">SM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sophie M.</p>
                  <p className="text-sm text-gray-600">Place de la République</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de signature */}
      <section id="petition" className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Signez la Pétition
            </h2>
            <p className="text-lg text-gray-600">
              Ensemble, demandons des horaires raisonnables pour les cloches d'Auray
            </p>
          </div>
          
          <SignatureForm onSuccess={handleSignatureSuccess} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Bell className="h-8 w-8 text-green-400" />
          </div>
          <p className="text-gray-400 mb-4">
            Pétition citoyenne pour la régulation des sonneries de l'église Saint-Gildas d'Auray
          </p>
          <p className="text-sm text-gray-500">
            Initiative citoyenne locale • Auray, Morbihan • 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
