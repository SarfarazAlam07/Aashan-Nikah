// components/layout/Footer.tsx
import Link from 'next/link';
import { FaHeart, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FiCode } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🕌</span>
              <div>
                <h3 className="font-bold text-xl">Nikah Aasan</h3>
                <p className="text-emerald-400 text-sm">हलाल मैट्रिमोनी</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Finding your halal life partner in Patna, Chhapra & across Bihar. 
              Your trusted Islamic matrimony platform.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-emerald-400">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition flex items-center">
                  <span className="mr-2">›</span> About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-white transition flex items-center">
                  <span className="mr-2">›</span> How It Works
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition flex items-center">
                  <span className="mr-2">›</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition flex items-center">
                  <span className="mr-2">›</span> Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition flex items-center">
                  <span className="mr-2">›</span> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-emerald-400">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-emerald-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Patna, Bihar, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+91 12345 67890</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">info@nikahaasan.com</span>
              </li>
            </ul>
          </div>

          {/* TechEraX Section - Highlighted */}
          <div className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 rounded-xl p-6 border border-emerald-700/30">
            <div className="flex items-center space-x-2 mb-3">
              <FiCode className="text-emerald-400 text-2xl" />
              <h4 className="font-semibold text-lg text-emerald-400">TechEraX</h4>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Web & App Development Company
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-300">
                <span className="w-20 text-emerald-400">Services:</span>
                <span>Web, App, SEO</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="w-20 text-emerald-400">Location:</span>
                <span>Patna, Bihar</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="w-20 text-emerald-400">Contact:</span>
                <span>+91 98765 43210</span>
              </div>
            </div>
            <a 
              href="https://techerax.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-4 text-emerald-400 hover:text-emerald-300 transition text-sm font-medium"
            >
              Visit TechEraX →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p className="flex items-center">
              © 2024 Nikah Aasan. All rights reserved.
              <span className="mx-2">|</span>
              Made with <FaHeart className="text-red-500 mx-1" /> for Muslim Ummah
            </p>
            <p className="flex items-center mt-2 md:mt-0">
              Powered by{' '}
              <a 
                href="https://techerax.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition ml-1 font-medium"
              >
                TechEraX
              </a>
              <span className="text-xs ml-2 px-2 py-1 bg-emerald-900/50 rounded-full">
                Web & App Development
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}