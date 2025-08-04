"use client";

import Link from 'next/link';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = (
    <>
      <a
        href="/#petition"
        className="text-gray-600 hover:text-green-700 transition-colors block py-2 md:py-0"
        onClick={() => setIsMenuOpen(false)}
      >
        Signer
      </a>
      <Link
        href="/contexte"
        className="text-gray-600 hover:text-green-700 transition-colors block py-2 md:py-0"
        onClick={() => setIsMenuOpen(false)}
      >
        Contexte
      </Link>
      <Link
        href="/vision"
        className="text-gray-600 hover:text-green-700 transition-colors block py-2 md:py-0"
        onClick={() => setIsMenuOpen(false)}
      >
        Notre Vision
      </Link>
      <Link
        href="/philosophie"
        className="text-gray-600 hover:text-green-700 transition-colors block py-2 md:py-0"
        onClick={() => setIsMenuOpen(false)}
      >
        Philosophie
      </Link>
      <Link
        href="/transformations"
        className="relative text-purple-600 hover:text-purple-700 transition-colors font-medium flex items-center py-2 md:py-0"
        onClick={() => setIsMenuOpen(false)}
      >
        <Sparkles className="h-4 w-4 mr-1" />
        Transformations IA
        <span className="absolute -top-1 -right-4 md:top-auto md:right-auto md:relative md:-top-5 md:-right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          NEW
        </span>
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-green-700">
            Pétition Citoyenne
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-6 text-sm">
            {navLinks}
          </nav>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-green-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <nav className="flex flex-col space-y-2 px-4 pt-2 pb-4 border-t">
          {navLinks}
        </nav>
      </div>
    </header>
  );
};

export default Header;
