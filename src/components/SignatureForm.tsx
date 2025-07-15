'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ReCAPTCHA from 'react-google-recaptcha'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle, Users, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRecaptcha } from '@/hooks/useRecaptcha'
import { analytics } from '@/lib/analytics'

// Schema de validation Zod
const signatureSchema = z.object({
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
  
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
  
  email: z.string()
    .email('Veuillez saisir une adresse email valide')
    .max(100, 'L\'adresse email ne peut pas dépasser 100 caractères'),
  
  city: z.string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(100, 'La ville ne peut pas dépasser 100 caractères'),
  
  postalCode: z.string()
    .regex(/^[0-9]{5}$/, 'Le code postal doit contenir exactement 5 chiffres'),
  
  comment: z.string()
    .max(500, 'Le commentaire ne peut pas dépasser 500 caractères')
    .optional(),
  
  rgpdConsent: z.boolean()
    .refine(val => val === true, 'Vous devez accepter le traitement de vos données personnelles'),
  
  newsletterConsent: z.boolean().optional(),
})

type SignatureFormData = z.infer<typeof signatureSchema>

interface Statistics {
  totalSignatures: number
  daysActive: number
  approvalRate: number
}

interface SignatureFormProps {
  onSuccess?: (newStats?: Statistics) => void
  onSignatureCount?: (count: number) => void
}

