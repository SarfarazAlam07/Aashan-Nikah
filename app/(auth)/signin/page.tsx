//app> (auth) > signin > page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaEnvelope, 
  FaLock, 
  FaStar, 
  FaMosque, 
  FaHandPeace,
  FaArrowRight
} from 'react-icons/fa';
import { FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
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
        
        // ✅ Updated redirect logic
        if (data.user.role === 'SUPER_ADMIN') {
          // Super Admin goes to admin dashboard
          window.location.href = '/admin/dashboard';
        } else if (data.user.role === 'MUFTI') {
          // Mufti goes to requests page (pending requests)
          window.location.href = '/mufti/requests';
        } else {
          // Regular user goes to profiles page
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 10L55 25L40 40L25 25L40 10zM40 30L50 40L40 50L30 40L40 30z' fill='%23ffffff' fill-opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Floating Ornaments */}
      <div className="absolute top-10 left-5 text-amber-500/5 text-6xl animate-float hidden lg:block">🕌</div>
      <div className="absolute bottom-10 right-5 text-amber-500/5 text-6xl animate-float hidden lg:block" style={{ animationDelay: '2s' }}>☪️</div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-slide-up">
          
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg mb-4 ring-1 ring-amber-500/30">
              <span className="text-5xl">🕌</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Nikah Aasan</h1>
            <p className="text-amber-200/70 text-sm">हलाल इस्लामिक मैट्रिमोनी</p>
            <div className="flex justify-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-amber-400/60 text-xs animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>

          {/* Sign In Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="p-8">
              
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/20 rounded-full mb-3 ring-1 ring-amber-500/30">
                  <FaHandPeace className="text-amber-400 text-xl" />
                </div>
                <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
                <p className="text-gray-400 text-sm mt-1">Sign in to continue your journey</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-white text-sm text-center animate-fade-in">
                  <span className="inline-block mr-2">⚠️</span>
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <FaEnvelope className="inline mr-2 text-amber-400" size={14} />
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-500 group-focus-within:text-amber-400 transition" size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <FaLock className="inline mr-2 text-amber-400" size={14} />
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500 group-focus-within:text-amber-400 transition" size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link 
                    href="/forgot-password" 
                    className="text-xs text-amber-400 hover:text-amber-300 transition hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg group"
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
                      <FiLogIn className="group-hover:translate-x-1 transition" size={18} />
                      Sign In
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-500">New here?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <Link
                href="/signup"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all duration-300 group"
              >
                <FaMosque size={16} className="group-hover:scale-110 transition" />
                <span>Create New Account</span>
                <FaArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </Link>

              {/* Islamic Quote */}
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-xs leading-relaxed">
                  "And We created you in pairs"
                </p>
                <p className="text-gray-600 text-[10px] mt-1">
                  Surah An-Naba, 78:8
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-xs">
              © 2025 Barkati Nikah | Islamic Matrimony
            </p>
            <p className="text-gray-700 text-[10px] mt-1">
              Patna • Chhapra • Siwan • Gopalganj • Muzaffarpur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}