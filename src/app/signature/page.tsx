'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignaturePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirection vers la page d'accueil avec ancre vers le formulaire
    router.replace('/#petition')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirection vers le formulaire de signature...</p>
      </div>
    </div>
  )
}
