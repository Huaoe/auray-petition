'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, BarChart2, AlertTriangle } from 'lucide-react';

interface Statistics {
  totalSignatures: number;
  signaturesToday: number;
  signaturesThisWeek: number;
  signaturesByCity: { [key: string]: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/signatures');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setStats(data.statistics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <main className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord Administrateur</h1>
          <div className="flex items-center bg-yellow-100 text-yellow-800 p-2 rounded-md text-sm">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>Cette page doit être sécurisée à l'avenir.</span>
          </div>
        </div>

        {loading && <p className="text-center text-gray-500">Chargement des statistiques...</p>}
        {error && <p className="text-center text-red-500">Erreur: {error}</p>}

        {stats && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total des Signatures</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSignatures}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Signatures Aujourd'hui</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.signaturesToday}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Signatures cette Semaine</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.signaturesThisWeek}</div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
