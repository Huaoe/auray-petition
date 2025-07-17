import { NextRequest, NextResponse } from 'next/server';
import { 
  generateReferralCode,
  validateReferralCode,
  getReferralStats,
  loadReferrals,
  type ReferralStats 
} from '@/lib/coupon-system';
import { analytics } from '@/lib/analytics';

// GET - Récupérer les statistiques de parrainage pour un utilisateur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const action = searchParams.get('action');

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'stats':
        const stats = getReferralStats(email);
        return NextResponse.json({
          success: true,
          stats
        });

      case 'code':
        const referralCode = generateReferralCode(email);
        return NextResponse.json({
          success: true,
          referralCode
        });

      case 'validate':
        const code = searchParams.get('code');
        if (!code) {
          return NextResponse.json(
            { error: 'Code de parrainage requis' },
            { status: 400 }
          );
        }

        const validation = validateReferralCode(code, email);
        return NextResponse.json({
          success: true,
          validation
        });

      default:
        return NextResponse.json(
          { error: 'Action non supportée' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Erreur API GET /referrals:', error);
    analytics.error('referral_api_error', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des données de parrainage' },
      { status: 500 }
    );
  }
}

// POST - Opérations de parrainage (validation, enregistrement)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, referralCode } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'generate':
        const newCode = generateReferralCode(email);
        analytics.referral.codeGenerated(email);
        
        return NextResponse.json({
          success: true,
          referralCode: newCode,
          message: 'Code de parrainage généré avec succès'
        });

      case 'validate':
        if (!referralCode) {
          return NextResponse.json(
            { error: 'Code de parrainage requis' },
            { status: 400 }
          );
        }

        const validation = validateReferralCode(referralCode, email);
        
        if (validation.valid) {
          analytics.referral.codeValidated(referralCode, validation.referrer!, true);
        } else {
          analytics.referral.codeValidated(referralCode, email, false);
        }

        return NextResponse.json({
          success: true,
          validation
        });

      case 'leaderboard':
        // Récupérer le classement des parrains
        const referrals = loadReferrals();
        const leaderboard = getLeaderboard(referrals);
        
        return NextResponse.json({
          success: true,
          leaderboard
        });

      default:
        return NextResponse.json(
          { error: 'Action non supportée' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Erreur API POST /referrals:', error);
    analytics.error('referral_api_error', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json(
      { error: 'Erreur serveur lors du traitement de la demande de parrainage' },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour générer un classement des parrains
function getLeaderboard(referrals: any[]) {
  const referrerStats = new Map<string, {
    email: string;
    totalReferrals: number;
    successfulReferrals: number;
    conversionRate: number;
  }>();

  // Calculer les statistiques pour chaque parrain
  referrals.forEach(referral => {
    if (referral.email !== referral.referrerEmail) { // Exclure les codes auto-générés
      const referrer = referral.referrerEmail;
      
      if (!referrerStats.has(referrer)) {
        referrerStats.set(referrer, {
          email: referrer,
          totalReferrals: 0,
          successfulReferrals: 0,
          conversionRate: 0
        });
      }

      const stats = referrerStats.get(referrer)!;
      stats.totalReferrals++;
      
      if (referral.used) {
        stats.successfulReferrals++;
      }
    }
  });

  // Calculer le taux de conversion et trier
  const leaderboard = Array.from(referrerStats.values())
    .map(stats => ({
      ...stats,
      conversionRate: stats.totalReferrals > 0 
        ? Math.round((stats.successfulReferrals / stats.totalReferrals) * 100 * 100) / 100
        : 0
    }))
    .sort((a, b) => {
      // Trier par parrainages réussis d'abord, puis par taux de conversion
      if (b.successfulReferrals !== a.successfulReferrals) {
        return b.successfulReferrals - a.successfulReferrals;
      }
      return b.conversionRate - a.conversionRate;
    })
    .slice(0, 10); // Top 10

  return leaderboard;
}