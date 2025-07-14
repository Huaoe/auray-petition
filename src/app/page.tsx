'use client'

import { useState, useEffect } from 'react'
import { Metadata } from 'next'
import { CONSTANTS, validateEmail, validatePostalCode } from '@/lib/utils'

interface FormData {
  prenom: string
  nom: string
  email: string
  codePostal: string
  commentaire: string
  consent: boolean
  newsletter: boolean
}

interface FormErrors {
  prenom?: string
  nom?: string
  email?: string
  codePostal?: string
  consent?: string
}

interface Statistics {
  totalSignatures: number
  daysActive: number
  approvalRate: number
}

const HomePage = () => {
  // État du formulaire
  const [formData, setFormData] = useState<FormData>({
    prenom: '',
    nom: '',
    email: '',
    codePostal: '',
    commentaire: '',
    consent: false,
    newsletter: false
  })

  // État des erreurs
  const [errors, setErrors] = useState<FormErrors>({})
  
  // État de soumission
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  
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

  // Gestion des changements de formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Effacer l'erreur du champ en cours de modification
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis'
    }

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }

    if (!formData.codePostal.trim()) {
      newErrors.codePostal = 'Le code postal est requis'
    } else if (!validatePostalCode(formData.codePostal)) {
      newErrors.codePostal = 'Format de code postal invalide (5 chiffres)'
    }

    if (!formData.consent) {
      newErrors.consent = 'Vous devez accepter les conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await fetch('/api/signatures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: 'Votre signature a été enregistrée avec succès ! Merci pour votre soutien.'
        })
        
        // Reset du formulaire
        setFormData({
          prenom: '',
          nom: '',
          email: '',
          codePostal: '',
          commentaire: '',
          consent: false,
          newsletter: false
        })
        
        // Recharger les statistiques
        fetchStatistics()
        
      } else {
        setSubmitMessage({
          type: 'error',
          text: data.error || 'Une erreur est survenue lors de l\'enregistrement.'
        })
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Erreur de connexion. Veuillez réessayer.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressPercentage = Math.min(((stats?.totalSignatures || 0) / CONSTANTS.PETITION_TARGET) * 100, 100)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-blue-50 to-orange-50/30 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 ring-1 ring-inset ring-primary-600/20">
              <span className="mr-2">🔔</span>
              Pétition Citoyenne {CONSTANTS.CITY_NAME}
            </div>
            
            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              <span className="text-gradient">Régulation</span> des Sonneries
              <br />
              <span className="text-secondary-600">de Cloches d'Auray</span>
            </h1>
            
            {/* Description */}
            <p className="mt-6 text-lg leading-8 text-gray-600 text-balance">
              Pour un équilibre entre tradition religieuse et tranquillité publique. 
              Les {CONSTANTS.RESIDENTS_NAME} demandent une régulation raisonnée des sonneries 
              de l'<span className="font-medium text-primary-700">{CONSTANTS.CHURCH_NAME}</span>.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#petition"
                className="btn-primary animate-glow"
              >
                Signer la Pétition
              </a>
              <a
                href="#contexte"
                className="btn-outline"
              >
                Comprendre le Contexte
              </a>
            </div>
          </div>
        </div>
        
        {/* Decoration */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-400 to-secondary-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              État de la Mobilisation
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Suivez en temps réel l'évolution de notre pétition citoyenne
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {/* Signatures Count */}
              <div className="card text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stats?.totalSignatures || 0}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Signatures Collectées
                </div>
                <div className="text-xs text-gray-500">
                  Objectif : {CONSTANTS.PETITION_TARGET}
                </div>
                <div className="progress-bar mt-4">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
              
              {/* Days Active */}
              <div className="card text-center">
                <div className="text-4xl font-bold text-secondary-600 mb-2">
                  {stats?.daysActive || 1}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Jours d'Activité
                </div>
                <div className="text-xs text-gray-500">
                  Depuis le lancement
                </div>
              </div>
              
              {/* Approval Rate */}
              <div className="card text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {Math.round(stats?.approvalRate || 0)}%
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Taux d'Approbation
                </div>
                <div className="text-xs text-gray-500">
                  Mobilisation locale
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Petition Form */}
      <section id="petition" className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Signez la Pétition
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Votre voix compte pour l'équilibre de notre ville
            </p>
          </div>
          
          <div className="mx-auto max-w-2xl">
            {/* Message de soumission */}
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitMessage.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {submitMessage.text}
              </div>
            )}
            
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Prénom et Nom */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="prenom" className="form-label">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className={`form-input ${errors.prenom ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Votre prénom"
                    />
                    {errors.prenom && (
                      <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="nom" className="form-label">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className={`form-input ${errors.nom ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Votre nom"
                    />
                    {errors.nom && (
                      <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                    )}
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="votre.email@exemple.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                {/* Code Postal */}
                <div>
                  <label htmlFor="codePostal" className="form-label">
                    Code Postal *
                  </label>
                  <input
                    type="text"
                    id="codePostal"
                    name="codePostal"
                    value={formData.codePostal}
                    onChange={handleInputChange}
                    className={`form-input ${errors.codePostal ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="56400"
                    maxLength={5}
                  />
                  {errors.codePostal && (
                    <p className="mt-1 text-sm text-red-600">{errors.codePostal}</p>
                  )}
                </div>
                
                {/* Commentaire */}
                <div>
                  <label htmlFor="commentaire" className="form-label">
                    Commentaire (optionnel)
                  </label>
                  <textarea
                    id="commentaire"
                    name="commentaire"
                    value={formData.commentaire}
                    onChange={handleInputChange}
                    rows={4}
                    className="form-input"
                    placeholder="Partagez votre expérience ou vos préoccupations concernant les sonneries..."
                  />
                </div>
                
                {/* Consent */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className={`form-checkbox mt-1 ${errors.consent ? 'border-red-300 focus:ring-red-500' : ''}`}
                  />
                  <label htmlFor="consent" className="ml-3 text-sm text-gray-700">
                    J'accepte que mes données soient utilisées dans le cadre de cette pétition 
                    et je confirme être majeur(e) et résider à Auray ou ses environs. *
                  </label>
                </div>
                {errors.consent && (
                  <p className="text-sm text-red-600">{errors.consent}</p>
                )}
                
                {/* Newsletter */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                    className="form-checkbox mt-1"
                  />
                  <label htmlFor="newsletter" className="ml-3 text-sm text-gray-700">
                    Je souhaite recevoir les mises à jour sur l'avancement de cette pétition
                  </label>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full btn-primary text-center justify-center ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Enregistrement...
                    </>
                  ) : (
                    '🔔 Signer la Pétition'
                  )}
                </button>
              </form>
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
