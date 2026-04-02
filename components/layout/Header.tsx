'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiLogIn, FiUserPlus } from 'react-icons/fi';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', active: pathname === '/' },
    { href: '/about', label: 'About', active: pathname === '/about' },
    { href: '/legal', label: 'Privacy & Terms', active: pathname === '/legal' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-500
      ${scrolled 
        ? 'bg-white/95 dark:bg-dark-200/95 backdrop-blur-xl shadow-lg border-b border-gray-100 dark:border-gray-700' 
        : 'bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-sm'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* 🔥 LOGO SECTION 🔥 */}
          <Link 
            href="/" 
            className="flex items-center group relative overflow-hidden h-12 md:h-16"
          >
            <img 
              src="/logo.png" 
              alt="Barkati Fast Nikah" 
              className={`
                h-full w-auto object-contain transition-all duration-300
                group-hover:scale-105
                ${scrolled ? 'brightness-100' : 'brightness-0 invert'} 
              `}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-4 py-2 rounded-lg font-medium transition-all duration-300
                  ${isActive(link.href)
                    ? scrolled 
                      ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
                      : 'text-white bg-white/20'
                    : scrolled
                      ? 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-dark-100'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-green-500 rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/signin"
              className={`
                px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2
                ${scrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-dark-100'
                  : 'text-white hover:bg-white/10'
                }
              `}
            >
              <FiLogIn size={18} />
              <span>Login</span>
            </Link>
            <Link
              href="/signup"
              className={`
                px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-md
                ${scrolled
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                  : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                }
              `}
            >
              <FiUserPlus size={18} />
              <span>Register</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              md:hidden p-2 rounded-xl transition-all duration-300
              ${scrolled 
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-100' 
                : 'text-white hover:bg-white/10'
              }
            `}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`
          md:hidden transition-all duration-300 overflow-hidden
          ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className={`
            py-4 space-y-1 rounded-2xl mt-2 mb-4
            ${scrolled 
              ? 'bg-white dark:bg-dark-200 shadow-lg border border-gray-100 dark:border-gray-700' 
              : 'bg-white/95 backdrop-blur-xl border border-white/20'
            }
          `}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                  block px-4 py-3 rounded-xl font-medium transition-all duration-300
                  ${isActive(link.href)
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : scrolled
                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-100'
                      : 'text-gray-800 hover:bg-gray-100'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className={`
                  block px-4 py-3 rounded-xl font-medium transition-all duration-300
                  ${scrolled
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-100'
                    : 'text-gray-800 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <FiLogIn size={18} />
                  <span>Login</span>
                </div>
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className={`
                  block px-4 py-3 rounded-xl font-semibold transition-all duration-300 mt-2 text-center
                  ${scrolled
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'bg-green-600 text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3 justify-center">
                  <FiUserPlus size={18} />
                  <span>Create Account</span>
                </div>
              </Link>
            </div>

            {/* Islamic Quote for Mobile */}
            <div className="px-4 pt-4 mt-2 text-center">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">
                "And We created you in pairs"
              </p>
              <p className="text-[8px] text-gray-400 dark:text-gray-500 mt-1">
                Surah An-Naba, 78:8
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}