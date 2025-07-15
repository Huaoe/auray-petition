import Link from 'next/link';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <Frown className="w-24 h-24 text-gray-400 mb-4" />
      <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
      <p className="text-2xl font-medium text-gray-600 mt-2">Page Introuvable</p>
      <p className="text-lg text-gray-500 mt-4 max-w-md">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link 
        href="/"
        className="mt-8 inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
      >
        Retourner à l'accueil
      </Link>
    </div>
  );
}
