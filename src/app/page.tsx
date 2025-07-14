'use client'

import { useState, useEffect } from 'react'
import { SignatureForm } from '@/components/SignatureForm'

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 to-white">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                    Pétition Citoyenne
                  </span>
                </div>
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Pour une Régulation des Sonneries de Cloches à Auray
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Ensemble, trouvons un équilibre respectueux entre tradition religieuse 
                  et qualité de vie. Votre signature compte pour ouvrir le dialogue.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    href="#petition"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Signer maintenant
                  </a>
                  <a href="#contexte" className="text-sm font-semibold leading-6 text-gray-900">
                    En savoir plus <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 md:-mr-20 lg:-mr-36" />
            <div className="shadow-lg md:rounded-3xl">
              <div className="bg-indigo-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                <div className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36" />
                <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                  <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                    <div className="w-screen overflow-hidden rounded-tl-xl bg-gray-900">
                      <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                        <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                          <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                            petition-auray.fr
                          </div>
                        </div>
                      </div>
                      <div className="px-6 pb-14 pt-6">
                        {/* Statistiques en temps réel */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{stats.totalSignatures}</div>
                            <div className="text-xs text-gray-400">Signatures</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{stats.daysActive}</div>
                            <div className="text-xs text-gray-400">Jours actifs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{stats.approvalRate}%</div>
                            <div className="text-xs text-gray-400">Satisfaction</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-300">
                          ✅ Pétition en ligne sécurisée<br/>
                          🔒 Données protégées (RGPD)<br/>
                          📊 Transparence totale
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Petition Form Section */}
      <section id="petition" className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                🔔 Signez la Pétition
              </h2>
              <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                Votre signature sera transmise au conseil municipal d'Auray et aux autorités compétentes. 
                Ensemble, ouvrons le dialogue pour une solution équilibrée.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Informations sur l'impact */}
              <div className="lg:col-span-1 space-y-6">
                <div className="card">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 text-sm">📢</span>
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">
                      Notre Demande
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-1">•</span>
                      Limitation nocturne (22h-7h)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-1">•</span>
                      Réduction de l'intensité sonore
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-1">•</span>
                      Dialogue municipalité/citoyens
                    </li>
                  </ul>
                </div>

                <div className="card">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">🔒</span>
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">
                      Confidentialité
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Vos données sont protégées (RGPD). Seules les statistiques globales 
                    sont publiques. Transparence totale sur l'utilisation.
                  </p>
                </div>
              </div>

              {/* Formulaire moderne */}
              <div className="lg:col-span-2">
                <div className="card">
                  <SignatureForm onSuccess={handleSignatureSuccess} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Context Preview */}
      <section id="contexte" className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Comprendre le Contexte
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Une situation complexe qui nécessite dialogue et équilibre
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Problème */}
              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm">⚠️</span>
                    </div>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">
                    La Problématique
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Les sonneries quotidiennes de l'Église Saint-Gildas impactent 
                  significativement la qualité de vie des résidents, particulièrement 
                  ceux vivant à proximité immédiate du centre-ville.
                </p>
              </div>
              
              {/* Solution */}
              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✅</span>
                    </div>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">
                    Notre Proposition
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Établir un dialogue constructif pour définir des créneaux 
                  horaires respectueux, préservant à la fois la tradition 
                  religieuse et la tranquillité publique.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <a
                href="/contexte"
                className="btn-outline"
              >
                En Savoir Plus sur le Contexte
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
