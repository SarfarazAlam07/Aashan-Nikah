// app/user/profiles/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiSearch, 
  FiFilter, 
  FiMapPin, 
  FiBriefcase, 
  FiHeart, 
  FiX,
  FiUsers,
  FiCalendar,
  FiUser,
  FiMessageCircle,
  FiCheckCircle,
  FiClock
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

export default function ProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    city: '',
    minAge: '',
    maxAge: '',
    caste: ''
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [sentRequests, setSentRequests] = useState<any[]>([]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (filters.gender && filters.gender !== 'all') params.append('gender', filters.gender);
      if (filters.city) params.append('city', filters.city);
      if (filters.minAge) params.append('minAge', filters.minAge);
      if (filters.maxAge) params.append('maxAge', filters.maxAge);
      if (filters.caste) params.append('caste', filters.caste);
      
      const response = await fetch(`/api/profiles?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setProfiles(data.profiles);
        console.log(`✅ Loaded ${data.profiles.length} profiles`);
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

  // Fetch sent requests to check status
  const fetchSentRequests = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      
      const currentUser = JSON.parse(userData);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/requests?userId=${currentUser.id}&type=sent`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setSentRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchSentRequests();
  }, []);

  useEffect(() => {
    const count = Object.values(filters).filter(v => v !== '').length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleSearch = () => {
    fetchProfiles();
  };

  const handleApplyFilters = () => {
    fetchProfiles();
    setShowFilters(false);
    toast.success('Filters applied', { duration: 2000 });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters({
      gender: '',
      city: '',
      minAge: '',
      maxAge: '',
      caste: ''
    });
    fetchProfiles();
    toast.success('All filters cleared', { duration: 2000 });
  };

  const handleSendRista = async (profile: Profile) => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      toast.error('Please login to send rista request');
      router.push('/signin');
      return;
    }

    const currentUser = JSON.parse(userData);
    const token = localStorage.getItem('token');
    
    const toastId = toast.loading('Sending request...');
    
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: profile._id,
          message: `I am interested in your profile.`
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('Request sent to admin for approval!', { id: toastId });
        await fetchSentRequests(); // Refresh requests list
      } else {
        toast.error(data.error || 'Failed to send request', { id: toastId });
      }
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error('Network error', { id: toastId });
    }
  };

  const getRequestStatus = (receiverId: string): string | null => {
    const request = sentRequests.find((r: any) => r.receiverId?._id === receiverId);
    return request?.status || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Browse Profiles</h1>
              <p className="text-sm text-gray-600 mt-1">
                <FiUsers className="inline mr-1" size={14} />
                {profiles.length} profiles found
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(true)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <FiFilter size={18} />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden sm:flex gap-3 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, city, profession..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium"
          >
            Search
          </button>
          <button
            onClick={() => setShowFilters(true)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium flex items-center gap-2"
          >
            <FiFilter size={18} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden mb-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm"
            >
              Go
            </button>
          </div>
        </div>

        {/* Active Filters Chips */}
        {(searchQuery || activeFiltersCount > 0) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {searchQuery && (
              <Chip
                icon={<FiSearch size={12} />}
                label={searchQuery}
                onRemove={() => setSearchQuery('')}
                color="emerald"
              />
            )}
            {filters.gender && (
              <Chip
                icon={<FaVenusMars size={12} />}
                label={filters.gender === 'male' ? 'Male' : 'Female'}
                onRemove={() => setFilters({...filters, gender: ''})}
                color="blue"
              />
            )}
            {filters.city && (
              <Chip
                icon={<FiMapPin size={12} />}
                label={filters.city}
                onRemove={() => setFilters({...filters, city: ''})}
                color="purple"
              />
            )}
            {filters.caste && (
              <Chip
                icon={<FiUser size={12} />}
                label={filters.caste}
                onRemove={() => setFilters({...filters, caste: ''})}
                color="orange"
              />
            )}
            {(filters.minAge || filters.maxAge) && (
              <Chip
                icon={<FiCalendar size={12} />}
                label={`${filters.minAge || '18'}-${filters.maxAge || '60'} yrs`}
                onRemove={() => setFilters({...filters, minAge: '', maxAge: ''})}
                color="pink"
              />
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Profiles Grid */}
        {profiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-3">😔</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No profiles found</h3>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearAllFilters}
              className="text-sm text-emerald-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {profiles.map((profile) => (
              <ProfileCard 
                key={profile._id} 
                profile={profile} 
                onSendRista={handleSendRista}
                requestStatus={getRequestStatus(profile._id)}
              />
            ))}
          </div>
        )}

        {/* Filter Modal */}
        {showFilters && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Filter Profiles</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFilters({...filters, gender: 'male'})}
                      className={`py-3 rounded-xl border-2 transition ${
                        filters.gender === 'male'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      👨 Male
                    </button>
                    <button
                      onClick={() => setFilters({...filters, gender: 'female'})}
                      className={`py-3 rounded-xl border-2 transition ${
                        filters.gender === 'female'
                          ? 'border-pink-600 bg-pink-50 text-pink-700'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      👩 Female
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="e.g., Patna, Chhapra"
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
                  <input
                    type="text"
                    placeholder="e.g., Sheikh, Ansari"
                    value={filters.caste}
                    onChange={(e) => setFilters({...filters, caste: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min (18)"
                      value={filters.minAge}
                      onChange={(e) => setFilters({...filters, minAge: e.target.value})}
                      className="px-4 py-3 border border-gray-200 rounded-xl text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max (60)"
                      value={filters.maxAge}
                      onChange={(e) => setFilters({...filters, maxAge: e.target.value})}
                      className="px-4 py-3 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Profile Card Component
function ProfileCard({ profile, onSendRista, requestStatus }: { 
  profile: Profile; 
  onSendRista: (profile: Profile) => void;
  requestStatus: string | null;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      <div className={`h-24 relative ${
        profile.gender === 'male' 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
          : 'bg-gradient-to-r from-pink-500 to-pink-600'
      }`}>
        {profile.isVerified && (
          <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] text-white flex items-center gap-1">
            ✓ Verified
          </div>
        )}
        <div className="absolute -bottom-8 left-4">
          <div className={`w-14 h-14 rounded-xl border-3 border-white shadow flex items-center justify-center text-2xl ${
            profile.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
          }`}>
            {profile.gender === 'male' ? '👨' : '👩'}
          </div>
        </div>
      </div>

      <div className="pt-8 p-4">
        <h3 className="text-base font-semibold text-gray-900">{profile.name}</h3>
        <p className="text-xs text-gray-600 mb-2">{profile.age} yrs • {profile.caste || 'N/A'}</p>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <FiMapPin className="text-emerald-500" size={12} />
            <span className="truncate">{profile.city}, {profile.district}</span>
          </div>
          {profile.profession && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <FiBriefcase className="text-emerald-500" size={12} />
              <span className="truncate">{profile.profession}</span>
            </div>
          )}
          {profile.education && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <FaGraduationCap className="text-emerald-500" size={12} />
              <span className="truncate">{profile.education}</span>
            </div>
          )}
        </div>

        {profile.bio && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{profile.bio}</p>
        )}

        <div className="flex gap-2">
          <Link
            href={`/user/profile/${profile._id}`}
            className="flex-1 text-center py-2 border border-emerald-600 text-emerald-600 rounded-lg text-xs font-medium hover:bg-emerald-50"
          >
            View
          </Link>
          
          {!requestStatus ? (
            <button
              onClick={() => onSendRista(profile)}
              className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-emerald-700"
            >
              <FiHeart size={12} />
              Send Rista
            </button>
          ) : requestStatus === 'ACCEPTED' ? (
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white py-2 rounded-lg text-xs font-medium opacity-70 cursor-not-allowed"
            >
              <FiCheckCircle size={12} />
              Rista Accepted
            </button>
          ) : requestStatus === 'PENDING_ADMIN' ? (
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 text-white py-2 rounded-lg text-xs font-medium opacity-70 cursor-not-allowed"
            >
              <FiClock size={12} />
              Pending
            </button>
          ) : requestStatus === 'SENT_TO_USER' ? (
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white py-2 rounded-lg text-xs font-medium opacity-70 cursor-not-allowed"
            >
              <FiMessageCircle size={12} />
              Request Sent
            </button>
          ) : (
            <button
              onClick={() => onSendRista(profile)}
              className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-emerald-700"
            >
              <FiHeart size={12} />
              Send Rista
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Chip Component
function Chip({ icon, label, onRemove, color }: any) {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
    pink: 'bg-pink-50 text-pink-700'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${colors[color]}`}>
      {icon}
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:opacity-70">
        <FiX size={12} />
      </button>
    </span>
  );
}