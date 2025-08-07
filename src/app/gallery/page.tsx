'use client';

import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import SimpleGallery from '@/components/SimpleGallery';

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Back */}
        <div className="mb-8">
          <Link href="/transformations" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux Transformations
          </Link>
        </div>
        
        {/* Hero Section */}
        <section className="relative py-12 mb-16 text-center">
          <div className="max-w-5xl mx-auto">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Galerie des Transformations
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Explorez Toutes les 
              <span className="block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                Transformations
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez toutes les transformations générées par notre communauté.
              Faites défiler pour voir plus de créations inspirantes.
            </p>
          </div>
        </section>
        
        {/* Gallery Section */}
        <section className="py-8">
          <SimpleGallery initialLimit={12} />
        </section>
      </div>
    </div>
  );
};

export default GalleryPage;