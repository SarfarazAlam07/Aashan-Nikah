'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiSearch, 
  FiFilter, 
  FiMapPin, 
  FiBriefcase, 
  FiX,
  FiUsers,
  FiEye,
  FiStar
} from 'react-icons/fi';
import { FaVenusMars, FaGraduationCap } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Profile {
  _id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
  district: string;
  caste?: string;
  profession?: string;
  education?: string;
  bio?: string;
  isVerified: boolean;
}

export default function MuftiProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [filters, setFilters] = useState({
    gender: '',
    city: '',
    minAge: '',
    maxAge: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/signin');
      return;
    }
    
    const parsed = JSON.parse(userData);
    setUser(parsed);
    
    if (parsed.role !== 'MUFTI') {
      toast.error('Access Denied');
      router.push('/user/dashboard');
      return;
    }
    
    fetchProfiles();
  }, [router]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.city) params.append('city', filters.city);
      if (filters.minAge) params.append('minAge', filters.minAge);
      if (filters.maxAge) params.append('maxAge', filters.maxAge);
      
      const response = await fetch(`/api/profiles?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setProfiles(data.profiles);
      } else {
        toast.error('Failed to load profiles');
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProfiles();
  };

  const handleApplyFilters = () => {
    fetchProfiles();
    setShowFilters(false);
    toast.success('Filters applied');
  };

  const clearFilters = () => {
    setFilters({ gender: '', city: '', minAge: '', maxAge: '' });
    setSearchQuery('');
    fetchProfiles();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FiUsers className="text-amber-500 text-xl" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Browse Profiles</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">View and review user profiles</p>
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-100 transition"
        >
          <FiFilter size={16} />
          <span>Filters</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, city, profession..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
        >
          Search
        </button>
      </div>

      {/* Profiles Grid */}
      {profiles.length === 0 ? (
        <div className="bg-white dark:bg-dark-200 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <FiUsers className="text-4xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No profiles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {profiles.map((profile) => (
            <div key={profile._id} className="bg-white dark:bg-dark-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className={`h-24 relative ${
                profile.gender === 'male' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-r from-pink-500 to-pink-600'
              }`}>
                <div className="absolute -bottom-8 left-4">
                  <div className={`w-14 h-14 rounded-xl border-3 border-white dark:border-dark-200 shadow flex items-center justify-center text-2xl ${
                    profile.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
                  }`}>
                    {profile.gender === 'male' ? '👨' : '👩'}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-8 p-4">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">{profile.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{profile.age} yrs • {profile.caste || 'N/A'}</p>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <FiMapPin className="text-amber-500" size={12} />
                    <span>{profile.city}, {profile.district}</span>
                  </div>
                  {profile.profession && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <FiBriefcase className="text-amber-500" size={12} />
                      <span>{profile.profession}</span>
                    </div>
                  )}
                  {profile.education && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <FaGraduationCap className="text-amber-500" size={12} />
                      <span>{profile.education}</span>
                    </div>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{profile.bio}</p>
                )}

                <Link
                  href={`/mufti/profile/${profile._id}`}
                  className="w-full flex items-center justify-center gap-1 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-dark-100 transition"
                >
                  <FiEye size={12} />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-200 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Filter Profiles</h2>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Gender */}
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Gender</label>
                  <div className="flex gap-3">
                    {['male', 'female'].map((gender) => (
                      <button
                        key={gender}
                        onClick={() => setFilters({...filters, gender: gender === filters.gender ? '' : gender})}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          filters.gender === gender
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {gender === 'male' ? 'Male' : 'Female'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">City</label>
                  <input
                    type="text"
                    placeholder="e.g., Patna, Chhapra"
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white"
                  />
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Age Range</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minAge}
                      onChange={(e) => setFilters({...filters, minAge: e.target.value})}
                      className="w-1/2 px-4 py-2 bg-gray-100 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAge}
                      onChange={(e) => setFilters({...filters, maxAge: e.target.value})}
                      className="w-1/2 px-4 py-2 bg-gray-100 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-100"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}