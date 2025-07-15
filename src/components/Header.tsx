import Link from 'next/link';

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
