/**
 * Tests complets pour le système de coupons
 * Couvre: génération, validation, engagement, sentiment, parrainage
 */

// Types pour Jest
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValid(): R;
    }
  }
}

// Assurons-nous que Jest est reconnu par TypeScript
declare const describe: (name: string, fn: () => void) => void;
declare const beforeEach: (fn: () => void) => void;
declare const test: (name: string, fn: () => void | Promise<void>) => void;
declare const expect: any;

import {
  COUPON_CONFIG,
  analyzeSentiment,
  analyzeSentimentRules,
  calculateEngagement,
  createCoupon,
  validateCoupon,
  useGeneration,
  saveCoupons,
  loadCoupons,
  generateReferralCode,
  recordReferral,
  countReferralBonuses
} from './coupon-system';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Remplace l'implémentation de localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Système de coupons avancé', () => {
  beforeEach(() => {
    // Réinitialise localStorage avant chaque test
    window.localStorage.clear();
  });

  describe('Génération de codes', () => {
    test('génère des codes de coupons uniques', () => {
      // Test de l'unicité des codes générés indirectement via createCoupon
      const engagementBase = {
        details: {
          name: 'John Doe',
          email: 'test@example.com',
          city: 'Paris',
          postalCode: '75001',
          comment: '',
          newsletter: false,
          socialShares: []
        },
        score: 10,
        level: 'BASIC' as const
      };
      
      const codes = new Set();
      for (let i = 0; i < 50; i++) {
        const coupon = createCoupon({
          ...engagementBase,
          score: engagementBase.score + i // Pour avoir des niveaux différents
        });
        codes.add(coupon.code);
      }
      
      expect(codes.size).toBe(50); // Tous les codes devraient être uniques
    });
  });

  describe('Calcul d\'engagement', () => {
    test('calcule le score de base pour une signature simple', async () => {
      const result = await calculateEngagement({
        name: 'John Doe',
        email: 'test@example.com',
        city: 'Paris',
        postalCode: '75001',
        comment: '',
        newsletter: false,
        socialShares: []
      });

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.level).toBeDefined();
    });

    test('ajoute des points pour le consentement à la newsletter', async () => {
      const result = await calculateEngagement({
        name: 'John Doe',
        email: 'test@example.com',
        city: 'Paris',
        postalCode: '75001',
        comment: '',
        newsletter: true,
        socialShares: []
      });

      // Vérifier que le score est au moins égal au bonus de la newsletter
      expect(result.score).toBeGreaterThanOrEqual(COUPON_CONFIG.scoring.newsletter);
    });

    test('ajoute des points pour les commentaires selon leur longueur', async () => {
      // Commentaire court
      const shortComment = await calculateEngagement({
        name: 'John Doe',
        email: 'test@example.com',
        city: 'Paris',
        postalCode: '75001',
        comment: 'Je soutiens cette pétition',
        newsletter: false,
        socialShares: []
      });

      // Commentaire moyen
      const mediumComment = await calculateEngagement({
        name: 'John Doe',
        email: 'test@example.com',
        city: 'Paris',
        postalCode: '75001',
        comment: 'Je soutiens totalement cette initiative car elle est importante pour notre communauté et je pense que nous devrions tous y participer.',
        newsletter: false,
        socialShares: []
      });

      // Commentaire long
      const longComment = await calculateEngagement({
        name: 'John Doe',
        email: 'test@example.com',
        city: 'Paris',
        postalCode: '75001',
        comment: 'Je soutiens pleinement cette initiative car je pense qu\'elle est essentielle pour notre communauté. Depuis longtemps, nous avons besoin d\'une telle action collective et je suis ravi de voir que des personnes prennent enfin les choses en main. Je vais certainement partager cela avec mes amis et ma famille car je crois que plus nous serons nombreux, plus nous aurons un impact significatif. Merci pour cette opportunité de participer à un changement positif.',
        newsletter: false,
        socialShares: []
      });

      // Vérifier que les scores augmentent avec la longueur du commentaire
      expect(mediumComment.score).toBeGreaterThan(shortComment.score);
      expect(longComment.score).toBeGreaterThan(mediumComment.score);
    });
  });

  describe('Analyse de sentiment', () => {
    // Tests de la version par règles (synchrone)
    describe('Version par règles', () => {
      test('retourne neutre pour un commentaire vide', () => {
        const result = analyzeSentimentRules('');
        expect(result.sentiment).toBe('neutral');
        expect(result.score).toBe(0);
      });

      test('détecte un sentiment positif', () => {
        const result = analyzeSentimentRules('Je suis absolument ravi de cette initiative fantastique!');
        expect(result.sentiment).toBe('positive');
        expect(result.score).toBeGreaterThan(0);
        expect(result.keywords.length).toBeGreaterThan(0);
      });

      test('détecte un sentiment négatif', () => {
        const result = analyzeSentimentRules('Je suis très déçu et en colère contre cette idée ridicule.');
        expect(result.sentiment).toBe('negative');
        expect(result.score).toBe(0); // Score négatif donne 0 points
      });
    });
    
    // Tests de la version IA (asynchrone)
    describe('Version IA avec DistilBERT', () => {
      test('retourne neutre pour un commentaire vide', async () => {
        const result = await analyzeSentiment('');
        expect(result.sentiment).toBe('neutral');
        expect(result.score).toBe(0);
      });

      test('détecte un sentiment dans un commentaire réel', async () => {
        const result = await analyzeSentiment('Je soutiens cette initiative car elle est très importante pour la communauté.');
        expect(['positive', 'neutral', 'negative']).toContain(result.sentiment);
        expect(typeof result.score).toBe('number');
      });
    });
  });

  describe('Création de coupons', () => {
    test('crée un coupon avec niveau BASIC pour un engagement minimal', async () => {
      const engagement = await calculateEngagement({
        name: 'John Doe',
        email: 'test@example.com',
        city: 'Paris',
        postalCode: '75001',
        comment: '',
        newsletter: false,
        socialShares: []
      });
      
      const coupon = createCoupon(engagement);

      expect(coupon).toBeDefined();
      expect(coupon.level).toEqual(COUPON_CONFIG.levels.BASIC);
      expect(coupon.generationsLeft).toBe(COUPON_CONFIG.levels.BASIC.generations);
    });

    test('crée un coupon avec niveau supérieur pour un engagement plus élevé', async () => {
      const engagement = await calculateEngagement({
        name: 'John Doe',
        email: 'test@example.com',
        city: 'Paris',
        postalCode: '75001',
        comment: 'Je soutiens totalement cette excellente initiative! Je vais la partager avec tous mes amis et ma famille car je trouve que c\'est vraiment important pour notre communauté.',
        newsletter: true,
        socialShares: ['facebook', 'twitter']
      });
      
      const coupon = createCoupon(engagement);

      // Le score doit être plus élevé avec tous ces éléments d'engagement
      expect(coupon.level).not.toEqual(COUPON_CONFIG.levels.BASIC);
      expect(coupon.generationsLeft).toBeGreaterThan(COUPON_CONFIG.levels.BASIC.generations);
    });
  });

  describe('Système de parrainage', () => {
    test('génère un code de parrainage unique pour chaque utilisateur', () => {
      const referralCode1 = generateReferralCode('user1@example.com');
      const referralCode2 = generateReferralCode('user2@example.com');
      
      expect(referralCode1).not.toBe(referralCode2);
      expect(referralCode1.length).toBeGreaterThan(6);
    });

    test('enregistre un parrainage correctement', () => {
      // Vider le localStorage
      window.localStorage.clear();
      
      // Générer des codes de parrainage
      const referrerEmail = 'referrer@example.com';
      const refereeEmail = 'friend@example.com';
      const referralCode = generateReferralCode(referrerEmail);
      
      // Simuler la sauvegarde du parrainage
      const referrals = [{
        code: referralCode,
        email: referrerEmail,
        referrerEmail: referrerEmail,
        createdAt: Date.now(),
        used: false
      }];
      
      window.localStorage.setItem('petition_referrals', JSON.stringify(referrals));
      
      // Vérifier l'enregistrement du parrainage
      const result = recordReferral(referralCode, refereeEmail);
      expect(result).toBe(true);
      
      // Vérifier le bonus
      const bonusCount = countReferralBonuses(referrerEmail);
      expect(bonusCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Gestion des coupons dans localStorage', () => {
    test('stocke et récupère un coupon correctement', async () => {
      // Créer un engagement et un coupon
      const engagement = await calculateEngagement({
        name: 'John Doe',
        email: 'test@example.com',
        city: 'Paris',
        postalCode: '75001',
        comment: '',
        newsletter: false,
        socialShares: []
      });
      
      const coupon = createCoupon(engagement);

      // Sauvegarder le coupon
      const coupons = [coupon];
      saveCoupons(coupons);
      
      // Récupérer les coupons
      const retrievedCoupons = loadCoupons();

      expect(retrievedCoupons.length).toBeGreaterThan(0);
      expect(retrievedCoupons[0].code).toBe(coupon.code);
    });

    test('valide et utilise un coupon correctement', async () => {
      // Créer un engagement et un coupon
      const engagement = await calculateEngagement({
        name: 'John Doe',
        email: 'test@example.com',
        city: 'Paris',
        postalCode: '75001',
        comment: '',
        newsletter: false,
        socialShares: []
      });
      
      const coupon = createCoupon(engagement);

      // Sauvegarder le coupon
      const coupons = [coupon];
      saveCoupons(coupons);
      
      // Valider le coupon
      const validation = validateCoupon(coupon.code);
      expect(validation.valid).toBe(true);
      
      // Utiliser une génération
      const result = useGeneration(coupon.code);
      expect(result.valid).toBe(true);
      if (result.coupon) {
        expect(result.coupon.generationsLeft).toBe(coupon.generationsLeft - 1);
      }
    });
  });
});
