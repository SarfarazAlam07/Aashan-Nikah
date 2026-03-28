'use client';
import Link from 'next/link';
import { 
  FaHeart, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaMosque,
  FaStar
} from 'react-icons/fa';
import { FiCode, FiArrowUp } from 'react-icons/fi';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 islamic-pattern"></div>
      
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>

      {/* Main Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <FaMosque className="text-green-400 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white">Nikah Aasan</h3>
                <p className="text-green-400 text-xs">हलाल मैट्रिमोनी</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Finding your halal life partner in Patna, Chhapra & across Bihar.
            </p>
            <div className="flex gap-3 pt-2">
              <SocialIcon href="#" icon={<FaFacebook />} />
              <SocialIcon href="#" icon={<FaTwitter />} />
              <SocialIcon href="#" icon={<FaInstagram />} />
              <SocialIcon href="#" icon={<FaLinkedin />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-4 text-green-400">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/how-it-works" label="How It Works" />
              <FooterLink href="/privacy" label="Privacy Policy" />
              <FooterLink href="/terms" label="Terms & Conditions" />
              <FooterLink href="/contact" label="Contact Us" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-base mb-4 text-green-400">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FaMapMarkerAlt className="text-green-400 mt-0.5 flex-shrink-0" size={14} />
                <span>Patna, Bihar, India</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FaPhone className="text-green-400 flex-shrink-0" size={14} />
                <span>+91 12345 67890</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FaEnvelope className="text-green-400 flex-shrink-0" size={14} />
                <span>info@nikahaasan.com</span>
              </li>
            </ul>
          </div>

          {/* TechEraX Section - Clean & Modern */}
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-5 border border-green-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FiCode className="text-green-400 text-lg" />
              </div>
              <h4 className="font-semibold text-white">TechEraX</h4>
            </div>
            <p className="text-gray-400 text-xs mb-3">
              Web & App Development Company
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full">Web Dev</span>
              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full">Mobile Apps</span>
              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full">SEO</span>
            </div>
            <a 
              href="https://techerax.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition group"
            >
              <span>Visit Website</span>
              <span className="group-hover:translate-x-1 transition">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
            <p className="flex items-center gap-1">
              © 2025 Nikah Aasan
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                Made with <FaHeart className="text-red-500 text-xs" /> for Muslim Ummah
              </span>
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                Powered by <span className="text-green-400 font-medium">TechEraX</span>
              </span>
              <button
                onClick={scrollToTop}
                className="p-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition group"
                aria-label="Scroll to top"
              >
                <FiArrowUp size={14} className="text-gray-400 group-hover:text-green-400 transition" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components
function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-110"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-400 hover:text-green-400 transition flex items-center gap-2 text-sm group"
      >
        <span className="w-1 h-1 bg-green-500 rounded-full group-hover:scale-125 transition"></span>
        {label}
      </Link>
    </li>
  );
}