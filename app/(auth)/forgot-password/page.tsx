'use client';

import Link from 'next/link';
import { FaWhatsapp, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

export default function ForgotPasswordPage() {
  const adminWhatsApp = "919876543210"; // 🔥 Apna number yahan daal
  const message = "Assalamu Alaikum, I forgot my Barkati Nikah account password. Please help me reset it.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-amber-500/30">
          <FaShieldAlt className="text-amber-400 text-3xl" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          For security reasons, automatic password resets are disabled. Please contact the Admin directly via WhatsApp to reset your password.
        </p>

        <a
          href={`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg mb-6"
        >
          <FaWhatsapp size={20} />
          Contact Admin on WhatsApp
        </a>

        <Link
          href="/signin"
          className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition text-sm"
        >
          <FaArrowLeft /> Back to Login
        </Link>
      </div>
    </div>
  );
}