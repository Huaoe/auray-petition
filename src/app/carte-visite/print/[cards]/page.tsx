'use client';

import { BusinessCard } from '@/components/QRBusinessCard';

export default function PrintPage() {
  const cardsArray = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="grid grid-cols-2 gap-6 mx-0 sm:max-w-4xl sm:mx-auto">
        {cardsArray.map((index) => (
          <BusinessCard key={index} />
        ))}
      </div>
      
      <div className="text-center mt-8 text-gray-600 text-sm">
        ✂️ Découper le long des lignes pour obtenir 6 cartes de visite
      </div>
    </div>
  );
}
