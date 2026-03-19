// components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiUser, FiPhone } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <span className="text-3xl md:text-4xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">🕌</span>
              <FaHeart className="absolute -top-1 -right-2 text-red-500 text-xs animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-lg md:text-xl leading-tight ${
                scrolled ? 'text-emerald-700' : 'text-white'
              }`}>
                Nikah Aasan
              </span>
              <span className={`text-[10px] md:text-xs ${
                scrolled ? 'text-gray-600' : 'text-white/80'
              }`}>
                हलाल मैट्रिमोनी
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-medium transition hover:text-emerald-400 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`font-medium transition hover:text-emerald-400 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              About
            </Link>
            <Link 
              href="/how-it-works" 
              className={`font-medium transition hover:text-emerald-400 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              How It Works
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium transition hover:text-emerald-400 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/signin"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                scrolled 
                  ? 'text-emerald-600 hover:bg-emerald-50' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition transform hover:scale-105 shadow-lg"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition ${
              scrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`py-4 space-y-2 ${scrolled ? 'bg-white' : 'bg-white/10 backdrop-blur-md'} rounded-lg px-4 mb-2`}>
            <Link 
              href="/" 
              className="block py-2 text-gray-700 hover:text-emerald-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="block py-2 text-gray-700 hover:text-emerald-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/how-it-works" 
              className="block py-2 text-gray-700 hover:text-emerald-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="/contact" 
              className="block py-2 text-gray-700 hover:text-emerald-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 border-t border-gray-200">
              <Link
                href="/signin"
                className="block py-2 text-emerald-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block py-2 bg-emerald-600 text-white text-center rounded-lg font-medium mt-2"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}