import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-green-700">
            Pétition Citoyenne
          </Link>
          <nav className="flex space-x-6 text-sm">
            <Link
              href="/contexte"
              className="text-gray-600 hover:text-green-700 transition-colors"
            >
              Contexte
            </Link>
            <Link
              href="/vision"
              className="text-gray-600 hover:text-green-700 transition-colors"
            >
              Notre Vision
            </Link>
            <Link
              href="/philosophie"
              className="text-gray-600 hover:text-green-700 transition-colors"
            >
              Philosophie
            </Link>
            <Link
              href="/transformations"
              className="relative text-purple-600 hover:text-purple-700 transition-colors font-medium flex items-center"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Transformations IA
              <span className="absolute -top-5 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                NEW
              </span>
            </Link>
            <a
              href="#petition"
              className="text-gray-600 hover:text-green-700 transition-colors"
            >
              Signer
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-green-700 transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
