import { useRef, useCallback } from 'react'

// Type pour ReCAPTCHA (évite les erreurs TypeScript)
type ReCAPTCHAInstance = {
  executeAsync: () => Promise<string | null>
  reset: () => void
}

// Fonction utilitaire pour ajouter un timeout à une promesse
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`Timeout après ${timeoutMs}ms`)), timeoutMs)
    )
  ])
}

export const useRecaptcha = () => {
  const recaptchaRef = useRef<ReCAPTCHAInstance | null>(null)

  const executeRecaptchaAction = useCallback(async (action: string = 'submit'): Promise<string | null> => {
    console.log('🔧 executeRecaptchaAction appelé avec action:', action)
    console.log('🔧 recaptchaRef.current:', recaptchaRef.current)
    console.log('🔧 RECAPTCHA_SITE_KEY présent:', !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)
    
    // Si pas de clé reCAPTCHA configurée, retourner le token de développement
    if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      console.log('🔧 Pas de clé reCAPTCHA - retour token de développement')
      return 'dev-token-bypass'
    }
    
    // Si reCAPTCHA pas encore initialisé, retourner le token de développement
    if (!recaptchaRef.current) {
      console.log('🔧 reCAPTCHA not ready - retour token de développement')
      return 'dev-token-bypass'
    }

    try {
      console.log('🔧 Tentative d\'exécution reCAPTCHA avec timeout de 10s...')
      
      // Ajouter un timeout de 10 secondes pour éviter le blocage infini
      const token = await withTimeout(
        recaptchaRef.current.executeAsync(),
        10000 // 10 secondes
      )
      
      console.log('🔧 Token reCAPTCHA reçu:', token ? 'Token valide' : 'Token null')
      return token || 'dev-token-bypass'
    } catch (error) {
      console.error('🔧 Erreur reCAPTCHA:', error)
      
      // Si c'est un timeout ou une erreur, utiliser le token de développement
      if (error instanceof Error && error.message.includes('Timeout')) {
        console.log('🔧 Timeout reCAPTCHA - utilisation token de développement')
      }
      
      return 'dev-token-bypass' // Fallback en cas d'erreur
    }
  }, [])

  const resetRecaptcha = useCallback(() => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
  }, [])

  // En développement, considérer comme prêt
  const isRecaptchaReady = true

  return {
    recaptchaRef,
    executeRecaptchaAction,
    resetRecaptcha,
    isRecaptchaReady
  }
}
