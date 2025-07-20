interface VirtualCreditSystem {
  realStabilityBalance: number;
  virtualCreditsLimit: number;
  virtualCreditsUsed: number;
  lastUpdated: number;
}

interface Donation {
  id: string;
  amount: number;
  creditsAdded: number;
  timestamp: number;
  buyMeACoffeeId?: string;
}

// Configuration du tampon (ex: garder 20% des crédits Stability en réserve)
const BUFFER_PERCENTAGE = 0.2; // 20% de tampon
const CREDITS_PER_DOLLAR = 25; // 1$ de don = 25 générations (~$1 de crédits Stability)

export const getVirtualCreditSystem = (): VirtualCreditSystem => {
  if (typeof window === 'undefined') {
    return { realStabilityBalance: 0, virtualCreditsLimit: 0, virtualCreditsUsed: 0, lastUpdated: 0 };
  }

  // Détecter le mode développement de manière plus robuste
  const isDevelopment = process.env.NODE_ENV === "development" || 
                       window.location.hostname === "localhost" || 
                       window.location.hostname === "127.0.0.1" ||
                       window.location.port === "3000";

  if (isDevelopment) {
    console.log("🔍 [DEBUG] Development mode detected - using mock credits");
    return {
      realStabilityBalance: 10.0,
      virtualCreditsLimit: 5.0,
      virtualCreditsUsed: 0,
      lastUpdated: Date.now()
    };
  }

  const stored = localStorage.getItem('virtual_credit_system');
  return stored ? JSON.parse(stored) : {
    realStabilityBalance: 0,
    virtualCreditsLimit: 0,
    virtualCreditsUsed: 0,
    lastUpdated: 0
  };
};

export const updateRealStabilityBalance = (realBalance: number): VirtualCreditSystem => {
  const system = getVirtualCreditSystem();
  
  // Calculer la limite virtuelle (balance réelle - tampon)
  const bufferAmount = realBalance * BUFFER_PERCENTAGE;
  const maxVirtualCredits = Math.max(0, realBalance - bufferAmount);
  
  const updatedSystem: VirtualCreditSystem = {
    ...system,
    realStabilityBalance: realBalance,
    virtualCreditsLimit: Math.max(system.virtualCreditsLimit, maxVirtualCredits),
    lastUpdated: Date.now()
  };
  
  localStorage.setItem('virtual_credit_system', JSON.stringify(updatedSystem));
  return updatedSystem;
};

export const getAvailableVirtualCredits = (): number => {
  const system = getVirtualCreditSystem();
  return Math.max(0, system.virtualCreditsLimit - system.virtualCreditsUsed);
};

export const canUseTransformation = (): boolean => {
  // En mode développement, toujours autoriser
  const isDevelopment = process.env.NODE_ENV === "development" || 
                       (typeof window !== 'undefined' && 
                        (window.location.hostname === "localhost" || 
                         window.location.hostname === "127.0.0.1"));
  
  if (isDevelopment) {
    console.log("🔍 [DEBUG] Development mode - transformation allowed");
  }
  
  const available = getAvailableVirtualCredits();
  const canUse = available >= 0.04 || isDevelopment;
  
  console.log("🔍 [DEBUG] canUseTransformation:", {
    availableCredits: available,
    required: 0.04,
    canUse,
    system: getVirtualCreditSystem(),
    isDevelopment
  });
  
  return canUse;
};

export const useVirtualCredit = (amount: number = 0.04): boolean => {
  // En mode développement, ne pas consommer de crédits
  const isDevelopment = process.env.NODE_ENV === "development" || 
                       (typeof window !== 'undefined' && 
                        (window.location.hostname === "localhost" || 
                         window.location.hostname === "127.0.0.1"));
  
  if (isDevelopment) {
    console.log("🔍 [DEBUG] Development mode - credit usage skipped");
    return true;
  }
  
  if (!canUseTransformation()) return false;
  
  const system = getVirtualCreditSystem();
  system.virtualCreditsUsed += amount;
  system.lastUpdated = Date.now();
  
  localStorage.setItem('virtual_credit_system', JSON.stringify(system));
  return true;
};

export const addDonationCredits = (donationAmount: number, buyMeACoffeeId?: string): Donation => {
  const creditsToAdd = donationAmount * CREDITS_PER_DOLLAR * 0.04; // Convertir en $ de crédits
  
  const system = getVirtualCreditSystem();
  system.virtualCreditsLimit += creditsToAdd;
  system.lastUpdated = Date.now();
  
  const donation: Donation = {
    id: generateRandomCode(12),
    amount: donationAmount,
    creditsAdded: creditsToAdd,
    timestamp: Date.now(),
    buyMeACoffeeId
  };
  
  // Sauvegarder le don
  const donations = getDonations();
  donations.push(donation);
  localStorage.setItem('donations', JSON.stringify(donations));
  
  // Mettre à jour le système
  localStorage.setItem('virtual_credit_system', JSON.stringify(system));
  
  return donation;
};

const getDonations = (): Donation[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('donations');
  return stored ? JSON.parse(stored) : [];
};

const generateRandomCode = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};



