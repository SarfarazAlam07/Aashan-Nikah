'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { 
  FaHeart, 
  FaShieldAlt, 
  FaUserShield, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaCheckCircle,
  FaStar,
  FaMosque,
  FaHandPeace,
  FaArrowRight
} from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-dark-400 dark:via-dark-300 dark:to-dark-400">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 sm:pt-24 md:pt-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 islamic-pattern opacity-5"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-5 text-4xl animate-float opacity-10 hidden sm:block">🕌</div>
        <div className="absolute bottom-20 right-5 text-4xl animate-float opacity-10 hidden sm:block" style={{ animationDelay: '2s' }}>☪️</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <FaStar className="text-yellow-500" size={14} />
              <span>Bihar's Most Trusted Islamic Matrimony</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-slide-up">
              Find Your{' '}
              <span className="gradient-text">Halal Life Partner</span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl block mt-2 text-gray-600 dark:text-gray-300">
                in Patna, Chhapra & Across Bihar
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in">
              Join 5000+ happy couples who found their perfect match through our 
              privacy-focused, Sharia-compliant matrimony platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
              >
                <FaHeart className="text-red-400 group-hover:scale-110 transition" />
                <span>Start Free Registration</span>
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-dark-200 border-2 border-green-500 text-green-600 dark:text-green-400 rounded-xl font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
              >
                <FaHandPeace />
                <span>How It Works</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" size={16} />
                <span>100% Halal</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-green-500" size={16} />
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUserShield className="text-green-500" size={16} />
                <span>Admin Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-dark-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="gradient-text">Nikah Aasan</span>?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We make halal matrimony simple, safe, and successful
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group text-center p-6 rounded-2xl bg-gray-50 dark:bg-dark-200 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center group-hover:scale-110 transition">
                  <feature.icon className="text-2xl text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <stat.icon className="text-3xl sm:text-4xl mx-auto mb-3 opacity-80" />
                <div className="text-3xl sm:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Areas Section */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-dark-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Active Members in <span className="gradient-text">Your Area</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Connect with like-minded Muslims near you
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cities.map((city, index) => (
              <div 
                key={city.name}
                className="group text-center p-4 rounded-xl bg-white dark:bg-dark-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <FaMapMarkerAlt className="text-green-500 mx-auto mb-2 group-hover:scale-110 transition" size={20} />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{city.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{city.count}+ profiles</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-white dark:bg-dark-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaMosque className="text-5xl text-green-500 mx-auto mb-6 animate-float" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your <span className="gradient-text">Nikah Journey</span>?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of Muslims who found their life partner through us
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-xl group"
          >
            <FaHeart />
            <span>Create Your Profile Now</span>
            <FiChevronRight className="group-hover:translate-x-1 transition" />
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Free registration • 5 minutes only
          </p>
        </div>
      </section>

    </div>
  );
}

// Data arrays for cleaner code
const features = [
  { icon: FaHeart, title: 'Halal Process', desc: '100% Islamic' },
  { icon: FaShieldAlt, title: 'Privacy First', desc: 'No public contact' },
  { icon: FaUserShield, title: 'Verified Profiles', desc: 'Admin checked' },
  { icon: FaMapMarkerAlt, title: 'Local Focus', desc: 'Bihar special' },
];

const stats = [
  { icon: FaHeart, value: '5000+', label: 'Happy Couples' },
  { icon: FaMapMarkerAlt, value: '50+', label: 'Cities in Bihar' },
  { icon: FaShieldAlt, value: '100%', label: 'Privacy' },
  { icon: FaUsers, value: '24/7', label: 'Support' },
];

const cities = [
  { name: 'Chhapra', count: '150+' },
  { name: 'Phulwari Sharif', count: '85+' },
  { name: 'Sabzibagh', count: '62+' },
  { name: 'Danapur', count: '45+' },
  { name: 'Siwan', count: '38+' },
  { name: 'Gopalganj', count: '32+' },
  { name: 'Muzaffarpur', count: '28+' },
  { name: 'Patna City', count: '120+' },
];