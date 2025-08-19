"use client";

import Link from 'next/link';
import { Bell, Menu, X, QrCode } from 'lucide-react';
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
        Signer la Pétition
      </a>
      
      <Link
        href="/carte-visite"
        className="text-gray-600 hover:text-green-700 transition-colors flex items-center gap-1 py-2 md:py-0"
        onClick={() => setIsMenuOpen(false)}
      >
        <QrCode className="w-4 h-4" />
        Cartes QR
      </Link>
     
      <Link
        href="/mentions-legales"
        className="text-gray-600 hover:text-green-700 transition-colors block py-2 md:py-0"
        onClick={() => setIsMenuOpen(false)}
      >
        Mentions Légales
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center text-xl font-bold text-green-700">
            <img src="/icons/logo.png" alt="Logo" className="h-8 w-8 ml-4" />
            Cloches d'Auray
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
