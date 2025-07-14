'use client'

import { useState, useEffect } from 'react'
import SignatureForm from '@/components/SignatureForm'

interface Statistics {
  totalSignatures: number
  daysActive: number
  approvalRate: number
}

const HomePage = () => {
  // État des statistiques
  const [stats, setStats] = useState<Statistics>({
    totalSignatures: 0,
    daysActive: 1,
    approvalRate: 0
  })

  // Charger les statistiques au montage
  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      console.log('🔄 Chargement des statistiques...')
      const response = await fetch('/api/signatures')
      
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Données reçues:', data)
        
        if (data.success && data.statistics) {
          setStats(data.statistics)
          console.log('✅ Statistiques mises à jour:', data.statistics)
        } else {
          console.error('❌ Structure de données incorrecte:', data)
        }
      } else {
        console.error('❌ Erreur HTTP:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des statistiques:', error)
    }
  }

  // Callback pour mettre à jour les stats après signature
  const handleSignatureSuccess = (newStats?: Statistics) => {
    if (newStats) {
      setStats(newStats)
    } else {
      // Recharger les stats si pas fournies
      fetchStatistics()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-green-700">Pétition Citoyenne</h1>
            <nav className="flex space-x-6 text-sm">
              <a href="#contexte" className="text-gray-600 hover:text-green-700 transition-colors">Contexte</a>
              <a href="#petition" className="text-gray-600 hover:text-green-700 transition-colors">Signer</a>
              <a href="#contact" className="text-gray-600 hover:text-green-700 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pour une Régulation des Sonneries de Cloches à Auray
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Ensemble, trouvons un équilibre respectueux entre tradition religieuse 
              et qualité de vie. Votre signature compte pour ouvrir le dialogue.
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="text-3xl font-bold text-green-700">{stats.totalSignatures}</div>
                <div className="text-sm text-green-600 font-medium">Signatures</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="text-3xl font-bold text-blue-700">{stats.daysActive}</div>
                <div className="text-sm text-blue-600 font-medium">Jours actifs</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="text-3xl font-bold text-purple-700">{stats.approvalRate}%</div>
                <div className="text-sm text-purple-600 font-medium">Satisfaction</div>
              </div>
            </div>
            
            <button 
              onClick={() => document.getElementById('petition')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-green-800 transition-colors"
            >
              Signer la Pétition Maintenant
            </button>
          </div>
        </div>

        {/* Notre Demande Cards */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Notre Demande</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌙</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Limitation nocturne</h4>
              <p className="text-gray-600">(22h-9h)</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔊</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Réduction de l'intensité sonore et la durée des sonneries</h4>
              <p className="text-gray-600">à 2 minutes</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Dialogue municipalité/citoyens</h4>
              <p className="text-gray-600">Concertation et solutions équilibrées</p>
            </div>
          </div>
        </div>

        {/* Petition Form Card */}
        <div id="petition" className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold rounded-full  text-gray-900 mb-4 flex items-center justify-center gap-3">
              <img 
                src="/icons/icons/manifest-icon-192.maskable.png" 
                alt="Icône pétition" 
                className="w-38 h-38 rounded-full "
              />
              Signez la Pétition
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Votre signature sera transmise au conseil municipal d'Auray et aux autorités compétentes. 
              Ensemble, ouvrons le dialogue pour une solution équilibrée.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
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
                  Vos données sont protégées (RGPD). Seules les statistiques globales 
                  sont publiques. Transparence totale sur l'utilisation.
                </p>
              </div>
            </div>

            {/* Formulaire */}
            <div className="lg:col-span-3">
              <div className="bg-gray-50 rounded-xl p-6">
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
              <h3 className="ml-4 text-2xl font-bold text-gray-900">Comprendre le Contexte</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Les sonneries quotidiennes de l'Église Saint-Gildas impactent significativement la qualité de vie des résidents, particulièrement ceux vivant à proximité immédiate du centre-ville.
            </p>
          </div>
          
          {/* Proposition Card */}
          <div className="bg-green-50 rounded-xl shadow-md p-8 border border-green-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="ml-4 text-2xl font-bold text-gray-900">Notre Proposition</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Établir un dialogue constructif pour définir des créneaux horaires respectueux, préservant à la fois la tradition religieuse et la tranquillité publique.
            </p>
            <div className="text-center">
              <a href="/contexte" className="inline-flex items-center text-green-700 font-semibold hover:text-green-800 transition-colors">
                En savoir plus
                <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>2025 Pétition Citoyenne Auray. Mentions légales | Politique de confidentialité</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
