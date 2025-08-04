"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Wallet, AlertTriangle, Gift, CheckCircle } from 'lucide-react';
import { getVirtualCreditSystem, getAvailableVirtualCredits, canUseTransformation, updateRealStabilityBalance } from '@/lib/virtual-credits-system';
import { Progress } from "@/components/ui/progress";

export const VirtualCreditsDisplay = () => {
  const [system, setSystem] = useState(getVirtualCreditSystem());
  const [realBalance, setRealBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  const availableCredits = getAvailableVirtualCredits();
  const canTransform = canUseTransformation();
  
  // Configuration des seuils
  const COMFORTABLE_BALANCE = 5000; // Solde convenable en crédits
  const BUFFER_PERCENTAGE = 20; // 20% de tampon
  const bufferBalance = realBalance ? realBalance * (BUFFER_PERCENTAGE / 100) : 0;
  const targetBalance = COMFORTABLE_BALANCE + bufferBalance;
  
  // Calcul de la progression vers le solde convenable
  const currentBalance = realBalance || 0;
  const progressPercentage = Math.min((currentBalance / targetBalance) * 100, 100);
  
  // Déterminer la couleur de la barre selon le niveau
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    if (percentage >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const handleDonate = () => {
    window.open('https://www.buymeacoffee.com/huaoe', '_blank');
  };

  const fetchRealBalance = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stability/balance');
      const data = await response.json();
      
      if (data.success && typeof data.balance === 'number') {
        setRealBalance(data.balance);
        // Update the virtual credit system with real balance
        const updatedSystem = updateRealStabilityBalance(data.balance);
        setSystem(updatedSystem);
      }
    } catch (error) {
      console.error('❌ Error fetching real balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealBalance();
    // Refresh every 30 seconds
    const interval = setInterval(fetchRealBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`${!canTransform ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
      <CardContent className="p-4">
        {/* Desktop layout */}
        <div className="hidden md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="font-medium">Crédits restants sur l'app</span>
          </div>
          
          <Progress
            value={progressPercentage}
            className="h-2 w-28 mx-4"
          />
          
          <div className="text-sm font-medium flex items-center">
            il ne reste que {(availableCredits || 0).toFixed(2)}
            <img
              src="/icons/stability-ai.webp"
              alt="Stability AI"
              className="w-4 h-4 mx-1 inline-block"
            />
            sur notre compte ! please help us{' ->'}
          </div>
          
          <Button onClick={handleDonate} size="sm" className="gap-1 ml-2">
            <Coffee className="h-3 w-3" />
            Recharger
          </Button>
        </div>

        {/* Mobile layout */}
        <div className="flex flex-col md:hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="font-medium">Crédits restants sur l'app</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium flex items-center">
              il ne reste que {(availableCredits || 0).toFixed(2)}
            </div>
            
            <Progress
              value={progressPercentage}
              className="h-2 w-16 mx-2"
            />
            
            <div className="flex items-center">
              <img
                src="/icons/stability-ai.webp"
                alt="Stability AI"
                className="w-5 h-5 mr-1"
              />
              <span className="text-xs">sur notre compte</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">please help us →</span>
            <Button onClick={handleDonate} size="sm" className="gap-1">
              <Coffee className="h-3 w-3" />
              Recharger
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};






