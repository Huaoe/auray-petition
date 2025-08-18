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

  // Print sheet with multiple cards
  const PrintSheet = () => {
    const cardsArray = Array.from({ length: cardsPerSheet }, (_, i) => i);

    return (
      <div
        ref={printRef}
        className="print-sheet hidden print:block"
        style={{
          width: "210mm",
          height: "297mm", // A4 size
          padding: "10mm",
          margin: 0,
          backgroundColor: "white",
        }}
      >
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: `repeat(${Math.ceil(cardsPerSheet / 2)}, 1fr)`,
            height: "100%",
          }}
        >
          {cardsArray.map((index) => (
            <BusinessCard
              key={index}
              className="h-24 text-sm print:shadow-none print:border-gray-400"
            />
          ))}
        </div>

        {/* Cut lines indicators */}
        <style jsx>{`
          @media print {
            .print-sheet::after {
              content: "✂️ Découper le long des lignes";
              position: absolute;
              bottom: 5mm;
              left: 50%;
              transform: translateX(-50%);
              font-size: 8pt;
              color: #666;
            }
          }
        `}</style>
      </div>
    );
  };

  const handlePrint = () => {
    // Create print URL with cards count
    const printUrl = `/carte-visite/print/${cardsPerSheet}`;

    // Open print page in new window
    window.open(printUrl, "_blank");
  };

  const handleDownload = async () => {
    if (!qrCodeDataUrl) return;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size for business card (85.6mm x 53.98mm at 300 DPI)
      const cardWidth = 1012;
      const cardHeight = 638;
      canvas.width = cardWidth;
      canvas.height = cardHeight;

      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cardWidth, cardHeight);

      // Draw logo watermark
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.src = "/icons/logo.png";

      const drawCard = () => {
        // Draw logo watermark if available
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          ctx.save();
          ctx.globalAlpha = 0.05;
          const logoSize = 200;
          ctx.drawImage(
            logoImg,
            (cardWidth - logoSize) / 2,
            (cardHeight - logoSize) / 2,
            logoSize,
            logoSize
          );
          ctx.restore();
        }

        // Draw border
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, cardWidth - 40, cardHeight - 40);

        let yPos = 80;

        // Draw title and description
        ctx.fillStyle = "#f3f4f6";
        ctx.font = "bold 36px Arial";
        ctx.fillText(title, 40, yPos);
        yPos += 40;

        ctx.fillStyle = "#f3f4f6";
        ctx.font = "24px Arial";
        ctx.fillText(description, 40, yPos);
        yPos += 50;

        // Draw religious breakdown box (blue) - first
        ctx.fillStyle = "#eff6ff";
        ctx.fillRect(40, yPos - 20, cardWidth - 280, 50);
        ctx.strokeStyle = "#bfdbfe";
        ctx.lineWidth = 2;
        ctx.strokeRect(40, yPos - 20, cardWidth - 280, 50);

        ctx.fillStyle = "#1d4ed8";
        ctx.font = "bold 18px Arial";
        ctx.fillText(
          "🇫🇷 ✨ 29% catho ☪️ 8% musulmans 🟢 56% non-croyants",
          50,
          yPos
        );
        ctx.font = "16px Arial";
        ctx.fillText("(IFOP 2023)", 50, yPos + 20);
        yPos += 70;

        // Draw petition summary box (gray)
        ctx.fillStyle = "#f9fafb";
        ctx.fillRect(40, yPos - 20, cardWidth - 280, 50);
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 2;
        ctx.strokeRect(40, yPos - 20, cardWidth - 280, 50);

        ctx.fillStyle = "#374151";
        ctx.font = "bold 18px Arial";
        ctx.fillText(
          "Notre demande : Horaires raisonnables pour les",
          50,
          yPos
        );
        ctx.fillText(
          "sonneries de l'église Saint-Gildas d'Auray.",
          50,
          yPos + 20
        );
        yPos += 70;

        // Draw 1.5% statistics box (red) - last
        ctx.fillStyle = "#fef2f2";
        ctx.fillRect(40, yPos - 20, cardWidth - 280, 50);
        ctx.strokeStyle = "#fecaca";
        ctx.lineWidth = 2;
        ctx.strokeRect(40, yPos - 20, cardWidth - 280, 50);

        ctx.fillStyle = "#dc2626";
        ctx.font = "bold 18px Arial";
        ctx.fillText("📊 Seulement 1,5% va à la messe (INSEE 2021)", 50, yPos);
        yPos += 60;

        // Draw QR code
        const qrImg = new Image();
        qrImg.crossOrigin = "anonymous";
        qrImg.onload = () => {
          ctx.drawImage(qrImg, cardWidth - 200, 80, 140, 140);

          // Draw footer
          ctx.strokeStyle = "#e5e7eb";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(40, yPos);
          ctx.lineTo(cardWidth - 40, yPos);
          ctx.stroke();

          yPos += 30;
          ctx.fillStyle = "#6b7280";
          ctx.font = "bold 20px Arial";
          ctx.fillText("👆 Scannez pour signer", 40, yPos);

          ctx.font = "18px Arial";
          const hostname = currentUrl ? new URL(currentUrl).hostname : "";
          ctx.fillText(
            hostname,
            cardWidth - ctx.measureText(hostname).width - 40,
            yPos
          );

          // Draw eco-friendly message
          yPos += 20;
          ctx.fillStyle = "#9ca3af";
          ctx.font = "italic 14px Arial";
          const ecoMessage = "🌱 Ne pas jeter sur la voie publique";
          const ecoMessageWidth = ctx.measureText(ecoMessage).width;
          ctx.fillText(ecoMessage, (cardWidth - ecoMessageWidth) / 2, yPos);

          // Create download
          const link = document.createElement("a");
          link.download = `carte-visite-${title.toLowerCase().replace(/\s+/g, "-")}.png`;
          link.href = canvas.toDataURL("image/png", 1.0);
          link.click();
        };
        qrImg.src = qrCodeDataUrl;
      };

      // Load logo then draw card
      logoImg.onload = drawCard;
      logoImg.onerror = drawCard;

      if (logoImg.complete) {
        drawCard();
      }
    } catch (error) {
      console.error("Erreur téléchargement:", error);
    }
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
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-gray-900">Carte de Visite QR</h3>
      </div>

      {/* Preview Card */}
      <div className="mb-6">
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

      {/* Hidden print content */}
      <PrintSheet />
    </div>
  );
};

export default QRBusinessCard;
