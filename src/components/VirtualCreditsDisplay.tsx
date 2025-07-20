"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Wallet, AlertTriangle, Gift } from 'lucide-react';
import { getVirtualCreditSystem, getAvailableVirtualCredits, canUseTransformation, updateRealStabilityBalance } from '@/lib/virtual-credits-system';

export const VirtualCreditsDisplay = () => {
  const [system, setSystem] = useState(getVirtualCreditSystem());
  const [realBalance, setRealBalance] = useState<number | null>(null);
  
  const availableCredits = getAvailableVirtualCredits();
  const canTransform = canUseTransformation();
  const usagePercentage = system.virtualCreditsLimit > 0 
    ? (system.virtualCreditsUsed / system.virtualCreditsLimit) * 100 
    : 0;

  // Récupérer le vrai solde Stability AI
  useEffect(() => {
    const fetchRealBalance = async () => {
      try {
        const response = await fetch('/api/stability/balance');
        const data = await response.json();
        if (data.success) {
          setRealBalance(data.balance);
          const updatedSystem = updateRealStabilityBalance(data.balance);
          setSystem(updatedSystem);
        }
      } catch (error) {
        console.error('Erreur récupération solde:', error);
      }
    };

    fetchRealBalance();
    const interval = setInterval(fetchRealBalance, 2 * 60 * 1000); // Toutes les 2 minutes
    return () => clearInterval(interval);
  }, []);

  const handleDonate = () => {
    window.open('https://www.buymeacoffee.com/huaoe', '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Affichage principal des crédits */}
      <Card className={`${!canTransform ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Crédits Virtuels
            </div>
            <Badge variant={canTransform ? "secondary" : "destructive"}>
              ${availableCredits.toFixed(2)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Utilisés: ${system.virtualCreditsUsed.toFixed(2)}</span>
              <span>Limite: ${system.virtualCreditsLimit.toFixed(2)}</span>
            </div>
            {/* Barre de progression simple */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, usagePercentage)}%` }}
              />
            </div>
          </div>

          {/* Statut */}
          {!canTransform && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              Crédits épuisés - Donation requise pour continuer
            </div>
          )}

          {/* Bouton de don */}
          {!canTransform && (
            <Button onClick={handleDonate} className="w-full gap-2">
              <Coffee className="h-4 w-4" />
              Faire un don pour débloquer
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Informations système (mode développement) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-700">Debug - Système de Crédits</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <div>Solde réel Stability: ${realBalance?.toFixed(2) || 'Chargement...'}</div>
            <div>Tampon (20%): ${realBalance ? (realBalance * 0.2).toFixed(2) : '...'}</div>
            <div>Limite virtuelle: ${system.virtualCreditsLimit.toFixed(2)}</div>
            <div>Crédits utilisés: ${system.virtualCreditsUsed.toFixed(2)}</div>
            <div>Disponibles: ${availableCredits.toFixed(2)}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
