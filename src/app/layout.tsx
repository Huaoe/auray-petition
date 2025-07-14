import { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Auray Pétition - Régulation des Sonneries de Cloches',
  description: `Signez la pétition citoyenne pour une régulation raisonnée des sonneries de l'Église Saint-Gildas. Un équilibre entre tradition religieuse et tranquillité publique.`,
  keywords: ['Auray', 'pétition', 'cloches', 'sonneries', 'église', 'Saint-Gildas', 'Alréens'],
  authors: [{ name: 'Citoyens Alréens', url: 'mailto:auray.petition@gmail.com' }],
  openGraph: {
    title: 'Pétition Auray - Régulation des Sonneries de Cloches',
    description: 'Pour un équilibre entre tradition religieuse et tranquillité publique à Auray',
    type: 'website',
    locale: 'fr_FR',
    emails: ['auray.petition@gmail.com'],
  },
  alternates: {
    canonical: 'https://auray-petition.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
