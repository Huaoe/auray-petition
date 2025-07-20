import { useState, useEffect } from 'react';

interface BalanceData {
  balance: number;
  timestamp: string;
  success: boolean;
}

export const useStabilityBalance = (refreshInterval = 5 * 60 * 1000) => {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      console.log('🔍 [useStabilityBalance] Fetching balance...');
      
      const response = await fetch('/api/stability/balance');
      const data = await response.json();

      console.log('📊 [useStabilityBalance] API response:', data);

      if (data.success) {
        setBalance(data);
        setError(null);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('❌ [useStabilityBalance] Error:', err);
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchBalance, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return { balance, loading, error, refetch: fetchBalance };
};