// app/(auth)/signin/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaMoon, FaStar, FaMosque, FaHandPeace } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        
        toast.success(`✨ Assalamu Alaikum, ${data.user.name}! ✨`);
        
        if (data.user.role === 'SUPER_ADMIN' || data.user.role === 'MUFTI') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/user/profiles';
        }
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with Islamic Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 10L55 25L40 40L25 25L40 10zM40 30L50 40L40 50L30 40L40 30z' fill='%23ffffff' fill-opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Floating Islamic Ornaments */}
        <div className="absolute top-20 left-10 text-emerald-500/10 text-8xl transform -rotate-12 hidden lg:block">🕌</div>
        <div className="absolute bottom-20 right-10 text-emerald-500/10 text-8xl transform rotate-12 hidden lg:block">☪️</div>
        <div className="absolute top-1/3 right-20 text-emerald-500/5 text-6xl animate-pulse hidden lg:block">⭐</div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg mb-4">
              <span className="text-5xl">🕌</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Nikah Aasan</h1>
            <p className="text-emerald-200/80 text-sm">हलाल इस्लामिक मैट्रिमोनी</p>
            <div className="flex justify-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400/60 text-xs" />
              ))}
            </div>
          </div>

          {/* Sign In Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-full mb-3">
                  <FaHandPeace className="text-emerald-400 text-xl" />
                </div>
                <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
                <p className="text-emerald-200/70 text-sm mt-1">Sign in to continue your journey</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-white text-sm text-center flex items-center justify-center gap-2">
                  <span className="text-red-300">⚠️</span>
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-emerald-200 text-sm font-medium mb-2">
                    <FaEnvelope className="inline mr-2 text-emerald-400" size={14} />
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-emerald-400/60" size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-emerald-200 text-sm font-medium mb-2">
                    <FaLock className="inline mr-2 text-emerald-400" size={14} />
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-emerald-400/60" size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/80 transition"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link 
                    href="/forgot-password" 
                    className="text-xs text-emerald-300 hover:text-emerald-200 transition"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FaMoon className="text-white/80" size={16} />
                      Sign In
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-emerald-200/60">New here?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <Link
                href="/signup"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition font-medium"
              >
                <FaMosque size={16} />
                Create New Account
              </Link>

              {/* Islamic Quote */}
              <div className="mt-6 text-center">
                <p className="text-emerald-200/50 text-xs leading-relaxed">
                  "And We created you in pairs"<br />
                  <span className="text-emerald-300/40 text-[10px]">Surah An-Naba, 78:8</span>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-white/40 text-xs">
              © 2024 Nikah Aasan | Islamic Matrimony
            </p>
            <p className="text-emerald-300/30 text-[10px] mt-1">
              Patna • Chhapra • Siwan • Gopalganj • Muzaffarpur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}