import { NextRequest, NextResponse } from 'next/server';
import { addSignature, getPetitionStats } from '@/lib/googleSheets';
import { validateEmail, validatePostalCode } from '@/lib/utils';

// Fonction pour valider le token reCAPTCHA
async function validateRecaptcha(token: string): Promise<boolean> {
  // Bypass pour développement
  if (token === 'dev-token-bypass') {
    console.log(' Mode développement: reCAPTCHA bypass activé');
    return true;
  }

  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn('RECAPTCHA_SECRET_KEY not configured - bypassing validation');
    return true; // En développement, on peut bypasser
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    
    // Vérifier le score (pour reCAPTCHA v3)
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error('Erreur validation reCAPTCHA:', error);
    return false;
  }
}

// GET - Récupérer les statistiques
export async function GET() {
  try {
    const stats = await getPetitionStats();
    
    // Structure cohérente avec le frontend
    return NextResponse.json({
      success: true,
      statistics: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur API GET /signatures:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la récupération des statistiques' 
      },
      { status: 500 }
    );
  }
}

// POST - Ajouter une signature
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données - nouvelle structure
    const { 
      firstName, 
      lastName, 
      email, 
      city,
      postalCode, 
      comment, 
      rgpdConsent,
      newsletterConsent,
      timestamp,
      userAgent,
      recaptchaToken
    } = body;
    
    // Validation reCAPTCHA obligatoire
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'Token de sécurité manquant' },
        { status: 400 }
      );
    }

    const isRecaptchaValid = await validateRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json(
        { error: 'Échec de la vérification anti-spam. Veuillez réessayer.' },
        { status: 400 }
      );
    }
    
    // Vérifications obligatoires
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !city?.trim() || !postalCode?.trim()) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être renseignés' },
        { status: 400 }
      );
    }
    
    if (!rgpdConsent) {
      return NextResponse.json(
        { error: 'Le consentement RGPD est obligatoire pour signer la pétition' },
        { status: 400 }
      );
    }
    
    // Validation format email
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }
    
    // Validation code postal français
    if (!validatePostalCode(postalCode)) {
      return NextResponse.json(
        { error: 'Code postal invalide (format français requis)' },
        { status: 400 }
      );
    }
    
    // Récupérer l'IP du client
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : 
                      request.headers.get('x-real-ip') || 
                      request.ip || 
                      'unknown';
    
    // Préparer la signature avec la nouvelle structure
    const signature = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      comment: comment?.trim() || '',
      rgpdConsent: Boolean(rgpdConsent),
      newsletterConsent: Boolean(newsletterConsent),
      ipAddress,
      userAgent: userAgent || 'unknown',
      timestamp: timestamp || new Date().toISOString()
    };
    
    // Ajouter à Google Sheets
    const result = await addSignature(signature);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      );
    }
    
    // Récupérer les nouvelles statistiques après ajout
    const updatedStats = await getPetitionStats();
    
    // Réponse de succès avec statistiques mises à jour
    return NextResponse.json(
      { 
        success: true, 
        message: 'Signature enregistrée avec succès',
        statistics: updatedStats,
        timestamp: new Date().toISOString()
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Erreur API POST /signatures:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'enregistrement' },
      { status: 500 }
    );
  }
}
