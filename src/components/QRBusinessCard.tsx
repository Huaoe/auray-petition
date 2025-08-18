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

const QRBusinessCard: React.FC<QRBusinessCardProps> = ({
  url,
  title = "Pétition Auray",
  description = "Régulation des sonneries de cloches",
  cardsPerSheet = 8
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>(url || "");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Set the URL after component mounts (client-side only)
  useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin);
    } else if (url) {
      setCurrentUrl(url);
    }
  }, [url]);

  // Generate QR code
  const generateQRCode = async () => {
    if (!currentUrl) return;
    
    try {
      setIsGenerating(true);
      const qrDataUrl = await QRCode.toDataURL(currentUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: "#16a34a", // Green-600
          light: "#ffffff"
        },
        errorCorrectionLevel: "M"
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error("Erreur génération QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (currentUrl) {
      generateQRCode();
    }
  }, [currentUrl]);

  // Single business card component
  const BusinessCard = ({ className = "" }: { className?: string }) => (
    <div className={`bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <div className="ml-3">
          {qrCodeDataUrl && (
            <img 
              src={qrCodeDataUrl} 
              alt="QR Code" 
              className="w-16 h-16 border border-gray-200 rounded"
            />
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Scannez pour signer</span>
          <div className="flex items-center gap-1">
            <QrCode className="w-3 h-3" />
            <span className="font-mono">{currentUrl ? new URL(currentUrl).hostname : ''}</span>
          </div>
        </div>
      </div>
    </div>
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
          backgroundColor: "white"
        }}
      >
        <div 
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: `repeat(${Math.ceil(cardsPerSheet / 2)}, 1fr)`,
            height: "100%"
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
    const printContent = printRef.current;
    if (!printContent) return;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cartes de Visite - ${title}</title>
          <style>
            @media print {
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: system-ui, -apple-system, sans-serif; }
              .print-sheet { display: block !important; }
              .hidden { display: none !important; }
            }
            body { margin: 0; padding: 0; }
            .print-sheet {
              width: 210mm;
              height: 297mm;
              padding: 10mm;
              margin: 0;
              background-color: white;
              position: relative;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              grid-template-rows: repeat(${Math.ceil(cardsPerSheet / 2)}, 1fr);
              gap: 12px;
              height: 100%;
            }
            .card {
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 8px;
              padding: 16px;
              height: 96px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .card-header {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              margin-bottom: 12px;
            }
            .card-content {
              flex: 1;
            }
            .card-title {
              font-weight: bold;
              font-size: 18px;
              color: #111827;
              line-height: 1.2;
              margin: 0;
            }
            .card-description {
              font-size: 14px;
              color: #6b7280;
              margin: 4px 0 0 0;
            }
            .qr-code {
              width: 64px;
              height: 64px;
              border: 1px solid #e5e7eb;
              border-radius: 4px;
              margin-left: 12px;
            }
            .card-footer {
              border-top: 1px solid #e5e7eb;
              padding-top: 12px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 12px;
              color: #6b7280;
            }
            .footer-right {
              display: flex;
              align-items: center;
              gap: 4px;
              font-family: monospace;
            }
            .cut-instructions {
              position: absolute;
              bottom: 5mm;
              left: 50%;
              transform: translateX(-50%);
              font-size: 10pt;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="print-sheet">
            <div class="grid">
              ${Array.from({ length: cardsPerSheet }, () => `
                <div class="card">
                  <div class="card-header">
                    <div class="card-content">
                      <h3 class="card-title">${title}</h3>
                      <p class="card-description">${description}</p>
                    </div>
                    <img src="${qrCodeDataUrl}" alt="QR Code" class="qr-code" />
                  </div>
                  <div class="card-footer">
                    <span>Scannez pour signer</span>
                    <div class="footer-right">
                      <span>⚡</span>
                      <span>${new URL(url).hostname}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="cut-instructions">
              ✂️ Découper le long des lignes pour obtenir ${cardsPerSheet} cartes de visite
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Wait for images to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleDownload = async () => {
    if (!qrCodeDataUrl) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size for business card (85.6mm x 53.98mm at 300 DPI)
      canvas.width = 1012; // 85.6mm * 300 DPI / 25.4
      canvas.height = 638;  // 53.98mm * 300 DPI / 25.4

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Draw title
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 48px system-ui';
      ctx.fillText(title, 60, 120);

      // Draw description
      ctx.fillStyle = '#6b7280';
      ctx.font = '32px system-ui';
      ctx.fillText(description, 60, 170);

      // Draw QR code
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, canvas.width - 220, 60, 160, 160);

        // Draw footer text
        ctx.fillStyle = '#6b7280';
        ctx.font = '24px system-ui';
        ctx.fillText('Scannez pour signer', 60, canvas.height - 80);
        
        ctx.font = '20px monospace';
        ctx.fillText(currentUrl ? new URL(currentUrl).hostname : '', 60, canvas.height - 40);

        // Download
        const link = document.createElement('a');
        link.download = `carte-visite-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      qrImg.src = qrCodeDataUrl;

    } catch (error) {
      console.error('Erreur téléchargement:', error);
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
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(currentUrl);
      alert('Lien copié dans le presse-papiers !');
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
        <BusinessCard className="max-w-sm mx-auto" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <QrCode className="w-4 h-4" />
          {showPreview ? 'Masquer' : 'Aperçu'} Impression
        </button>

        <button
          onClick={handlePrint}
          disabled={isGenerating || !qrCodeDataUrl}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Printer className="w-4 h-4" />
          Imprimer ({cardsPerSheet} cartes)
        </button>

        <button
          onClick={handleDownload}
          disabled={isGenerating || !qrCodeDataUrl}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Télécharger
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Partager
        </button>
      </div>

      {/* Print Preview */}
      {showPreview && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">
            Aperçu d'impression ({cardsPerSheet} cartes par feuille A4)
          </h4>
          <div 
            className="bg-white border border-gray-300 mx-auto overflow-hidden"
            style={{
              width: "210px", // A4 scale preview
              height: "297px",
              transform: "scale(0.8)",
              transformOrigin: "top center"
            }}
          >
            <div 
              className="grid gap-1 p-2 h-full"
              style={{
                gridTemplateColumns: "repeat(2, 1fr)",
                gridTemplateRows: `repeat(${Math.ceil(cardsPerSheet / 2)}, 1fr)`
              }}
            >
              {Array.from({ length: cardsPerSheet }, (_, i) => (
                <div key={i} className="bg-gray-100 border border-gray-300 rounded text-xs p-1">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 truncate">{title}</div>
                      <div className="text-gray-600 text-xs truncate">{description}</div>
                    </div>
                    <div className="w-4 h-4 bg-green-200 rounded ml-1 flex-shrink-0"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Aperçu réduit - La version imprimée sera en taille réelle
          </p>
        </div>
      )}

      {/* Hidden print content */}
      <PrintSheet />
    </div>
  );
};

export default QRBusinessCard;
