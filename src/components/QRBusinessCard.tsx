"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import { Download, Printer, Share2, QrCode } from "lucide-react";

interface QRBusinessCardProps {
  url?: string;
  title?: string;
  description?: string;
  cardsPerSheet?: number;
}

interface BusinessCardProps {
  className?: string;
  title?: string;
  description?: string;
  qrCodeUrl?: string;
}

// Standalone BusinessCard component for reuse
export const BusinessCard: React.FC<BusinessCardProps> = ({
  className = "",
  title = "auray-petition.vercel.app",
  description = "Régulation des sonneries de cloches",
  qrCodeUrl = "/icons/L6CvFd.svg"
}) => (
  <div
    className={`bg-white border-2 border-gray-200 rounded-lg p-3 shadow-sm relative overflow-hidden ${className}`}
  >
    {/* Logo watermark */}
    <div className="absolute inset-0 flex items-center justify-center opacity-9 pointer-events-none">
      <img src="/icons/logo.png" alt="Logo" className="object-contain" />
    </div>

    <div className="relative z-10">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 pr-2">
          <h3 className="font-bold text-base text-gray-100 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-gray-100 mt-1 underline">{description}</p>

          {/* Religious breakdown and eco message on same line */}
          <div className="flex items-start gap-2 mt-2">
            {/* Religious breakdown - 2/3 width */}
            <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 w-2/3">
              <p className="text-xs text-blue-700 font-medium leading-tight">
                ✝️ <strong>29%</strong> catholiques
              </p>
              <p className="text-xs text-blue-700 font-medium leading-tight">
                ☪️ <strong>8%</strong> musulmans
              </p>
              <p className="text-xs text-blue-700 font-medium leading-tight">
                🟢<strong>56%</strong> non-croyants
              </p>
              <p className="text-xs text-blue-600 mt-1">
                En France (IFOP 2023)
              </p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="w-32 h-32 rounded"
          />
        </div>
      </div>
      {/* Petition Summary */}
      <div className="mb-2 bg-gray-50 border border-gray-200 rounded px-2 py-1">
        <p className="text-xs text-gray-700 leading-tight">
          <strong>
            Notre demande : Horaires raisonnables pour les sonneries de l'église
            Saint-Gildas d'Auray.
          </strong>
        </p>
      </div>
      {/* Key Statistic - 1.5% only */}
      <div className="mb-2 bg-red-50 border border-red-200 rounded px-2 py-1 w-2/3">
        <p className="text-xs text-red-700 font-medium leading-tight">
          📊 Seulement <strong>1,5%</strong> de la population va à la messe
          hebdomadairement (INSEE 2021)
        </p>
      </div>{" "}
      {/* Eco message - remaining space */}
      <div className="flex-1">
        <p className="text-xs text-fontsize-2 text-gray-400 italic">
          🌱 Ne pas jeter sur la voie publique
        </p>
      </div>
    </div>
  </div>
);

const QRBusinessCard: React.FC<QRBusinessCardProps> = ({
  url,
  title = "auray-petition.vercel.app",
  description = "Régulation des sonneries de cloches",
  cardsPerSheet = 6,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] =
    useState<string>("/icons/L6CvFd.svg");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>(url || "");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Set the URL after component mounts (client-side only)
  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setCurrentUrl(window.location.origin);
    } else if (url) {
      setCurrentUrl(url);
    }
  }, [url]);

  // Use existing QR code image instead of generating
  useEffect(() => {
    setQrCodeDataUrl("/icons/L6CvFd.svg");
  }, []);

  // Use the exported BusinessCard component
  const LocalBusinessCard = ({ className = "" }: { className?: string }) => (
    <BusinessCard
      className={className}
      title={title}
      description={description}
      qrCodeUrl={qrCodeDataUrl}
    />
  );



  const handlePrint = () => {
    // Create print URL with cards count
    const printUrl = `/carte-visite/print/${cardsPerSheet}`;

    // Open print page in new window
    window.open(printUrl, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: currentUrl,
        });
      } catch (error) {
        console.log("Partage annulé");
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(currentUrl);
      alert("Lien copié dans le presse-papiers !");
    }
  }; 

  return (
    <div className="bg-white rounded-lg shadow-lg p-0 sm:p-6 border border-gray-200">
      <div className="flex items-center gap-3mb-6">
        <QrCode className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-gray-900">Carte de Visite QR</h3>
      </div>

      {/* Preview Card */}
      <div className="sm:mb-0 mb-6">
        <LocalBusinessCard className="max-w-sm mx-auto" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handlePrint}
          disabled={isGenerating || !qrCodeDataUrl}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Printer className="w-4 h-4" />
          Imprimer ({cardsPerSheet} cartes)
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Partager
        </button>
      </div>

    </div>
  );
};

export default QRBusinessCard;
