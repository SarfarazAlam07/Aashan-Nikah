'use client';

import { useState, useRef, useEffect } from 'react';
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
  FaVenusMars,
  FaArrowRight,
  FaSearch
} from 'react-icons/fa';
import { FiEye, FiEyeOff, FiUserPlus, FiArrowLeft, FiX } from 'react-icons/fi';
import { BIHAR_DISTRICTS, ALL_CITIES } from '@/lib/locations';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // For custom district/city input
  const [districtSearch, setDistrictSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [customDistrict, setCustomDistrict] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [isCustomDistrict, setIsCustomDistrict] = useState(false);
  const [isCustomCity, setIsCustomCity] = useState(false);
  
  const districtRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  
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

  // Filter districts based on search
  const filteredDistricts = BIHAR_DISTRICTS.filter(district =>
    district.label.toLowerCase().includes(districtSearch.toLowerCase())
  );

  // Filter cities based on selected district and search
  const filteredCities = selectedDistrict && !isCustomDistrict
    ? ALL_CITIES.filter(city => 
        city.district === selectedDistrict && 
        city.label.toLowerCase().includes(citySearch.toLowerCase())
      )
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setShowDistrictDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const selectDistrict = (districtValue: string, districtLabel: string) => {
    setSelectedDistrict(districtValue);
    setFormData(prev => ({ ...prev, district: districtLabel, city: '' }));
    setDistrictSearch('');
    setShowDistrictDropdown(false);
    setIsCustomDistrict(false);
    setCustomDistrict('');
    setCitySearch('');
  };

  const selectCustomDistrict = () => {
    if (customDistrict.trim()) {
      setSelectedDistrict('custom');
      setFormData(prev => ({ ...prev, district: customDistrict.trim(), city: '' }));
      setShowDistrictDropdown(false);
      setIsCustomDistrict(true);
      setDistrictSearch('');
    }
  };

  const selectCity = (cityValue: string, cityLabel: string) => {
    setFormData(prev => ({ ...prev, city: cityLabel }));
    setCitySearch('');
    setShowCityDropdown(false);
    setIsCustomCity(false);
    setCustomCity('');
  };

  const selectCustomCity = () => {
    if (customCity.trim()) {
      setFormData(prev => ({ ...prev, city: customCity.trim() }));
      setShowCityDropdown(false);
      setIsCustomCity(true);
      setCitySearch('');
    }
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
      setError('Please select or enter your district');
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
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
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md animate-slide-up">
          
          {/* Logo & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg mb-3 ring-1 ring-amber-500/30">
              <span className="text-4xl">🕌</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Nikah Aasan</h1>
            <p className="text-amber-200/70 text-xs">हलाल इस्लामिक मैट्रिमोनी</p>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-amber-400/50 text-[10px] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>

          {/* Sign Up Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="p-6">
              
              {/* Header */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-500/20 rounded-full mb-2 ring-1 ring-amber-500/30">
                  <FiUserPlus className="text-amber-400 text-lg" />
                </div>
                <h2 className="text-lg font-semibold text-white">Create Account</h2>
                <p className="text-gray-400 text-xs mt-1">Join our Islamic community</p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-2.5 bg-red-500/20 border border-red-500/50 rounded-xl text-white text-xs text-center animate-fade-in">
                  <span className="inline-block mr-1">⚠️</span> {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-2.5 bg-green-500/20 border border-green-500/50 rounded-xl text-white text-xs text-center animate-fade-in">
                  ✓ {success} Redirecting...
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-500 group-focus-within:text-amber-400 transition" size={14} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-500 group-focus-within:text-amber-400 transition" size={14} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-500 group-focus-within:text-amber-400 transition" size={14} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number (optional)"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* District - Custom Searchable Dropdown */}
                <div ref={districtRef} className="relative">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-500 group-focus-within:text-amber-400 transition" size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder={formData.district ? formData.district : "Search or type district..."}
                      value={districtSearch}
                      onChange={(e) => {
                        setDistrictSearch(e.target.value);
                        setShowDistrictDropdown(true);
                        setIsCustomDistrict(false);
                      }}
                      onFocus={() => setShowDistrictDropdown(true)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                    />
                    {formData.district && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, district: '' }));
                          setSelectedDistrict('');
                          setDistrictSearch('');
                          setIsCustomDistrict(false);
                          setCustomDistrict('');
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                      >
                        <FiX size={16} />
                      </button>
                    )}
                  </div>
                  
                  {showDistrictDropdown && (
                    <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-slate-800 border border-slate-700 rounded-xl shadow-lg">
                      {filteredDistricts.length > 0 ? (
                        filteredDistricts.map((district) => (
                          <button
                            key={district.value}
                            type="button"
                            onClick={() => selectDistrict(district.value, district.label)}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-700 transition-colors"
                          >
                            {district.label}
                          </button>
                        ))
                      ) : (
                        <>
                          <div className="px-4 py-2 text-sm text-gray-400 border-b border-slate-700">
                            No matching district
                          </div>
                          {districtSearch.trim() && (
                            <button
                              type="button"
                              onClick={selectCustomDistrict}
                              className="w-full text-left px-4 py-2 text-sm text-amber-400 hover:bg-slate-700 transition-colors"
                            >
                              + Add "{districtSearch}" as custom district
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* City - Custom Searchable Dropdown (only if district selected) */}
                {selectedDistrict && (
                  <div ref={cityRef} className="relative">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-500 group-focus-within:text-amber-400 transition" size={14} />
                      </div>
                      <input
                        type="text"
                        placeholder={formData.city ? formData.city : "Search or type city..."}
                        value={citySearch}
                        onChange={(e) => {
                          setCitySearch(e.target.value);
                          setShowCityDropdown(true);
                          setIsCustomCity(false);
                        }}
                        onFocus={() => setShowCityDropdown(true)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                      />
                      {formData.city && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, city: '' }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                        >
                          <FiX size={16} />
                        </button>
                      )}
                    </div>
                    
                    {showCityDropdown && (
                      <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-slate-800 border border-slate-700 rounded-xl shadow-lg">
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city) => (
                            <button
                              key={city.value}
                              type="button"
                              onClick={() => selectCity(city.value, city.label)}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-700 transition-colors"
                            >
                              {city.label}
                            </button>
                          ))
                        ) : (
                          <>
                            <div className="px-4 py-2 text-sm text-gray-400 border-b border-slate-700">
                              No matching city
                            </div>
                            {citySearch.trim() && (
                              <button
                                type="button"
                                onClick={selectCustomCity}
                                className="w-full text-left px-4 py-2 text-sm text-amber-400 hover:bg-slate-700 transition-colors"
                              >
                                + Add "{citySearch}" as custom city
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Gender */}
                <div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-white text-sm cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                        className="accent-amber-500 w-4 h-4"
                        required
                      />
                      <FaVenusMars className="text-blue-400 group-hover:scale-110 transition" size={14} />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center gap-2 text-white text-sm cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                        className="accent-amber-500 w-4 h-4"
                        required
                      />
                      <FaVenusMars className="text-pink-400 group-hover:scale-110 transition" size={14} />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500 group-focus-within:text-amber-400 transition" size={14} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password (min 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full pl-9 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500 group-focus-within:text-amber-400 transition" size={14} />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition"
                    >
                      {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium text-sm hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg group"
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
                      <FaHandPeace className="group-hover:scale-110 transition" size={14} />
                      Sign Up
                      <FaArrowRight size={12} className="group-hover:translate-x-1 transition" />
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-transparent text-gray-500">Already have an account?</span>
                </div>
              </div>

              {/* Sign In Link */}
              <Link
                href="/signin"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all duration-300 group"
              >
                <FaMosque size={14} className="group-hover:scale-110 transition" />
                <span>Sign In</span>
                <FiArrowLeft size={12} className="group-hover:-translate-x-1 transition" />
              </Link>

              {/* Islamic Quote */}
              <div className="mt-5 text-center">
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  "And among His signs is that He created for you spouses from among yourselves"
                </p>
                <p className="text-gray-600 text-[9px] mt-1">
                  Surah Ar-Rum, 30:21
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-5">
            <p className="text-gray-600 text-[10px]">
              © 2025 Barkati Nikah | Islamic Matrimony
            </p>
            <p className="text-gray-700 text-[9px] mt-1">
              Patna • Chhapra • Siwan • Gopalganj • Muzaffarpur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}