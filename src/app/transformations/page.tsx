'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Download, Star, Eye, Clock, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge, badgeVariants } from '@/components/ui/badge';
import Header from '@/components/Header';
import ChurchTransformation from '@/components/ChurchTransformation';

interface TransformationStats {
  totalGenerations: number;
  activeUsers: number;
  averageTime: number;
  popularTransformation: string;
}

const TransformationsPage = () => {
  const [stats, setStats] = useState<TransformationStats>({
    totalGenerations: 0,
    activeUsers: 0,
    averageTime: 0,
    popularTransformation: 'Bibliothèque Moderne'
  });

  useEffect(() => {
    // Simuler des statistiques temps réel
    setStats({
      totalGenerations: Math.floor(Math.random() * 150) + 50,
      activeUsers: Math.floor(Math.random() * 25) + 5,
      averageTime: Math.floor(Math.random() * 3) + 4,
      popularTransformation: 'Restaurant Gastronomique'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Back */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la pétition
            </Link>
          </div>

          {/* Hero Content */}
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            <div className="space-y-8">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 mr-2" />
                IA Générative • Révolutionnaire • Temps Réel
              </Badge>
              
              <h1 className="text-4xl md:text-7xl font-bold text-gray-900 leading-relaxed">
                Révolutionnez
                <span className="block text-transparent bg-gradient-to-r leading-snug from-blue-600 via-purple-600 to-pink-600 bg-clip-text ">
                  l'Église d'Auray
                </span>
                <span className="block text-3xl md:text-5xl text-gray-700 mt-4">
                  avec l'Intelligence Artificielle
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Explorez 10 transformations révolutionnaires générées par l'IA. 
                Découvrez comment l'église Saint-Gildas pourrait servir la communauté différemment 
                tout en respectant son patrimoine architectural.
              </p>
            </div>

            {/* Statistiques Temps Réel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200">
                <div className="flex items-center justify-center mb-2">
                  <Eye className="h-6 w-6 text-blue-600 mr-2" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalGenerations}
                </div>
                <p className="text-sm text-gray-600">Générations</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-purple-600 mr-2" />
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.activeUsers}
                </div>
                <p className="text-sm text-gray-600">Utilisateurs</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-200">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-green-600 mr-2" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.averageTime}s
                </div>
                <p className="text-sm text-gray-600">Génération</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-orange-600 mr-2" />
                </div>
                <div className="text-lg font-bold text-orange-600">
                  #1
                </div>
                <p className="text-sm text-gray-600">Populaire</p>
              </div>
            </div>

            {/* CTA Principal */}
            <div className="space-y-4">
              <Button 
                size="lg"
                className="text-lg px-10 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => {
                  document.getElementById('transformation-studio')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                Commencer ma Transformation
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500">
                Génération HD • 3-8 secondes • Partage instantané
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio de Transformation */}
      <section id="transformation-studio" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <ChurchTransformation />
        </div>
      </section>

      {/* Section Informative */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                Innovation & Patrimoine
              </Badge>
              <h3 className="text-3xl font-bold text-gray-900">
                L'IA au Service du Dialogue Citoyen
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Cette technologie révolutionnaire permet d'ouvrir un dialogue constructif 
                sur l'avenir de notre patrimoine. Chaque transformation respecte 
                l'architecture originale tout en explorant de nouvelles possibilités 
                d'usage pour la communauté.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">10</div>
                  <div className="text-sm text-gray-600">Transformations</div>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">HD</div>
                  <div className="text-sm text-gray-600">Qualité 1024x1024</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Fonctionnalités Avancées
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Génération Temps Réel</div>
                    <div className="text-sm text-gray-600">Images HD générées en 3-8 secondes</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Comparaison Avant/Après</div>
                    <div className="text-sm text-gray-600">Interface immersive de visualisation</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Partage Optimisé</div>
                    <div className="text-sm text-gray-600">Téléchargement et partage social</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Respect Patrimonial</div>
                    <div className="text-sm text-gray-600">Prompts optimisés et respectueux</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-3xl md:text-4xl font-bold">
            Participez à la Révolution Numérique
          </h3>
          <p className="text-xl text-gray-300 leading-relaxed">
            Votre signature compte pour ouvrir le dialogue sur l'avenir de notre patrimoine. 
            Après avoir exploré les transformations, rejoignez le mouvement !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg"
            >
              <Link href="/#signature-form">
                Signer la Pétition
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Transformations IA - Église d\'Auray',
                    text: 'Découvrez les transformations révolutionnaires de l\'église d\'Auray générées par l\'IA !',
                    url: window.location.href
                  });
                }
              }}
            >
              <Share2 className="mr-2 h-5 w-5" />
              Partager
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TransformationsPage;
