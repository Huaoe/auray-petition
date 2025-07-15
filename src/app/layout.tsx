import { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://auray-petition.vercel.app"
  ),
  title: "Auray Pétition - Régulation des Sonneries de Cloches",
  description: `Signez la pétition citoyenne pour une régulation raisonnée des sonneries de l'Église Saint-Gildas. Un équilibre entre tradition religieuse et tranquillité publique.`,
  keywords: [
    "Auray",
    "pétition",
    "cloches",
    "sonneries",
    "église",
    "Saint-Gildas",
    "Alréens",
  ],
  authors: [
    { name: "Citoyens Alréens", url: "mailto:auray.petition@gmail.com" },
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pétition Auray",
    startupImage: [
      {
        url: "/icons/icons/apple-splash-2048-2732.jpg",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/icons/icons/apple-splash-1668-2388.jpg",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/icons/icons/apple-splash-1536-2048.jpg",
        media:
          "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/icons/icons/apple-splash-1284-2778.jpg",
        media:
          "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/icons/icons/apple-splash-1170-2532.jpg",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
    ],
  },
  icons: {
    icon: [
      {
        url: "/icons/icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/icons/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/icons/apple-icon-180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "Pétition Auray - Régulation des Sonneries de Cloches",
    description:
      "Pour un équilibre entre tradition religieuse et tranquillité publique à Auray",
    type: "website",
    locale: "fr_FR",
    emails: ["auray.petition@gmail.com"],
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pétition Numérique Auray",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pétition Auray - Régulation des Sonneries de Cloches",
    description:
      "Signez pour un équilibre entre tradition et tranquillité publique",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://auray-petition.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
  viewportFit: "cover",
  themeColor: "#003b46",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/favicon-48x48.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="icon" href="/favicon.ico" />
        {/* Google Analytics 4 */}
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className}>
        <div className="relative z-0 bg-background">
          {children}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                      .then((registration) => {
                        console.log('🚀 PWA: Service Worker enregistré avec succès:', registration.scope);
                      })
                      .catch((error) => {
                        console.log('❌ PWA: Échec enregistrement Service Worker:', error);
                      });
                  });
                }
              `,
            }}
          />
        </div>
      </body>
    </html>
  );
}
