import { useState } from 'react';
import logo from '../assets/logo.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow px-4 py-4 w-full fixed top-0 left-0 z-100">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Kearoule Logo"
            className="h-8 md:h-10"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#about"
            className="text-red-600 font-bold text-lg hover:text-red-700 transition-colors"
          >
            About us
          </a>
          <a href="#privacy" className="text-red-600 font-bold text-lg hover:text-red-700 transition-colors">
            Privacy policy
          </a>
          <a
            href="#download"
            className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition-colors"
          >
            Download App
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black focus:outline-none"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-2 border-t border-gray-200 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <a
              href="#about"
              className="text-red-600 font-bold text-lg hover:text-red-700 transition-colors px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About us
            </a>
            <a
              href="#privacy"
              className="text-red-600 font-bold text-lg hover:text-red-700 transition-colors px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Privacy policy
            </a>
            <a
              href="#download"
              className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition-colors text-center mx-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Download App
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
