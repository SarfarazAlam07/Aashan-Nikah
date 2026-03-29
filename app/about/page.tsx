// app/about/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaMosque, 
  FaHeart, 
  FaShieldAlt, 
  FaUsers, 
  FaPhone, 
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaArrowLeft
} from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-dark-400 dark:to-dark-300">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-200 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-dark-100 transition-all duration-300 group"
        >
          <FaArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
          <span>Back</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16 sm:py-20 mt-4">
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaMosque className="text-5xl mx-auto mb-4 opacity-80" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Barkati Nikah Service
          </h1>
          <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto">
            India's most trusted halal Islamic matrimony platform, serving Bihar since 2020
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Our Story */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Our Story
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Barkati Nikah Service was founded by <strong>Maulana Farooq</strong> with a vision to provide 
              a Sharia-compliant, halal matrimony platform for the Muslim community in Bihar.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              What started as a small service in Chhapra has now grown into Bihar's most trusted 
              Islamic matrimony platform, helping over 5000+ couples find their perfect life partner.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our mission is to make halal marriage accessible, safe, and successful for every 
              Muslim brother and sister seeking a life partner according to Islamic principles.
            </p>
          </div>

          {/* Our Values */}
          <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Our Values</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaMosque className="text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Sharia Compliance</h4>
                  <p className="text-sm text-gray-500">All processes follow Islamic principles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaShieldAlt className="text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Privacy First</h4>
                  <p className="text-sm text-gray-500">Your information is safe with us</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaHeart className="text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Family Support</h4>
                  <p className="text-sm text-gray-500">Parents and family involved in process</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaUsers className="text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Community Focus</h4>
                  <p className="text-sm text-gray-500">Serving Bihar's Muslim community</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-4 bg-white dark:bg-dark-200 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600">5000+</div>
            <div className="text-sm text-gray-500">Happy Couples</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-dark-200 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600">50+</div>
            <div className="text-sm text-gray-500">Cities in Bihar</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-dark-200 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600">100%</div>
            <div className="text-sm text-gray-500">Halal Process</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-dark-200 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600">24/7</div>
            <div className="text-sm text-gray-500">Support</div>
          </div>
        </div>

        {/* Contact Section - No Form, Only Contact Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">
            Get in Touch
          </h2>
          
          <div className="max-w-3xl mx-auto">
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiMail className="text-green-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Email Us</h3>
                <p className="text-gray-600 dark:text-gray-300">info@barkatinikah.com</p>
                <p className="text-sm text-gray-500 mt-1">support@barkatinikah.com</p>
              </div>

              <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiPhone className="text-green-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Call Us</h3>
                <p className="text-gray-600 dark:text-gray-300">+91 12345 67890</p>
                <p className="text-sm text-gray-500 mt-1">Mon-Sat: 9AM - 7PM</p>
              </div>

              <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaWhatsapp className="text-green-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">WhatsApp</h3>
                <p className="text-gray-600 dark:text-gray-300">+91 12345 67890</p>
                <a
                  href="https://wa.me/911234567890?text=Assalamu%20Alaikum%2C%20I%20need%20more%20information%20about%20Barkati%20Nikah%20Service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-green-600 hover:text-green-700 transition"
                >
                  Click to Chat →
                </a>
              </div>

              <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiMapPin className="text-green-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Visit Us</h3>
                <p className="text-gray-600 dark:text-gray-300">Tinkonia, Chapra</p>
                <p className="text-sm text-gray-500 mt-1">Bihar - 841301</p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="mt-8 text-center p-4 bg-gray-50 dark:bg-dark-100 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaClock className="text-green-600" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Working Hours</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monday - Saturday: 9:00 AM - 7:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
