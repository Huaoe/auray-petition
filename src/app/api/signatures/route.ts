import { NextRequest, NextResponse } from 'next/server';
import { addSignature, getPetitionStats, checkEmailExists } from '@/lib/googleSheets';
import { validateEmail, validatePostalCode } from '@/lib/utils';
import { checkRateLimit } from '@/lib/rate-limiter';
import { analytics } from '@/lib/analytics';

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
  // Get IP address from headers (Next.js 15 compatible)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ipAddress = 
    forwardedFor?.split(',')[0].trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('x-client-ip')?.trim() ||
    'unknown';

  // Appliquer la limitation de débit
  if (ipAddress !== 'unknown') {
    const { limited, message } = checkRateLimit(ipAddress);
    if (limited) {
      analytics.error('rate_limit_exceeded', ipAddress);
      return NextResponse.json(
        { error: message },
        { status: 429 }
      );
    }
  }

  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      city, 
      postalCode, 
      comment, 
      rgpdConsent, 
      newsletterConsent,
      recaptchaToken,
      timestamp,
      userAgent
    } = body;

    // Validation des champs obligatoires
    if (!firstName || !lastName || !email || !city || !postalCode) {
      analytics.error('missing_required_fields', 'signature_form');
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Validation du consentement RGPD
    if (!rgpdConsent) {
      analytics.error('rgpd_consent_required', 'signature_form');
      return NextResponse.json(
        { error: 'Le consentement RGPD est obligatoire' },
        { status: 400 }
      );
    }

    // Validation de l'email
    if (!validateEmail(email)) {
      analytics.error('invalid_email', email);
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation du code postal
    if (!validatePostalCode(postalCode)) {
      analytics.error('invalid_postal_code', postalCode);
      return NextResponse.json(
        { error: 'Format de code postal invalide' },
        { status: 400 }
      );
    }

    // Validation reCAPTCHA
    if (!recaptchaToken) {
      analytics.error('missing_recaptcha', 'signature_form');
      return NextResponse.json(
        { error: 'Token reCAPTCHA manquant' },
        { status: 400 }
      );
    }

    const isRecaptchaValid = await validateRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      analytics.error('invalid_recaptcha', 'signature_form');
      return NextResponse.json(
        { error: 'Validation reCAPTCHA échouée' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const emailExists = await checkEmailExists(email.trim().toLowerCase());
    if (emailExists) {
      analytics.error('duplicate_email', email);
      return NextResponse.json(
        {
          error: 'Cette adresse email a déjà été utilisée pour signer la pétition.',
          details: 'Si vous pensez qu\'il s\'agit d\'une erreur, veuillez nous contacter.'
        },
        { status: 409 }
      );
    }
    
    // Préparer la signature
    const signature = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      comment: comment?.trim() || '',
      rgpdConsent: Boolean(rgpdConsent),
      newsletterConsent: Boolean(newsletterConsent),
      referralCode: '', // Vide pour la version pétition simple
      ipAddress,
      userAgent: userAgent || 'unknown',
      timestamp: timestamp || new Date().toISOString()
    };
    
    // Ajouter à Google Sheets
    const result = await addSignature(signature);
    
    if (!result.success) {
      analytics.signatureSent(false);
      return NextResponse.json(
        { error: result.message || 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      );
    }
    
    // Récupérer les nouvelles statistiques après ajout
    const updatedStats = await getPetitionStats();
    
    analytics.signatureSent(true);
    
    // Réponse de succès simple
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    analytics.error('server_error', errorMessage);
    console.error('Erreur API POST /signatures:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'enregistrement' },
      { status: 500 }
    );
  }
}
