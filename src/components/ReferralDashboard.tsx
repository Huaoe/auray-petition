"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Gift, 
  Share2, 
  Copy, 
  Trophy, 
  TrendingUp,
  Mail,
  MessageCircle,
  Facebook,
  Twitter
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/toaster";
import {
  generateReferralCode,
  getReferralStats,
  loadCoupons,
  type ReferralStats,
  type EnhancedCouponData
} from "@/lib/coupon-system";
import { analytics } from "@/lib/analytics";

interface ReferralDashboardProps {
  userEmail: string;
}

export const ReferralDashboard = ({ userEmail }: ReferralDashboardProps) => {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string>("");
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [userCoupon, setUserCoupon] = useState<EnhancedCouponData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, [userEmail]);

  const loadReferralData = async () => {
    setIsLoading(true);
    try {
      // Générer ou récupérer le code de parrainage
      const code = generateReferralCode(userEmail);
      setReferralCode(code);

      // Charger les statistiques
      const referralStats = getReferralStats(userEmail);
      setStats(referralStats);

      // Charger le coupon de l'utilisateur
      const coupons = loadCoupons();
      const userCouponData = coupons.find(c => c.email === userEmail) as EnhancedCouponData;
      setUserCoupon(userCouponData);

      // Analytics tracking
      analytics.referral.dashboardViewed(userEmail);
    } catch (error) {
      console.error('Erreur lors du chargement des données de parrainage:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de parrainage.",
        variant: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copié !",
      description: "Le code de parrainage a été copié dans le presse-papiers.",
    });
  };

  const shareReferralCode = (platform: string) => {
    const message = `Rejoignez-moi pour signer cette pétition importante ! Utilisez mon code de parrainage ${referralCode} pour obtenir des bonus. `;
    const url = `${window.location.origin}?ref=${referralCode}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'email':
        shareUrl = `mailto:?subject=Signez cette pétition importante&body=${encodeURIComponent(message + url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
        break;
      default:
        copyReferralCode();
        return;
    }
    
    // Analytics tracking
    analytics.referral.codeShared(platform, userEmail);
    analytics.socialShare(platform);
    
    window.open(shareUrl, '_blank');
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Chargement...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* En-tête du tableau de bord */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Users className="h-6 w-6 text-primary" />
            Tableau de Bord Parrainage
          </CardTitle>
          <CardDescription>
            Partagez votre code et gagnez des générations IA bonus pour chaque personne qui signe !
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Parrainages</p>
                  <p className="text-2xl font-bold">{stats?.totalReferrals || 0}</p>
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
                <Trophy className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Parrainages Réussis</p>
                  <p className="text-2xl font-bold">{stats?.successfulReferrals || 0}</p>
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
                <Gift className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Bonus Gagnés</p>
                  <p className="text-2xl font-bold">+{stats?.totalBonusGenerations || 0}</p>
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
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Taux de Conversion</p>
                  <p className="text-2xl font-bold">{stats?.conversionRate || 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Code de parrainage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Votre Code de Parrainage
          </CardTitle>
          <CardDescription>
            Partagez ce code avec vos amis et famille pour qu'ils obtiennent des bonus en signant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="referral-code">Code de parrainage</Label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="referral-code"
              value={referralCode}
              readOnly
              className="font-mono text-lg"
            />
            <Button onClick={copyReferralCode} variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* Boutons de partage */}
          <div className="space-y-2">
            <Label>Partager sur :</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => shareReferralCode('email')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button
                onClick={() => shareReferralCode('whatsapp')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                onClick={() => shareReferralCode('facebook')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                onClick={() => shareReferralCode('twitter')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations sur le coupon */}
      {userCoupon && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Votre Coupon IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Code Coupon</p>
                <p className="font-mono text-lg font-bold">{userCoupon.code}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Générations Restantes</p>
                <p className="text-2xl font-bold text-green-600">{userCoupon.generationsLeft}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Bonus Parrainage</p>
                <p className="text-2xl font-bold text-purple-600">+{userCoupon.referralBonuses || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comment ça marche */}
      <Card>
        <CardHeader>
          <CardTitle>Comment ça marche ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-semibold">Partagez votre code</p>
                <p className="text-sm text-gray-600">Envoyez votre code de parrainage à vos amis et famille</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-semibold">Ils signent avec votre code</p>
                <p className="text-sm text-gray-600">Quand quelqu'un utilise votre code pour signer, vous gagnez tous les deux des bonus</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-semibold">Gagnez des générations IA</p>
                <p className="text-sm text-gray-600">Chaque parrainage réussi vous donne +1 génération IA gratuite</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats && stats.pendingReferrals > 0 && (
        <Alert>
          <Users className="h-4 w-4" />
          <AlertDescription>
            Vous avez {stats.pendingReferrals} parrainage(s) en attente. 
            Encouragez vos contacts à signer pour débloquer vos bonus !
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ReferralDashboard;