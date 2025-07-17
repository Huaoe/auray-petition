"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReferralDashboard from "@/components/ReferralDashboard";
import ReferralAnalytics from "@/components/ReferralAnalytics";
import { Users, BarChart3 } from "lucide-react";

const ReferralsPage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail.trim()) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Système de Parrainage
            </CardTitle>
            <CardDescription>
              Entrez votre email pour accéder au tableau de bord de parrainage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Accéder au Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Système de Parrainage
          </h1>
          <p className="text-gray-600">
            Connecté en tant que: <span className="font-medium">{userEmail}</span>
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'outline'}
              onClick={() => setActiveTab('analytics')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <ReferralDashboard userEmail={userEmail} />
        )}
        
        {activeTab === 'analytics' && (
          <ReferralAnalytics userEmail={userEmail} />
        )}

        {/* Test Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions de Test</CardTitle>
            <CardDescription>
              Comment tester le système de parrainage complet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">1. Génération de Code</h4>
              <p className="text-blue-800 text-sm">
                Votre code de parrainage a été automatiquement généré. Copiez-le depuis le dashboard.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">2. Test de Partage</h4>
              <p className="text-green-800 text-sm">
                Utilisez les boutons de partage pour tester l'intégration avec les réseaux sociaux.
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">3. Test de Validation</h4>
              <p className="text-orange-800 text-sm">
                Allez sur la page principale et utilisez votre code de parrainage dans le formulaire de signature.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">4. Vérification des Bonus</h4>
              <p className="text-purple-800 text-sm">
                Après une signature avec votre code, vérifiez que les bonus sont correctement attribués.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralsPage;