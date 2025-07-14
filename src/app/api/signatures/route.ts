import { NextRequest, NextResponse } from 'next/server';
import { addSignature, getPetitionStats } from '@/lib/googleSheets';
import { validateEmail, validatePostalCode } from '@/lib/utils';

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
    
    // Validation des données
    const { prenom, nom, email, codePostal, commentaire, newsletter, consent } = body;
    
    // Vérifications obligatoires
    if (!prenom?.trim() || !nom?.trim() || !email?.trim() || !codePostal?.trim()) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être renseignés' },
        { status: 400 }
      );
    }
    
    if (!consent) {
      return NextResponse.json(
        { error: 'Le consentement est obligatoire pour signer la pétition' },
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
    if (!validatePostalCode(codePostal)) {
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
    
    // Préparer la signature
    const signature = {
      firstName: prenom.trim(),
      lastName: nom.trim(),
      email: email.trim().toLowerCase(),
      postalCode: codePostal.trim(),
      comment: commentaire?.trim() || '',
      newsletter: Boolean(newsletter),
      ipAddress
    };
    
    // Ajouter à Google Sheets
    const result = await addSignature(signature);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      );
    }
    
    // Réponse de succès
    return NextResponse.json(
      { 
        success: true, 
        message: 'Signature enregistrée avec succès',
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
