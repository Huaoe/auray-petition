import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware qui s'exécute sur toutes les requêtes
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Vérifier si c'est une route de test (commence par /test-)
  if (pathname.startsWith('/test-')) {
    // En production, bloquer l'accès et rediriger vers la page 404
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.rewrite(new URL('/404', request.url))
    }
    
    // En développement, ajouter un en-tête d'avertissement
    const response = NextResponse.next()
    response.headers.set('X-Test-Page-Warning', 'Cette page ne sera pas accessible en production')
    return response
  }

  return NextResponse.next()
}

// Configuration des chemins où le middleware sera exécuté
export const config = {
  // S'applique à toutes les routes commençant par /test-
  matcher: '/test-:path*',
}
