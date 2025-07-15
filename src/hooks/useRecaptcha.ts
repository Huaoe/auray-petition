import { useRef, useCallback } from 'react'

// Type pour ReCAPTCHA (évite les erreurs TypeScript)
type ReCAPTCHAInstance = {
  executeAsync: () => Promise<string | null>
  reset: () => void
}

export const useRecaptcha = () => {
  const recaptchaRef = useRef<ReCAPTCHAInstance | null>(null)

  const executeRecaptchaAction = useCallback(async (action: string = 'submit'): Promise<string | null> => {
    console.log('🔧 executeRecaptchaAction appelé avec action:', action)
    console.log('🔧 recaptchaRef.current:', recaptchaRef.current)
    
    if (!recaptchaRef.current) {
      console.log('🔧 reCAPTCHA not ready - retour token de développement')
      return 'dev-token-bypass' // Token de développement
    }

    try {
      console.log('🔧 Tentative d\'exécution reCAPTCHA...')
      const token = await recaptchaRef.current.executeAsync()
      console.log('🔧 Token reCAPTCHA reçu:', token ? 'Token valide' : 'Token null')
      return token
    } catch (error) {
      console.error('🔧 Erreur reCAPTCHA:', error)
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
