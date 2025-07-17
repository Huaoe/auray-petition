import { NextRequest, NextResponse } from 'next/server';
import { addSignature, getPetitionStats, checkEmailExists } from '@/lib/googleSheets';
import { validateEmail, validatePostalCode } from '@/lib/utils';
import { checkRateLimit } from '@/lib/rate-limiter';
import { analytics } from '@/lib/analytics';
import {
  createCoupon,
  createSmartCoupon,
  storeEnhancedCoupon,
  validateReferralCode,
  recordReferral,
  awardReferralBonus,
  type SignatureEngagementData
} from '@/lib/coupon-system';

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
      return NextResponse.json({ error: message }, { status: 429 });
    }
  }

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
      referralCode,
      timestamp,
      userAgent,
      recaptchaToken
    } = body;
    
    // Validation reCAPTCHA obligatoire
    if (!recaptchaToken) {
      analytics.error('recaptcha_missing', 'Token de sécurité manquant');
      return NextResponse.json(
        { error: 'Token de sécurité manquant' },
        { status: 400 }
      );
    }

    const isRecaptchaValid = await validateRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      analytics.signatureSent(false);
      return NextResponse.json(
        { error: 'Échec de la vérification anti-spam. Veuillez réessayer.' },
        { status: 400 }
      );
    }
    
    // Vérifications de longueur et de contenu
    if (firstName?.trim().length > 50 || lastName?.trim().length > 50 || city?.trim().length > 50) {
      analytics.error('validation_error', 'Champs > 50 caractères');
      return NextResponse.json(
        { error: 'Les champs nom, prénom et ville ne peuvent pas dépasser 50 caractères.' },
        { status: 400 }
      );
    }

    if (comment?.trim().length > 500) {
      analytics.error('validation_error', 'Commentaire > 500 caractères');
      return NextResponse.json(
        { error: 'Le commentaire ne peut pas dépasser 500 caractères.' },
        { status: 400 }
      );
    }

    // Vérifications obligatoires
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !city?.trim() || !postalCode?.trim()) {
      analytics.error('validation_error', 'Champs obligatoires manquants');
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être renseignés' },
        { status: 400 }
      );
    }
    
    if (!rgpdConsent) {
      analytics.error('validation_error', 'Consentement RGPD manquant');
      return NextResponse.json(
        { error: 'Le consentement RGPD est obligatoire pour signer la pétition' },
        { status: 400 }
      );
    }
    
    // Validation format email
    if (!validateEmail(email)) {
      analytics.error('validation_error', 'Format email invalide');
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }
    
    // Validation code postal français
    if (!validatePostalCode(postalCode)) {
      analytics.error('validation_error', 'Code postal invalide');
      return NextResponse.json(
        { error: 'Code postal invalide (format français requis)' },
        { status: 400 }
      );
    }
    
    // Validation du code de parrainage si fourni
    let referralValidation = null;
    if (referralCode?.trim()) {
      referralValidation = validateReferralCode(referralCode.trim(), email.trim().toLowerCase());
      if (!referralValidation.valid) {
        analytics.error('referral_validation_error', referralValidation.error || 'Code de parrainage invalide');
        return NextResponse.json(
          { error: referralValidation.error || 'Code de parrainage invalide' },
          { status: 400 }
        );
      }
    }
    
    // Vérification des doublons d'email (uniquement en production)
    if (process.env.NODE_ENV === 'production') {
      const duplicateCheck = await checkEmailExists(email.trim().toLowerCase());
      if (duplicateCheck.exists) {
        analytics.error('duplicate_email', `Email déjà utilisé: ${email}`);
        return NextResponse.json(
          {
            error: 'Cette adresse email a déjà été utilisée pour signer la pétition.',
            details: 'Si vous pensez qu\'il s\'agit d\'une erreur, veuillez nous contacter.'
          },
          { status: 409 } // Conflict status code
        );
      }
    }
    
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
      referralCode: referralCode?.trim() || '',
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
    
    // Enregistrer le parrainage si un code valide a été utilisé
    if (referralValidation && referralValidation.valid && referralCode?.trim()) {
      const trimmedReferralCode = referralCode.trim();
      const trimmedEmail = email.trim().toLowerCase();
      
      // Enregistrer le parrainage
      recordReferral(trimmedReferralCode, trimmedEmail);
      
      // Attribuer le bonus au parrain
      if (referralValidation.referrer) {
        awardReferralBonus(referralValidation.referrer, trimmedEmail);
        
        // Tracking analytics détaillé
        analytics.referral.codeUsed(trimmedReferralCode, referralValidation.referrer, trimmedEmail);
        analytics.referral.bonusAwarded(referralValidation.referrer, 1);
        analytics.referral.conversionCompleted(trimmedReferralCode, referralValidation.referrer, 1);
        
        console.log(`Parrainage réussi: ${referralValidation.referrer} -> ${trimmedEmail} (code: ${trimmedReferralCode})`);
      }
    }
    
    // GÉNÉRER UN COUPON INTELLIGENT AVEC SUPPORT DES PARRAINAGES
    const engagementData: SignatureEngagementData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      comment: comment?.trim(),
      newsletterConsent: Boolean(newsletterConsent),
      hasSocialShare: false, // Sera mis à jour si l'utilisateur partage
      socialShares: 0,
      referrals: 0,
      referralCode: referralCode?.trim()
    };
    
    const aiCoupon = createSmartCoupon(email.trim().toLowerCase(), engagementData);
    storeEnhancedCoupon(aiCoupon);
    
    console.log(`Coupon IA généré pour ${email}: ${aiCoupon.code} (${aiCoupon.totalGenerations} générations, niveau ${aiCoupon.level})`);
    
    analytics.signatureSent(true);
    // Réponse de succès avec statistiques mises à jour + coupon IA
    return NextResponse.json(
      {
        success: true,
        message: 'Signature enregistrée avec succès',
        statistics: updatedStats,
        timestamp: new Date().toISOString(),
        // Nouveau: Retourner l'objet coupon complet
        aiCoupon: aiCoupon
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