export const SignatureForm = ({ onSuccess, onSignatureCount }: SignatureFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { recaptchaRef, executeRecaptchaAction, resetRecaptcha, isRecaptchaReady } = useRecaptcha()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch
  } = useForm<SignatureFormData>({
    resolver: zodResolver(signatureSchema),
    mode: 'onChange'
  })

  const rgpdConsent = watch('rgpdConsent')
  const newsletterConsent = watch('newsletterConsent')
  const comment = watch('comment')
  
  const handleSubmitSignature = async (data: SignatureFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Exécuter reCAPTCHA avant soumission
      const recaptchaToken = await executeRecaptchaAction('submit_signature')
      
      // Accepter le token de développement ou un token valide
      if (!recaptchaToken || (recaptchaToken !== 'dev-token-bypass' && recaptchaToken.length < 10)) {
        console.error('Token reCAPTCHA invalide:', recaptchaToken)
        throw new Error('Échec de la vérification anti-spam. Veuillez réessayer.')
      }

      console.log('🔒 Token reCAPTCHA:', recaptchaToken === 'dev-token-bypass' ? 'Mode développement' : 'Token valide')

      const response = await fetch('/api/signatures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken, // Ajouter le token reCAPTCHA
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ipAddress: 'client-side' // Will be replaced server-side
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'envoi de la signature')
      }

      // Succès - Analytics
      analytics.signatureSent(true)
      
      setSubmitStatus('success')
      setSuccessMessage(`Merci ${data.firstName} ! Votre signature a été enregistrée avec succès.`)
      
      // Réinitialiser le formulaire après succès
      reset()
      
      // Callback de succès si fourni
      if (onSuccess) {
        onSuccess(result)
      }

      // Mettre à jour le compteur si callback fourni
      if (onSignatureCount && result.statistics?.totalSignatures) {
        onSignatureCount(result.statistics.totalSignatures)
      }

    } catch (error) {
      // Erreur - Analytics
      analytics.signatureSent(false)
      analytics.error('signature_submission', error instanceof Error ? error.message : 'Unknown error')
      
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Suivre les interactions avec les champs
  const handleFieldFocus = (fieldName: string) => {
    analytics.formInteraction(fieldName)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Users className="h-6 w-6 text-primary" />
          Signer la Pétition
        </CardTitle>
        <CardDescription>
          Votre voix compte pour une régulation raisonnée des sonneries de cloches à Auray
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {submitStatus === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-8"
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                Signature Enregistrée !
              </h3>
              <p className="text-green-600">{successMessage}</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit(handleSubmitSignature)}
              className="space-y-6"
            >
              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="Votre prénom"
                    className={errors.firstName ? 'border-red-500' : ''}
                    onFocus={() => handleFieldFocus('firstName')}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Votre nom"
                    className={errors.lastName ? 'border-red-500' : ''}
                    onFocus={() => handleFieldFocus('lastName')}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="votre.email@exemple.com"
                  className={errors.email ? 'border-red-500' : ''}
                  onFocus={() => handleFieldFocus('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Localisation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="Auray, Vannes, Lorient..."
                    className={errors.city ? 'border-red-500' : ''}
                    onFocus={() => handleFieldFocus('city')}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    {...register('postalCode')}
                    placeholder="56400"
                    maxLength={5}
                    className={errors.postalCode ? 'border-red-500' : ''}
                    onFocus={() => handleFieldFocus('postalCode')}
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-red-500">{errors.postalCode.message}</p>
                  )}
                </div>
              </div>

              {/* Commentaire optionnel */}
              <div className="space-y-2">
                <Label htmlFor="comment">Commentaire (optionnel)</Label>
                <Textarea
                  id="comment"
                  {...register('comment')}
                  placeholder="Partagez votre témoignage ou vos préoccupations..."
                  rows={3}
                  maxLength={500}
                  className={errors.comment ? 'border-red-500' : ''}
                  onFocus={() => handleFieldFocus('comment')}
                />
                {errors.comment && (
                  <p className="text-sm text-red-500">{errors.comment.message}</p>
                )}
              </div>

              {/* Consentements RGPD */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="rgpdConsent"
                    checked={rgpdConsent || false}
                    onCheckedChange={(checked) => setValue('rgpdConsent', checked as boolean)}
                    className={errors.rgpdConsent ? 'border-red-500' : ''}
                    onFocus={() => handleFieldFocus('rgpdConsent')}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="rgpdConsent" className="text-sm font-medium">
                      Consentement RGPD *
                    </Label>
                    <p className="text-xs text-gray-600">
                      J'accepte que mes données personnelles soient traitées dans le cadre de cette pétition 
                      conformément à notre{' '}
                      <a href="/mentions-legales" className="text-primary hover:underline" target="_blank">
                        politique de confidentialité
                      </a>
                      . Mes données ne seront jamais vendues ou partagées avec des tiers.
                    </p>
                  </div>
                </div>
                {errors.rgpdConsent && (
                  <p className="text-sm text-red-500 ml-6">{errors.rgpdConsent.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="newsletterConsent"
                    checked={newsletterConsent || false}
                    onCheckedChange={(checked) => setValue('newsletterConsent', checked as boolean)}
                    onFocus={() => handleFieldFocus('newsletterConsent')}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="newsletterConsent" className="text-sm font-medium">
                      Newsletter (optionnel)
                    </Label>
                    <p className="text-xs text-gray-600">
                      Je souhaite recevoir des mises à jour sur l'avancement de cette pétition.
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages d'erreur */}
              {submitStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Indicateur reCAPTCHA */}
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Shield className={`mr-2 h-4 w-4 ${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? 'text-green-500' : 'text-yellow-500'}`} />
                <span>
                  {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? 'Protection anti-spam activée' : 'Protection anti-spam en développement'}
                </span>
              </div>

              {/* reCAPTCHA invisible */}
              {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                <div className="hidden">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    size="invisible"
                  />
                </div>
              )}

              {/* Bouton de soumission */}
              <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isSubmitting || (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !isRecaptchaReady)}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vérification et envoi...
                  </>
                ) : !isRecaptchaReady && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Chargement sécurisé...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Signer la Pétition
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                En signant, vous rejoignez le mouvement pour une régulation raisonnée des sonneries de cloches à Auray.
                Vos données sont protégées et ne seront utilisées que dans le cadre de cette pétition.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export default SignatureForm
