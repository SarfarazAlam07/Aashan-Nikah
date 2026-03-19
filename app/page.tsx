'use client';  
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { FaHeart, FaShieldAlt, FaUserShield, FaMapMarkerAlt, FaStar, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { FiCode } from 'react-icons/fi';

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Multiple Background Images for Different Devices */}
      
      {/* Mobile Background (small screens - up to 640px) */}
      <div className="block sm:hidden fixed inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/images/bgPhone.png")',
            backgroundSize: 'cover',
            backgroundPosition: '30% center', // Mobile ke liye thoda shift
            backgroundAttachment: 'scroll'
          }}
        >
          <div className="w-full h-full bg-gradient-to-b from-black/80 via-black/70 to-black/80"></div>
        </div>
      </div>

      {/* Tablet Background (medium screens - 641px to 1024px) */}
      <div className="hidden sm:block lg:hidden fixed inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/images/bgDextop.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="w-full h-full bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        </div>
      </div>

      {/* Desktop Background (large screens - above 1024px) */}
      <div className="hidden lg:block fixed inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/images/bgDextop.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="w-full h-full bg-gradient-to-b from-black/60 via-black/50 to-black/60"></div>
        </div>
      </div>

      {/* Fallback Background (agar koi image load na ho) */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-emerald-900 to-teal-900"></div>

      {/* Content */}
      <div className="relative z-10">
        <Header />

        {/* Hero Section - With top padding for fixed header */}
        <section className="pt-32 md:pt-40 pb-20 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge - Mobile responsive */}
              <div className="inline-block bg-emerald-500/20 backdrop-blur-sm text-emerald-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm mb-4 sm:mb-6 border border-emerald-500/30">
                ⭐ Bihar's Most Trusted Islamic Matrimony
              </div>

              {/* Main Heading - Mobile optimized */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
                Find Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 block sm:inline">
                  Halal Life Partner
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-3 sm:mb-4 px-4">
                in Patna, Chhapra & Across Bihar
              </p>
              
              <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-6 sm:mb-10 px-4">
                Join 5000+ happy couples who found their perfect match through our 
                privacy-focused, Sharia-compliant matrimony platform.
              </p>
              
              {/* CTA Buttons - Stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link
                  href="/signup"
                  className="bg-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-emerald-700 transition transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                >
                  <FaHeart className="text-sm sm:text-base" />
                  <span>Start Free Registration</span>
                </Link>
                <Link
                  href="/how-it-works"
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-white/20 transition flex items-center justify-center gap-2"
                >
                  How It Works
                </Link>
              </div>

              {/* Trust Indicators - Wrap on mobile */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 px-4">
                <div className="flex items-center text-white/80 text-xs sm:text-sm">
                  <FaCheckCircle className="text-emerald-400 mr-1 sm:mr-2" />
                  <span>100% Halal</span>
                </div>
                <div className="flex items-center text-white/80 text-xs sm:text-sm">
                  <FaCheckCircle className="text-emerald-400 mr-1 sm:mr-2" />
                  <span>Privacy Protected</span>
                </div>
                <div className="flex items-center text-white/80 text-xs sm:text-sm">
                  <FaCheckCircle className="text-emerald-400 mr-1 sm:mr-2" />
                  <span>Admin Verified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 px-4">
                Why Choose Nikah Aasan?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/70 px-4">
                We make halal matrimony simple, safe, and successful
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-2">
              {/* Feature 1 */}
              <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-xl text-center hover:bg-white/20 transition group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-full bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition">
                  <FaHeart className="text-lg sm:text-xl md:text-2xl text-red-400" />
                </div>
                <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base mb-1">Halal Process</h3>
                <p className="text-white/60 text-[10px] sm:text-xs">100% Islamic</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-xl text-center hover:bg-white/20 transition group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition">
                  <FaShieldAlt className="text-lg sm:text-xl md:text-2xl text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base mb-1">Privacy First</h3>
                <p className="text-white/60 text-[10px] sm:text-xs">No public contact</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-xl text-center hover:bg-white/20 transition group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition">
                  <FaUserShield className="text-lg sm:text-xl md:text-2xl text-green-400" />
                </div>
                <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base mb-1">Verified Profiles</h3>
                <p className="text-white/60 text-[10px] sm:text-xs">Admin checked</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-xl text-center hover:bg-white/20 transition group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition">
                  <FaMapMarkerAlt className="text-lg sm:text-xl md:text-2xl text-purple-400" />
                </div>
                <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base mb-1">Local Focus</h3>
                <p className="text-white/60 text-[10px] sm:text-xs">Bihar special</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Stat 1 */}
              <div className="text-center">
                <FaHeart className="text-2xl sm:text-3xl text-emerald-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">5000+</div>
                <div className="text-white/70 text-xs sm:text-sm">Happy Couples</div>
              </div>

              {/* Stat 2 */}
              <div className="text-center">
                <FaMapMarkerAlt className="text-2xl sm:text-3xl text-emerald-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">50+</div>
                <div className="text-white/70 text-xs sm:text-sm">Cities in Bihar</div>
              </div>

              {/* Stat 3 */}
              <div className="text-center">
                <FaShieldAlt className="text-2xl sm:text-3xl text-emerald-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">100%</div>
                <div className="text-white/70 text-xs sm:text-sm">Privacy</div>
              </div>

              {/* Stat 4 */}
              <div className="text-center">
                <FaUsers className="text-2xl sm:text-3xl text-emerald-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">24/7</div>
                <div className="text-white/70 text-xs sm:text-sm">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Local Areas Section */}
        <section className="py-12 sm:py-16 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-6 sm:mb-10 px-4">
              Active Members in Your Area
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-2">
              {[
                "Chhapra", "Phulwari Sharif", "Sabzibagh", "Danapur",
                "Siwan", "Gopalganj", "Muzaffarpur", "Patna City"
              ].map((city) => (
                <div key={city} className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg text-center hover:bg-white/20 transition group">
                  <span className="text-emerald-400 font-medium text-sm sm:text-base group-hover:text-emerald-300">
                    {city}
                  </span>
                  <div className="text-white/60 text-[10px] sm:text-xs mt-1">
                    {Math.floor(Math.random() * 50) + 20}+ profiles
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TechEraX Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-emerald-900/90 to-teal-900/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full flex items-center justify-center">
                  <FiCode className="text-2xl sm:text-3xl text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl sm:text-2xl">TechEraX</h3>
                  <p className="text-emerald-300 text-sm sm:text-base">Web & App Development Company</p>
                  <p className="text-white/60 text-xs sm:text-sm mt-2 max-w-md">
                    Professional Web Development • Mobile Apps • SEO • Digital Marketing
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div className="text-white/70 text-xs sm:text-sm text-center sm:text-left">
                  <div>📍 Patna, Bihar</div>
                  <div>📞 +91 98765 43210</div>
                </div>
                <a 
                  href="https://techerax.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-emerald-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-emerald-700 transition whitespace-nowrap text-sm sm:text-base"
                >
                  Visit Website →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 px-4">
              Ready to Start Your Nikah Journey?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-10 px-4">
              Join thousands of Muslims who found their life partner through us
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-emerald-700 transition transform hover:scale-105 shadow-2xl"
            >
              <FaHeart />
              Create Your Profile Now
            </Link>
            <p className="text-white/60 text-xs sm:text-sm mt-4">
              Free registration • 5 minutes only
            </p>
          </div>
        </section>

        <Footer />
      </div>

      {/* Add CSS for better mobile background handling */}
      <style jsx>{`
        @media (max-width: 640px) {
          .bg-fix {
            background-attachment: scroll !important;
          }
        }
      `}</style>
    </div>
  );
}