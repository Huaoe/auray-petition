"use client";

import { useState, useEffect } from "react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Users, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface Statistics {
  totalSignatures: number;
  daysActive: number;
  approvalRate: number;
}

interface RealTimeSignatureCounterProps {
  initialStats?: Statistics;
  updateInterval?: number; // in milliseconds
  showTrend?: boolean;
  compact?: boolean;
}

export const RealTimeSignatureCounter = ({
  initialStats = { totalSignatures: 0, daysActive: 1, approvalRate: 0 },
  updateInterval = 30000, // 30 seconds
  showTrend = true,
  compact = false
}: RealTimeSignatureCounterProps) => {
  const [stats, setStats] = useState<Statistics>(initialStats);
  const [previousCount, setPreviousCount] = useState(initialStats.totalSignatures);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  // Function to fetch latest statistics
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/signatures", {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.statistics) {
          const newStats = data.statistics;
          
          // Calculate trend
          if (newStats.totalSignatures > stats.totalSignatures) {
            setTrend('up');
          } else if (newStats.totalSignatures < stats.totalSignatures) {
            setTrend('down');
          } else {
            setTrend('stable');
          }

          setPreviousCount(stats.totalSignatures);
          setStats(newStats);
          setLastUpdate(new Date());
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up polling interval
  useEffect(() => {
    const interval = setInterval(fetchStats, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval, stats.totalSignatures]);

  // Initial fetch on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Calculate time since last update
  const getTimeSinceUpdate = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}min`;
    } else {
      return `${Math.floor(diffInSeconds / 3600)}h`;
    }
  };

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
        <Users className="h-4 w-4 text-green-600" />
        <span className="font-semibold text-green-800">
          <AnimatedCounter value={stats.totalSignatures} duration={1000} />
        </span>
        <span className="text-sm text-green-600">signatures</span>
        {showTrend && trend === 'up' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center text-green-600"
          >
            <TrendingUp className="h-3 w-3" />
          </motion.div>
        )}
        {isLoading && (
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Signatures en temps réel</h3>
            <p className="text-sm text-gray-500">Mise à jour automatique</p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
          }`} />
          <span className="text-xs text-gray-500">
            {isLoading ? 'Mise à jour...' : `Il y a ${getTimeSinceUpdate()}`}
          </span>
        </div>
      </div>

      {/* Main counter */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-green-700 mb-2">
          <AnimatedCounter value={stats.totalSignatures} duration={1500} />
        </div>
        <div className="text-sm text-gray-600 font-medium">
          Total des signatures
        </div>
        
        {/* Trend indicator */}
        {showTrend && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex items-center justify-center gap-1"
          >
            {trend === 'up' && (
              <>
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  +{stats.totalSignatures - previousCount} depuis la dernière mise à jour
                </span>
              </>
            )}
            {trend === 'stable' && (
              <span className="text-sm text-gray-500">
                Aucune nouvelle signature
              </span>
            )}
          </motion.div>
        )}
      </div>

      {/* Additional stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-700">
            <AnimatedCounter value={stats.daysActive} duration={800} />
          </div>
          <div className="text-xs text-gray-600">Jours actifs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-700">
            <AnimatedCounter value={stats.approvalRate} duration={800} />%
          </div>
          <div className="text-xs text-gray-600">Satisfaction</div>
        </div>
      </div>

      {/* Auto-refresh info */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>Actualisation automatique toutes les {updateInterval / 1000}s</span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeSignatureCounter;