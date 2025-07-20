"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wallet, AlertTriangle } from 'lucide-react';

interface BalanceData {
  balance: number;
  email: string;
  payment_due?: boolean;
}

export const StabilityBalance = () => {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching Stability balance from frontend...');
      
      const response = await fetch('/api/stability/balance');
      const data = await response.json();

      console.log('📊 Balance API response:', data);

      if (data.success) {
        setBalance(data);
        setError(null);
        console.log('✅ Balance updated:', data.balance);
      } else {
        setError(data.error || 'Erreur inconnue');
        console.error('❌ Balance API error:', data.error);
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('❌ Balance fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 StabilityBalance component mounted');
    fetchBalance();
    // Rafraîchir toutes les 5 minutes
    const interval = setInterval(fetchBalance, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="w-fit">
        <CardContent className="flex items-center gap-2 p-3">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Chargement solde...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-fit border-red-200">
        <CardContent className="flex items-center gap-2 p-3">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-600">{error}</span>
        </CardContent>
      </Card>
    );
  }

  if (!balance) return null;

  const isLowBalance = balance.balance < 10;

  return (
    <Card className={`w-fit ${isLowBalance ? 'border-orange-200' : 'border-green-200'}`}>
      <CardContent className="flex items-center gap-3 p-3">
        <Wallet className={`h-4 w-4 ${isLowBalance ? 'text-orange-500' : 'text-green-500'}`} />
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Stability AI:</span>
          <Badge variant={isLowBalance ? "destructive" : "secondary"}>
            ${balance.balance.toFixed(2)}
          </Badge>
        </div>

        {balance.payment_due && (
          <Badge variant="destructive" className="text-xs">
            Paiement requis
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
