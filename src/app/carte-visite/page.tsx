"use client";

import { useState, useEffect } from "react";
import QRBusinessCard from "@/components/QRBusinessCard";
import Header from "@/components/Header";
import { ArrowLeft, Info, Settings } from "lucide-react";
import Link from "next/link";

const BusinessCardPage = () => {
  const [customUrl, setCustomUrl] = useState("");
  const [customTitle, setCustomTitle] = useState("Pétition Auray");
  const [customDescription, setCustomDescription] = useState("Régulation des sonneries de cloches");
  const [cardsPerSheet, setCardsPerSheet] = useState(8);
  const [showSettings, setShowSettings] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState("");

  // Set the current origin after component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  const finalUrl = customUrl || currentOrigin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            Créez et imprimez des cartes de visite avec QR code pour partager facilement 
            la pétition et mobiliser votre entourage.
          </p>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Comment utiliser les cartes de visite ?</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• <strong>Imprimez</strong> : Choisissez le nombre de cartes par feuille A4</li>
                <li>• <strong>Découpez</strong> : Suivez les lignes pour séparer les cartes</li>
                <li>• <strong>Distribuez</strong> : Donnez-les à vos amis, famille, collègues</li>
                <li>• <strong>Scannez</strong> : Le QR code redirige directement vers la pétition</li>
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
            {showSettings ? 'Masquer' : 'Personnaliser'} les paramètres
          </button>

          {showSettings && (
            <div className="mt-4 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Personnalisation</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL personnalisée (optionnel)
                  </label>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder={currentOrigin}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Laissez vide pour utiliser l'URL actuelle
                  </p>
                </div>

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
                    <option value={10}>10 cartes (compactes)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la carte
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* QR Business Card Component */}
        <QRBusinessCard
          url={finalUrl}
          title={customTitle}
          description={customDescription}
          cardsPerSheet={cardsPerSheet}
        />

        {/* Usage Tips */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-4">💡 Conseils d'utilisation</h3>
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
