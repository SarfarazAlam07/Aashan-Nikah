// app/(auth)/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaLock, 
  FaMosque, 
  FaStar,
  FaHandPeace,
  FaVenusMars
} from 'react-icons/fa';
import { FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi';
import { BIHAR_DISTRICTS, ALL_CITIES } from '@/lib/locations';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    district: '',
    city: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });

  const filteredCities = selectedDistrict 
    ? ALL_CITIES.filter(city => city.district === selectedDistrict)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'district') {
      setSelectedDistrict(value);
      setFormData(prev => ({ ...prev, city: '' }));
    }
    
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!formData.district) {
      setError('Please select your district');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || '',
          district: formData.district,
          city: formData.city,
          gender: formData.gender
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Account created successfully!');
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userRole', data.user.role);
        
        setTimeout(() => {
          window.location.href = '/user/profiles';
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 10L55 25L40 40L25 25L40 10zM40 30L50 40L40 50L30 40L40 30z' fill='%23ffffff' fill-opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-5 text-emerald-500/10 text-7xl transform -rotate-12 hidden lg:block">🕌</div>
        <div className="absolute bottom-10 right-5 text-emerald-500/10 text-7xl transform rotate-12 hidden lg:block">☪️</div>
        <div className="absolute top-1/4 right-1/4 text-emerald-500/5 text-5xl animate-pulse hidden lg:block">⭐</div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg mb-3">
              <span className="text-4xl">🕌</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Nikah Aasan</h1>
            <p className="text-emerald-200/80 text-xs">हलाल इस्लामिक मैट्रिमोनी</p>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400/50 text-[10px]" />
              ))}
            </div>
          </div>

          {/* Sign Up Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-500/20 rounded-full mb-2">
                  <FiUserPlus className="text-emerald-400 text-lg" />
                </div>
                <h2 className="text-lg font-semibold text-white">Create Account</h2>
                <p className="text-emerald-200/70 text-xs mt-1">Join our Islamic community</p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-2.5 bg-red-500/20 border border-red-500/50 rounded-xl text-white text-xs text-center">
                  ⚠️ {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-2.5 bg-green-500/20 border border-green-500/50 rounded-xl text-white text-xs text-center">
                  ✓ {success} Redirecting...
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-emerald-400/60 text-sm" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-emerald-400/60 text-sm" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-emerald-400/60 text-sm" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number (optional)"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* District */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-emerald-400/60 text-sm" />
                    </div>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                    >
                      <option value="" className="bg-gray-800">Select District</option>
                      {BIHAR_DISTRICTS.map((district) => (
                        <option key={district.value} value={district.value} className="bg-gray-800">
                          {district.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-emerald-400/60 text-sm" />
                    </div>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!formData.district}
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 appearance-none"
                    >
                      <option value="" className="bg-gray-800">
                        {formData.district ? "Select City" : "Select District First"}
                      </option>
                      {filteredCities.map((city) => (
                        <option key={city.value} value={city.value} className="bg-gray-800">
                          {city.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                        className="accent-emerald-500 w-4 h-4"
                        required
                      />
                      <FaVenusMars className="text-blue-400" size={14} />
                      Male
                    </label>
                    <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                        className="accent-emerald-500 w-4 h-4"
                        required
                      />
                      <FaVenusMars className="text-pink-400" size={14} />
                      Female
                    </label>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-emerald-400/60 text-sm" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password (min 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full pl-9 pr-10 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/80"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-emerald-400/60 text-sm" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-10 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/80"
                    >
                      {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-medium text-sm hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FaHandPeace className="text-white/80" size={14} />
                      Sign Up
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-transparent text-emerald-200/60">Already have an account?</span>
                </div>
              </div>

              {/* Sign In Link */}
              <Link
                href="/signin"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition font-medium text-sm"
              >
                <FaMosque size={14} />
                Sign In
              </Link>

              {/* Islamic Quote */}
              <div className="mt-5 text-center">
                <p className="text-emerald-200/50 text-[11px] leading-relaxed">
                  "And among His signs is that He created for you spouses from among yourselves"<br />
                  <span className="text-emerald-300/40 text-[9px]">Surah Ar-Rum, 30:21</span>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-5">
            <p className="text-white/40 text-[10px]">
              © 2024 Nikah Aasan | Islamic Matrimony
            </p>
            <p className="text-emerald-300/30 text-[9px] mt-1">
              Patna • Chhapra • Siwan • Gopalganj • Muzaffarpur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}