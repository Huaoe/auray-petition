// Google Analytics 4 Configuration et Événements
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Vérifier si GA est disponible
export const isGAEnabled = (): boolean => {
  return !!GA_TRACKING_ID && typeof window !== 'undefined' && !!window.gtag;
};

// Suivre les pages vues
export const pageview = (url: string): void => {
  if (!isGAEnabled()) return;
  
  window.gtag('config', GA_TRACKING_ID!, {
    page_path: url,
  });
};

// Événements personnalisés
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
): void => {
  if (!isGAEnabled()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Événements spécifiques à la pétition
export const analytics = {
  // Signature de pétition
  signatureSent: (success: boolean) => {
    trackEvent(
      success ? 'signature_success' : 'signature_error',
      'petition',
      success ? 'Signature réussie' : 'Erreur signature'
    );
  },

  // Consultation des statistiques
  statsViewed: () => {
    trackEvent('stats_viewed', 'engagement', 'Consultation statistiques');
  },

  // Partage social
  socialShare: (platform: string) => {
    trackEvent('share', 'social', platform);
  },

  // Téléchargement PWA
  pwaInstall: () => {
    trackEvent('pwa_install', 'engagement', 'Installation PWA');
  },

  // Erreurs
  error: (errorType: string, errorMessage?: string) => {
    trackEvent('error', 'technical', `${errorType}: ${errorMessage}`);
  },

  // Engagement utilisateur
  formInteraction: (field: string) => {
    trackEvent('form_interaction', 'engagement', field);
  },

  // Performance
  pageLoadTime: (loadTime: number) => {
    trackEvent('page_load_time', 'performance', 'Load Time', loadTime);
  },

  // Événements de parrainage
  referral: {
    // Génération de code de parrainage
    codeGenerated: (email: string) => {
      trackEvent('referral_code_generated', 'referral', `Code généré pour ${email}`);
    },

    // Validation de code de parrainage
    codeValidated: (code: string, referrerEmail: string, success: boolean) => {
      trackEvent(
        success ? 'referral_code_valid' : 'referral_code_invalid',
        'referral',
        `Code ${code} - Parrain: ${referrerEmail}`
      );
    },

    // Utilisation réussie d'un code de parrainage
    codeUsed: (code: string, referrerEmail: string, newUserEmail: string) => {
      trackEvent('referral_code_used', 'referral', `${code}: ${referrerEmail} -> ${newUserEmail}`);
    },

    // Attribution de bonus de parrainage
    bonusAwarded: (referrerEmail: string, bonusAmount: number) => {
      trackEvent('referral_bonus_awarded', 'referral', `Bonus ${bonusAmount} pour ${referrerEmail}`);
    },

    // Partage de code de parrainage
    codeShared: (platform: string, referrerEmail: string) => {
      trackEvent('referral_code_shared', 'referral', `Partagé sur ${platform} par ${referrerEmail}`);
    },

    // Consultation du tableau de bord de parrainage
    dashboardViewed: (email: string) => {
      trackEvent('referral_dashboard_viewed', 'referral', `Dashboard consulté par ${email}`);
    },

    // Consultation du classement
    leaderboardViewed: () => {
      trackEvent('referral_leaderboard_viewed', 'referral', 'Classement consulté');
    },

    // Conversion de parrainage (signature avec code)
    conversionCompleted: (code: string, referrerEmail: string, conversionValue?: number) => {
      trackEvent('referral_conversion', 'referral', `Conversion ${code}: ${referrerEmail}`, conversionValue);
    }
  }
};
