"use client";

import { useState, useEffect } from "react";
import QRBusinessCard from "@/components/QRBusinessCard";
import Header from "@/components/Header";
import { ArrowLeft, Info, Settings } from "lucide-react";
import Link from "next/link";

const BusinessCardPage = () => {
  const [customUrl, setCustomUrl] = useState("");
  const [customTitle, setCustomTitle] = useState("Pétition Auray");
  const [customDescription, setCustomDescription] = useState(
    "Régulation des sonneries de cloches"
  );
  const [cardsPerSheet, setCardsPerSheet] = useState(8);
  const [showSettings, setShowSettings] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState("");

  // Set the current origin after component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  const finalUrl = customUrl || currentOrigin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Header />
      <div className="container  p-0 m-0 sm:mx-auto  sm:px-4 sm:py-8 sm:max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cartes de Visite QR Code
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Créez et imprimez des cartes de visite avec QR code pour partager
            facilement la pétition et mobiliser votre entourage.
          </p>
        </div>

        {/* Context Section */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 rounded-full p-2 flex-shrink-0">
              <span className="text-red-600 text-xl">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-red-900 mb-3">
                Pourquoi cette pétition est-elle importante ?
              </h3>
              <div className="text-red-800 space-y-3 text-sm">
                <p>
                  <strong>Le problème :</strong> Les sonneries de l'église Saint-Gildas d'Auray 
                  perturbent la qualité de vie des habitants avec des horaires excessifs.
                </p>
                <div className="bg-red-100 border border-red-300 rounded p-3">
                  <p className="font-bold text-red-900 mb-2">📊 Répartition religieuse en France :</p>
                  <ul className="text-xs space-y-1">
                    <li>• <strong>56%</strong> non-croyants (IFOP 2023)</li>
                    <li>• <strong>29%</strong> catholiques dont <strong>1,5%</strong> messe hebdomadaire (INSEE 2021)</li>
                    <li>• <strong>8%</strong> musulmans</li>
                    <li>• <strong>2-3%</strong> protestants</li>
                    <li>• <strong>1%</strong> juifs</li>
                  </ul>
                </div>
                <p>
                  <strong>Le paradoxe :</strong> Une minorité de <span className="font-bold text-red-700">1,5% de pratiquants </span> 
                  impose ses horaires à 100% des riverains, dont 56% de non-croyants.
                </p>
                <p>
                  <strong>Notre demande :</strong> Des horaires raisonnables qui respectent 
                  à la fois la tradition religieuse et la tranquillié publique.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Comment utiliser les cartes de visite ?
              </h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>
                  • <strong>Imprimez</strong> : Choisissez le nombre de cartes
                  par feuille A4
                </li>
                <li>
                  • <strong>Découpez</strong> : Suivez les lignes pour séparer
                  les cartes
                </li>
                <li>
                  • <strong>Distribuez</strong> : Donnez-les à vos amis,
                  famille, collègues
                </li>
                <li>
                  • <strong>Scannez</strong> : Le QR code redirige directement
                  vers la pétition
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="mb-8">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            {showSettings ? "Masquer" : "Personnaliser"} les paramètres
          </button>

          {showSettings && (
            <div className="mt-4 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Personnalisation
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cartes par feuille A4
                </label>
                <select
                  value={cardsPerSheet}
                  onChange={(e) => setCardsPerSheet(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value={4}>4 cartes (grandes)</option>
                  <option value={6}>6 cartes (moyennes)</option>
                  <option value={8}>8 cartes (standard)</option>
                  <option value={100}>100 cartes (compactes)</option>
                  <option value={500}>500 cartes (compactes)</option>
                  <option value={1000}>1000 cartes (compactes)</option>
                  <option value={5000}>5000 cartes (compactes)</option>
                  <option value={7000}>7000 cartes (compactes)</option>
                  <option value={5000}>5000 cartes (compactes)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* QR Business Card Component */}
        <QRBusinessCard
          url={finalUrl}
          description={customDescription}
          cardsPerSheet={cardsPerSheet}
        />

        {/* Usage Tips */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-4">
            💡 Conseils d'utilisation
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-green-800">
            <div>
              <h4 className="font-medium mb-2">Où distribuer les cartes ?</h4>
              <ul className="text-sm space-y-1">
                <li>• Commerces locaux d'Auray</li>
                <li>• Marchés et événements</li>
                <li>• Boîtes aux lettres (avec autorisation)</li>
                <li>• Réunions de quartier</li>
                <li>• Associations locales</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Conseils d'impression</h4>
              <ul className="text-sm space-y-1">
                <li>• Utilisez du papier épais (200-300g/m²)</li>
                <li>• Imprimez en qualité élevée</li>
                <li>• Vérifiez que le QR code est lisible</li>
                <li>• Découpez proprement aux ciseaux</li>
                <li>• Testez le scan avant distribution</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Link
            href="/#petition"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Signer la pétition maintenant
          </Link>
          <p className="text-sm text-gray-600 mt-2">
            Signez d'abord, puis partagez avec vos cartes de visite !
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessCardPage;
