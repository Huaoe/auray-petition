"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  Activity,
  Eye,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { analytics } from "@/lib/analytics";

interface ReferralAnalyticsProps {
  userEmail: string;
}

interface AnalyticsData {
  totalCodeGenerated: number;
  totalValidations: number;
  totalShares: number;
  conversionFunnel: {
    generated: number;
    shared: number;
    validated: number;
    converted: number;
  };
  platformBreakdown: {
    email: number;
    whatsapp: number;
    facebook: number;
    twitter: number;
  };
  leaderboard: {
    email: string;
    referrals: number;
    conversions: number;
    conversionRate: number;
  }[];
}

export const ReferralAnalytics = ({ userEmail }: ReferralAnalyticsProps) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalyticsData();
    // Track analytics dashboard view
    analytics.referral.leaderboardViewed();
  }, [userEmail, selectedPeriod]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simuler des données analytiques (en production, cela viendrait d'une API)
      const mockData: AnalyticsData = {
        totalCodeGenerated: 1,
        totalValidations: 0,
        totalShares: 0,
        conversionFunnel: {
          generated: 1,
          shared: 0,
          validated: 0,
          converted: 0
        },
        platformBreakdown: {
          email: 0,
          whatsapp: 0,
          facebook: 0,
          twitter: 0
        },
        leaderboard: []
      };

      // En production, vous feriez un appel API ici
      // const response = await fetch(`/api/referrals/analytics?email=${userEmail}&period=${selectedPeriod}`);
      // const data = await response.json();
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateConversionRate = (converted: number, total: number) => {
    return total > 0 ? Math.round((converted / total) * 100) : 0;
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Chargement des analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyticsData) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Aucune donnée analytique disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analytics Parrainage
          </CardTitle>
          <CardDescription>
            Analysez les performances de votre système de parrainage
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Sélecteur de période */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === '7d' && '7 jours'}
              {period === '30d' && '30 jours'}
              {period === '90d' && '90 jours'}
            </Button>
          ))}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Codes Générés</p>
                  <p className="text-2xl font-bold">{analyticsData.totalCodeGenerated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Partages</p>
                  <p className="text-2xl font-bold">{analyticsData.totalShares}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Validations</p>
                  <p className="text-2xl font-bold">{analyticsData.totalValidations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Taux Conversion</p>
                  <p className="text-2xl font-bold">
                    {calculateConversionRate(
                      analyticsData.conversionFunnel.converted,
                      analyticsData.conversionFunnel.generated
                    )}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Entonnoir de conversion */}
      <Card>
        <CardHeader>
          <CardTitle>Entonnoir de Conversion</CardTitle>
          <CardDescription>
            Suivez le parcours des utilisateurs depuis la génération du code jusqu'à la conversion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Codes Générés', value: analyticsData.conversionFunnel.generated, color: 'bg-blue-500' },
              { label: 'Codes Partagés', value: analyticsData.conversionFunnel.shared, color: 'bg-green-500' },
              { label: 'Codes Validés', value: analyticsData.conversionFunnel.validated, color: 'bg-orange-500' },
              { label: 'Conversions', value: analyticsData.conversionFunnel.converted, color: 'bg-purple-500' }
            ].map((step, index) => {
              const percentage = analyticsData.conversionFunnel.generated > 0 
                ? (step.value / analyticsData.conversionFunnel.generated) * 100 
                : 0;
              
              return (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium">{step.label}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div 
                      className={`${step.color} h-6 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {step.value} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Répartition par plateforme */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par Plateforme</CardTitle>
          <CardDescription>
            Découvrez quelles plateformes génèrent le plus de partages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analyticsData.platformBreakdown).map(([platform, count]) => (
              <div key={platform} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 capitalize">{platform}</p>
                <p className="text-2xl font-bold">{count}</p>
                <Badge variant="secondary" className="mt-1">
                  {analyticsData.totalShares > 0 
                    ? Math.round((count / analyticsData.totalShares) * 100)
                    : 0
                  }%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Classement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Classement des Parrains
          </CardTitle>
          <CardDescription>
            Top des utilisateurs les plus performants
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsData.leaderboard.length > 0 ? (
            <div className="space-y-2">
              {analyticsData.leaderboard.map((user, index) => (
                <div key={user.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-gray-600">
                        {user.referrals} parrainages • {user.conversions} conversions
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {user.conversionRate}% conversion
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Aucune donnée de classement disponible pour le moment
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralAnalytics;