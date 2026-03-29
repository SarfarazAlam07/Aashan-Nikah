// app/legal/page.tsx
'use client';

import { useState } from 'react';
import { FaShieldAlt, FaFileContract, FaGavel, FaUserSecret } from 'react-icons/fa';

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-dark-400 dark:to-dark-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-4">
            <FaShieldAlt className="text-3xl text-green-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Legal Information
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Barkati Nikah Service - Privacy Policy & Terms of Service
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white dark:bg-dark-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${
              activeTab === 'privacy'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20'
            }`}
          >
            <FaUserSecret size={16} />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${
              activeTab === 'terms'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20'
            }`}
          >
            <FaFileContract size={16} />
            Terms & Conditions
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          {activeTab === 'privacy' ? <PrivacyPolicy /> : <TermsConditions />}
        </div>

        {/* Last Updated */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

// Privacy Policy Component
function PrivacyPolicy() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Privacy Policy</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          At Barkati Nikah Service, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">1. Information We Collect</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
          <li>Personal information (name, email, phone number, address)</li>
          <li>Profile information (age, gender, education, profession, etc.)</li>
          <li>Marriage preferences and requirements</li>
          <li>Communication history with our service</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">2. How We Use Your Information</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
          <li>To facilitate halal matrimonial matchmaking</li>
          <li>To verify your identity and profile information</li>
          <li>To communicate with you about potential matches</li>
          <li>To improve our services and user experience</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">3. Information Sharing</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          We do not sell or share your personal information with third parties. Your profile is only visible to potential matches after admin verification. Contact details are only shared after mutual interest is expressed and approved.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">4. Data Security</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          We implement industry-standard security measures to protect your data. All information is stored securely and access is restricted to authorized personnel only.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">5. Your Rights</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          You have the right to access, correct, or delete your personal information. You can also request to deactivate your account at any time by contacting our support team.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Islamic Note:</strong> All information is handled in accordance with Islamic principles of privacy and trust. We ensure that your search for a life partner remains halal and dignified.
        </p>
      </div>
    </div>
  );
}

// Terms & Conditions Component
function TermsConditions() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Terms & Conditions</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          By using Barkati Nikah Service, you agree to these terms. Please read them carefully before registering.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">1. Eligibility</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
          <li>You must be at least 18 years of age to register</li>
          <li>You must be unmarried, divorced, or widowed and seeking a halal marriage</li>
          <li>You must provide truthful and accurate information</li>
          <li>Parents/guardians may register on behalf of their children</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">2. Account Responsibility</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
          <li>You are responsible for maintaining the confidentiality of your account</li>
          <li>You are responsible for all activities under your account</li>
          <li>Notify us immediately of any unauthorized use</li>
          <li>We reserve the right to suspend or terminate accounts violating terms</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">3. Halal Conduct</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
          <li>All interactions must be respectful and Islamic</li>
          <li>No inappropriate or vulgar language</li>
          <li>No harassment of any kind</li>
          <li>Communication should be with marriage intent only</li>
          <li>Parents/guardians should be involved in the process</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">4. Profile Verification</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
          <li>All profiles are verified by our admin team</li>
          <li>We reserve the right to reject or remove suspicious profiles</li>
          <li>False information may lead to account termination</li>
          <li>We may request additional verification documents</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">5. Marriage Process</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
          <li>All marriages should follow Islamic Sharia principles</li>
          <li>Mahr (dowry) should be agreed upon mutually</li>
          <li>Wali (guardian) approval is required for marriage</li>
          <li>We recommend consulting with a Mufti for Islamic guidance</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">6. Termination</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          We reserve the right to terminate or suspend accounts that violate these terms. You may also delete your account at any time by contacting support.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Important:</strong> By registering, you confirm that you are seeking a halal marriage according to Islamic principles. May Allah bless your search for a righteous life partner.
        </p>
      </div>
    </div>
  );
}