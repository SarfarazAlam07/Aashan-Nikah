'use client';

import { useState, useEffect, useCallback } from 'react';
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
  FiClock,
  FiRefreshCw,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { FaVenusMars, FaGraduationCap, FaStar, FaRegHeart, FaHeart as FaHeartSolid } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useProfiles } from '@/lib/hooks/useProfiles';
import { debounce } from 'lodash';

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
  imageUrl?: string;
  isVerified: boolean;
}

export default function ProfilesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    gender: '',
    city: '',
    minAge: '',
    maxAge: '',
    caste: ''
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [appliedFilters, setAppliedFilters] = useState({
    gender: '',
    city: '',
    minAge: '',
    maxAge: '',
    caste: '',
    search: ''
  });
  const [user, setUser] = useState<any>(null);

  const { profiles, count, isLoading, mutate } = useProfiles(appliedFilters);

  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setAppliedFilters(prev => ({ ...prev, search }));
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSearchClick = () => {
    debouncedSearch.cancel();
    setAppliedFilters(prev => ({ ...prev, search: searchQuery }));
    toast.success('Searching...');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const fetchAllRequests = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      
      const currentUser = JSON.parse(userData);
      setUser(currentUser);
      const token = localStorage.getItem('token');
      
      const sentRes = await fetch(`/api/requests?userId=${currentUser.id}&type=sent`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const sentData = await sentRes.json();
      if (sentData.success) {
        setSentRequests(sentData.requests);
      }
      
      const receivedRes = await fetch(`/api/requests?userId=${currentUser.id}&type=received`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const receivedData = await receivedRes.json();
      if (receivedData.success) {
        setReceivedRequests(receivedData.requests);
      }
      
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  useEffect(() => {
    fetchAllRequests();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        mutate();
        fetchAllRequests();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      debouncedSearch.cancel();
    };
  }, [mutate]);

  useEffect(() => {
    const count = Object.values(filters).filter(v => v !== '').length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      ...filters,
      search: searchQuery
    });
    setShowFilters(false);
    toast.success('Filters applied');
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
    setAppliedFilters({
      gender: '',
      city: '',
      minAge: '',
      maxAge: '',
      caste: '',
      search: ''
    });
    toast.success('All filters cleared');
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    await fetchAllRequests();
    setIsRefreshing(false);
    toast.success('Profiles refreshed');
  };

  const removeFilter = (filterName: string) => {
    const newFilters = { ...filters };
    if (filterName === 'search') {
      setSearchQuery('');
      setAppliedFilters(prev => ({ ...prev, search: '' }));
    } else {
      newFilters[filterName as keyof typeof filters] = '';
      setFilters(newFilters);
      setAppliedFilters(prev => ({ ...prev, [filterName]: '' }));
    }
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
        await fetchAllRequests();
        mutate();
      } else {
        toast.error(data.error || 'Failed to send request', { id: toastId });
      }
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error('Network error', { id: toastId });
    }
  };

  const getRequestStatus = (userId: string): string | null => {
    const sent = sentRequests.find((r: any) => {
      const rId = r.receiverId?._id || r.receiverId;
      return rId === userId;
    });
    if (sent) return sent.status;
    
    const received = receivedRequests.find((r: any) => {
      const rId = r.senderId?._id || r.senderId;
      return rId === userId;
    });
    if (received) return received.status;
    
    return null;
  };

  if (isLoading && profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Browse Profiles
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <FiUsers size={14} />
                <span className="font-medium text-amber-600 dark:text-amber-400">{count}</span> profiles found
                {!isLoading && (
                  <span className="text-xs text-gray-400">• Auto-refreshes</span>
                )}
              </p>
            </div>
            
            <div className="flex gap-2">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <FiList size={18} />
                </button>
              </div>
              
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <FiRefreshCw className={`text-gray-500 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} size={16} />
                <span className="text-sm hidden sm:inline text-gray-600 dark:text-gray-300">Refresh</span>
              </button>
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <FiFilter size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Filter</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by name, city, profession..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            />
          </div>
          <button
            onClick={handleSearchClick}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition shadow-sm"
          >
            Search
          </button>
        </div>

        {/* Active Filters Chips */}
        {(appliedFilters.search || appliedFilters.gender || appliedFilters.city || appliedFilters.caste || appliedFilters.minAge || appliedFilters.maxAge) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {appliedFilters.search && (
              <Chip
                icon={<FiSearch size={12} />}
                label={`Search: ${appliedFilters.search}`}
                onRemove={() => removeFilter('search')}
                color="amber"
              />
            )}
            {appliedFilters.gender && (
              <Chip
                icon={<FaVenusMars size={12} />}
                label={appliedFilters.gender === 'male' ? 'Male' : 'Female'}
                onRemove={() => removeFilter('gender')}
                color="blue"
              />
            )}
            {appliedFilters.city && (
              <Chip
                icon={<FiMapPin size={12} />}
                label={`City: ${appliedFilters.city}`}
                onRemove={() => removeFilter('city')}
                color="purple"
              />
            )}
            {appliedFilters.caste && (
              <Chip
                icon={<FiUser size={12} />}
                label={`Caste: ${appliedFilters.caste}`}
                onRemove={() => removeFilter('caste')}
                color="orange"
              />
            )}
            {(appliedFilters.minAge || appliedFilters.maxAge) && (
              <Chip
                icon={<FiCalendar size={12} />}
                label={`Age: ${appliedFilters.minAge || '18'}-${appliedFilters.maxAge || '60'} yrs`}
                onRemove={() => {
                  setFilters(prev => ({ ...prev, minAge: '', maxAge: '' }));
                  setAppliedFilters(prev => ({ ...prev, minAge: '', maxAge: '' }));
                }}
                color="pink"
              />
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-500 hover:text-rose-600 font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Profiles Grid/List */}
        {profiles.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No profiles found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearAllFilters}
              className="text-sm text-amber-600 dark:text-amber-400 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}`}>
            {profiles.map((profile) => (
              viewMode === 'grid' ? (
                <GridProfileCard 
                  key={profile._id} 
                  profile={profile} 
                  onSendRista={handleSendRista}
                  requestStatus={getRequestStatus(profile._id)}
                  currentUserGender={user?.gender}
                />
              ) : (
                <ListProfileCard 
                  key={profile._id} 
                  profile={profile} 
                  onSendRista={handleSendRista}
                  requestStatus={getRequestStatus(profile._id)}
                  currentUserGender={user?.gender}
                />
              )
            ))}
          </div>
        )}

        {/* Live Updates Indicator */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6">
          <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-xs border border-gray-200 dark:border-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600 dark:text-gray-400">Live updates</span>
          </div>
        </div>

        {/* Filter Modal */}
        {showFilters && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Filter Profiles</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                  <FiX size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFilters({...filters, gender: 'male'})}
                      className={`py-3 rounded-xl border-2 transition ${
                        filters.gender === 'male'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-300'
                      }`}
                    >
                      👨 Male
                    </button>
                    <button
                      onClick={() => setFilters({...filters, gender: 'female'})}
                      className={`py-3 rounded-xl border-2 transition ${
                        filters.gender === 'female'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-300'
                      }`}
                    >
                      👩 Female
                    </button>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="e.g., Patna, Chhapra"
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Caste */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Caste</label>
                  <input
                    type="text"
                    placeholder="e.g., Sheikh, Ansari"
                    value={filters.caste}
                    onChange={(e) => setFilters({...filters, caste: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min (18)"
                      value={filters.minAge}
                      onChange={(e) => setFilters({...filters, minAge: e.target.value})}
                      className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="number"
                      placeholder="Max (60)"
                      value={filters.maxAge}
                      onChange={(e) => setFilters({...filters, maxAge: e.target.value})}
                      className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    setFilters({
                      gender: '',
                      city: '',
                      minAge: '',
                      maxAge: '',
                      caste: ''
                    });
                    setShowFilters(false);
                  }}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Grid Profile Card Component
function GridProfileCard({ profile, onSendRista, requestStatus, currentUserGender }: { 
  profile: Profile; 
  onSendRista: (profile: Profile) => void;
  requestStatus: string | null;
  currentUserGender?: string;
}) {
  const isSameGender = currentUserGender === profile.gender;
  
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
      
      {/* 🔥 NAYA HEADER: Blurred Background Effect 🔥 */}
      <div className="h-24 relative overflow-hidden bg-gray-900">
        {profile.imageUrl ? (
          <>
            <img 
              src={profile.imageUrl} 
              alt="background" 
              className="absolute inset-0 w-full h-full object-cover blur-md scale-125 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </>
        ) : (
          <div className={`absolute inset-0 w-full h-full ${profile.gender === 'male' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-pink-500 to-pink-600'}`}></div>
        )}

        {profile.isVerified && (
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white flex items-center gap-1 z-10 border border-white/10">
            <FaStar className="text-yellow-400" size={10} />
            <span>Verified</span>
          </div>
        )}
        
        <div className="absolute bottom-3 left-4 z-20">
          <div className={`w-14 h-14 rounded-xl border-[3px] border-white dark:border-gray-800 shadow-lg flex items-center justify-center text-2xl overflow-hidden bg-white`}>
             {profile.imageUrl ? (
                <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover aspect-square" />
              ) : (
                profile.gender === 'male' ? '👨' : '👩'
              )}
          </div>
        </div>
      </div>

      <div className="pt-3 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
              {profile.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{profile.age} yrs • {profile.caste || 'N/A'}</p>
          </div>
          {requestStatus === 'ACCEPTED' && (
            <FaHeartSolid className="text-red-500" size={14} />
          )}
        </div>

        <div className="space-y-1.5 mt-3 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <FiMapPin className="text-amber-500 dark:text-amber-400" size={12} />
            <span className="truncate">{profile.city}, {profile.district}</span>
          </div>
          {profile.profession && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <FiBriefcase className="text-amber-500 dark:text-amber-400" size={12} />
              <span className="truncate">{profile.profession}</span>
            </div>
          )}
          {profile.education && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <FaGraduationCap className="text-amber-500 dark:text-amber-400" size={12} />
              <span className="truncate">{profile.education}</span>
            </div>
          )}
        </div>

        {profile.bio && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{profile.bio}</p>
        )}

        <div className="flex gap-2">
          <Link
            href={`/user/profile/${profile._id}`}
            className="flex-1 text-center py-2 border border-amber-500 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition"
          >
            View
          </Link>
          
          {isSameGender ? (
             <button disabled className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 py-2 rounded-lg text-xs font-medium cursor-not-allowed">
               Not Allowed
             </button>
          ) : !requestStatus ? (
            <button
              onClick={() => onSendRista(profile)}
              className="flex-1 flex items-center justify-center gap-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-xs font-medium transition shadow-sm"
            >
              <FiHeart size={12} /> Send
            </button>
          ) : requestStatus === 'ACCEPTED' ? (
            <button disabled className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white py-2 rounded-lg text-xs font-medium opacity-70 cursor-not-allowed">
              <FiCheckCircle size={12} /> Accepted
            </button>
          ) : requestStatus === 'PENDING_ADMIN' ? (
            <button disabled className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 text-white py-2 rounded-lg text-xs font-medium opacity-70 cursor-not-allowed">
              <FiClock size={12} /> Pending
            </button>
          ) : requestStatus === 'SENT_TO_USER' ? (
            <button disabled className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white py-2 rounded-lg text-xs font-medium opacity-70 cursor-not-allowed">
              <FiMessageCircle size={12} /> Sent
            </button>
          ) : (
            <button
              onClick={() => onSendRista(profile)}
              className="flex-1 flex items-center justify-center gap-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-xs font-medium transition"
            >
              <FiHeart size={12} /> Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// List Profile Card Component
function ListProfileCard({ profile, onSendRista, requestStatus, currentUserGender }: { 
  profile: Profile; 
  onSendRista: (profile: Profile) => void;
  requestStatus: string | null;
  currentUserGender?: string;
}) {
  const isSameGender = currentUserGender === profile.gender;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl overflow-hidden ${
            profile.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
          }`}>
             {profile.imageUrl ? (
                <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover aspect-square" />
              ) : (
                profile.gender === 'male' ? '👨' : '👩'
              )}
          </div>
        </div>
        
        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 dark:text-white">{profile.name}</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">{profile.age} yrs</span>
            {profile.isVerified && (
              <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">✓ Verified</span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><FiMapPin size={12} /> {profile.city}</span>
            {profile.caste && <span>{profile.caste}</span>}
            {profile.profession && <span className="flex items-center gap-1"><FiBriefcase size={12} /> {profile.profession}</span>}
            {profile.education && <span className="flex items-center gap-1"><FaGraduationCap size={12} /> {profile.education}</span>}
          </div>
          {profile.bio && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-1">{profile.bio}</p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/user/profile/${profile._id}`}
            className="px-3 py-2 border border-amber-500 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition"
          >
            View
          </Link>
          
          {isSameGender ? (
             <button disabled className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-lg text-xs font-medium cursor-not-allowed">
               Not Allowed
             </button>
          ) : !requestStatus ? (
            <button
              onClick={() => onSendRista(profile)}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1"
            >
              <FiHeart size={12} /> Send
            </button>
          ) : requestStatus === 'ACCEPTED' ? (
            <button disabled className="px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-medium opacity-70 cursor-not-allowed flex items-center gap-1">
              <FiCheckCircle size={12} /> Accepted
            </button>
          ) : requestStatus === 'PENDING_ADMIN' ? (
            <button disabled className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-xs font-medium opacity-70 cursor-not-allowed flex items-center gap-1">
              <FiClock size={12} /> Pending
            </button>
          ) : requestStatus === 'SENT_TO_USER' ? (
            <button disabled className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium opacity-70 cursor-not-allowed flex items-center gap-1">
              <FiMessageCircle size={12} /> Sent
            </button>
          ) : (
            <button
              onClick={() => onSendRista(profile)}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1"
            >
              <FiHeart size={12} /> Send
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
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    pink: 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
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