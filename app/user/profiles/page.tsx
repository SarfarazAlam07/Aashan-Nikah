// app/user/profiles/page.tsx
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
  FiList,
  FiMail
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
  
  // 🔥 STATE FOR FULL IMAGE PREVIEW 🔥
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

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

  const getRequestInfo = (userId: string) => {
    const sent = sentRequests.find((r: any) => {
      const rId = r.receiverId?._id || r.receiverId;
      return rId === userId;
    });
    if (sent) return { status: sent.status, isIncoming: false };
    
    const received = receivedRequests.find((r: any) => {
      const rId = r.senderId?._id || r.senderId;
      return rId === userId;
    });
    if (received) return { status: received.status, isIncoming: true };
    
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
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
            {appliedFilters.search && <Chip icon={<FiSearch size={12} />} label={`Search: ${appliedFilters.search}`} onRemove={() => removeFilter('search')} color="amber" />}
            {appliedFilters.gender && <Chip icon={<FaVenusMars size={12} />} label={appliedFilters.gender === 'male' ? 'Male' : 'Female'} onRemove={() => removeFilter('gender')} color="blue" />}
            {appliedFilters.city && <Chip icon={<FiMapPin size={12} />} label={`City: ${appliedFilters.city}`} onRemove={() => removeFilter('city')} color="purple" />}
            {appliedFilters.caste && <Chip icon={<FiUser size={12} />} label={`Caste: ${appliedFilters.caste}`} onRemove={() => removeFilter('caste')} color="orange" />}
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
            <button onClick={clearAllFilters} className="text-xs text-rose-500 hover:text-rose-600 font-medium">Clear all</button>
          </div>
        )}

        {/* Profiles Grid/List */}
        {profiles.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No profiles found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filters</p>
            <button onClick={clearAllFilters} className="text-sm text-amber-600 dark:text-amber-400 font-medium hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch' : 'space-y-4'}`}>
            {profiles.map((profile) => (
              viewMode === 'grid' ? (
                <GridProfileCard 
                  key={profile._id} 
                  profile={profile} 
                  onSendRista={handleSendRista}
                  requestInfo={getRequestInfo(profile._id)}
                  currentUserGender={user?.gender}
                  router={router}
                  onImageClick={setPreviewImageUrl} 
                />
              ) : (
                <ListProfileCard 
                  key={profile._id} 
                  profile={profile} 
                  onSendRista={handleSendRista}
                  requestInfo={getRequestInfo(profile._id)}
                  currentUserGender={user?.gender}
                  router={router}
                  onImageClick={setPreviewImageUrl} 
                />
              )
            ))}
          </div>
        )}

        {/* Live Updates Indicator */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 pointer-events-none">
          <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-xs border border-gray-200 dark:border-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600 dark:text-gray-400">Live updates</span>
          </div>
        </div>

        {/* Filter Modal */}
        {showFilters && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center z-10">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Filter Profiles</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                  <FiX size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFilters({...filters, gender: 'male'})}
                      className={`py-3 rounded-xl border-2 transition ${
                        filters.gender === 'male' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-300'
                      }`}
                    >
                      👨 Male
                    </button>
                    <button
                      onClick={() => setFilters({...filters, gender: 'female'})}
                      className={`py-3 rounded-xl border-2 transition ${
                        filters.gender === 'female' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-300'
                      }`}
                    >
                      👩 Female
                    </button>
                    <button
                      onClick={() => setFilters({...filters, gender: ''})}
                      className={`col-span-2 py-2.5 rounded-xl text-sm font-medium transition ${
                        filters.gender === '' ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      All Genders
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                  <input type="text" placeholder="e.g., Patna, Chhapra" value={filters.city} onChange={(e) => setFilters({...filters, city: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Caste</label>
                  <input type="text" placeholder="e.g., Sheikh, Ansari" value={filters.caste} onChange={(e) => setFilters({...filters, caste: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Min (18)" value={filters.minAge} onChange={(e) => setFilters({...filters, minAge: e.target.value})} className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    <input type="number" placeholder="Max (60)" value={filters.maxAge} onChange={(e) => setFilters({...filters, maxAge: e.target.value})} className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3 z-10">
                <button onClick={handleApplyFilters} className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition">Apply Filters</button>
                <button onClick={() => { clearAllFilters(); setShowFilters(false); }} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* 🔥 FULL SCREEN IMAGE MODAL (LIGHTBOX) 🔥 */}
        {previewImageUrl && (
          <div 
            className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
            onClick={() => setPreviewImageUrl(null)} 
          >
            <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
               <button 
                onClick={() => setPreviewImageUrl(null)}
                className="absolute -top-12 right-0 p-2.5 bg-gray-800/50 hover:bg-red-600/50 hover:text-white text-gray-300 rounded-full transition z-10"
               >
                  <FiX size={24} />
               </button>
               <img 
                src={previewImageUrl} 
                alt="Profile Full View" 
                className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border-2 border-gray-800"
               />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔥 GRID CARD FIX: Fixed height issue & Image Click logic 🔥
function GridProfileCard({ profile, onSendRista, requestInfo, currentUserGender, router, onImageClick }: any) {
  const isSameGender = currentUserGender === profile.gender;
  
  return (
    // Added flex flex-col h-full to make all cards same height
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      
      {/* HEADER */}
      <div className="h-24 relative overflow-hidden bg-gray-900 flex-shrink-0">
        {profile.imageUrl ? (
          <>
            <img 
              src={profile.imageUrl} 
              alt="background" 
              className="absolute inset-0 w-full h-full object-cover blur-md scale-125 opacity-60 group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent pointer-events-none"></div>
          </>
        ) : (
          <div className={`absolute inset-0 w-full h-full ${profile.gender === 'male' ? 'bg-gradient-to-r from-blue-600 to-blue-800' : 'bg-gradient-to-r from-pink-600 to-pink-800'}`}></div>
        )}

        {profile.isVerified && (
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white flex items-center gap-1 z-10 border border-white/20">
            <FaStar className="text-yellow-400" size={9} />
            <span>Verified</span>
          </div>
        )}
        
        {/* 🔥 FIXED IMAGE CLICK: Added z-index & stopPropagation 🔥 */}
        <div className="absolute bottom-3 left-4 z-30">
          <div 
            className={`w-14 h-14 rounded-xl border-[2px] border-white dark:border-gray-800 shadow-lg flex items-center justify-center text-2xl overflow-hidden bg-white dark:bg-gray-700 ${profile.imageUrl ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
            onClick={(e) => {
              if(profile.imageUrl) {
                e.preventDefault();
                e.stopPropagation();
                onImageClick(profile.imageUrl);
              }
            }}
            title={profile.imageUrl ? "Click to view full image" : ""}
          >
             {profile.imageUrl ? (
                <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover aspect-square" />
              ) : (
                profile.gender === 'male' ? '👨' : '👩'
              )}
          </div>
        </div>
      </div>

      {/* CARD BODY (FLEX GROW TO PUSH BUTTONS DOWN) */}
      <div className="pt-3 p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 pr-2">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition truncate">
              {profile.name}
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{profile.age} yrs • {profile.caste || 'Caste N/A'}</p>
          </div>
          {requestInfo?.status === 'ACCEPTED' && (
            <FaHeartSolid className="text-red-500 flex-shrink-0 mt-1" size={14} />
          )}
        </div>

        <div className="space-y-1.5 mb-3 text-[11px] text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5 py-0.5">
            <FiMapPin className="text-amber-500 dark:text-amber-400 flex-shrink-0" size={11} />
            <span className="truncate">{profile.city}, {profile.district}</span>
          </div>
          {profile.profession && (
            <div className="flex items-center gap-1.5 py-0.5">
              <FiBriefcase className="text-amber-500 dark:text-amber-400 flex-shrink-0" size={11} />
              <span className="truncate">{profile.profession}</span>
            </div>
          )}
          {profile.education && (
            <div className="flex items-center gap-1.5 py-0.5">
              <FaGraduationCap className="text-amber-500 dark:text-amber-400 flex-shrink-0" size={11} />
              <span className="truncate">{profile.education}</span>
            </div>
          )}
        </div>

        {/* Bio Section - Set min height so it looks balanced or let flex-grow handle it */}
        <div className="mb-3 flex-grow">
          {profile.bio ? (
            <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-lg italic">"{profile.bio}"</p>
          ) : (
            <div className="h-[36px]"></div> // Placeholder so cards without bio don't shrink weirdly
          )}
        </div>

        {/* FOOTER ACTIONS - mt-auto pushes this to the very bottom */}
        <div className="flex gap-1.5 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700/50">
          <Link
            href={`/user/profile/${profile._id}`}
            className="flex-[0.8] text-center flex items-center justify-center py-1.5 border border-amber-500 text-amber-600 dark:text-amber-400 rounded-lg text-[11px] font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition"
          >
            View
          </Link>
          
          {isSameGender ? (
             <button disabled className="flex-[1.2] bg-gray-100 dark:bg-gray-800 text-gray-400 py-1.5 rounded-lg text-[11px] font-medium cursor-not-allowed">
               Not Allowed
             </button>
          ) : !requestInfo ? (
            <button
              onClick={() => onSendRista(profile)}
              className="flex-[1.2] flex items-center justify-center gap-1 bg-amber-600 hover:bg-amber-700 text-white py-1.5 rounded-lg text-[11px] font-medium transition shadow-sm"
            >
              <FiHeart size={11} /> Send
            </button>
          ) : requestInfo.status === 'ACCEPTED' ? (
            <button disabled className="flex-[1.2] flex items-center justify-center gap-1 bg-green-500 text-white py-1.5 rounded-lg text-[11px] font-medium opacity-70 cursor-not-allowed">
              <FiCheckCircle size={11} /> Accepted
            </button>
          ) : requestInfo.isIncoming ? (
            <button 
              onClick={() => router.push('/user/requests')} 
              className="flex-[1.2] flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded-lg text-[11px] font-medium"
            >
              <FiMail size={11} /> Received
            </button>
          ) : requestInfo.status === 'PENDING_ADMIN' ? (
            <button disabled className="flex-[1.2] flex items-center justify-center gap-1 bg-yellow-500 text-white py-1.5 rounded-lg text-[11px] font-medium opacity-70 cursor-not-allowed">
              <FiClock size={11} /> Pending
            </button>
          ) : requestInfo.status === 'SENT_TO_USER' ? (
            <button disabled className="flex-[1.2] flex items-center justify-center gap-1 bg-blue-500 text-white py-1.5 rounded-lg text-[11px] font-medium opacity-70 cursor-not-allowed">
              <FiMessageCircle size={11} /> Sent
            </button>
          ) : (
            <button
              onClick={() => onSendRista(profile)}
              className="flex-[1.2] flex items-center justify-center gap-1 bg-amber-600 hover:bg-amber-700 text-white py-1.5 rounded-lg text-[11px] font-medium transition"
            >
              <FiHeart size={11} /> Send Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// List Profile Card Component
function ListProfileCard({ profile, onSendRista, requestInfo, currentUserGender, router, onImageClick }: any) {
  const isSameGender = currentUserGender === profile.gender;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 p-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div 
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl overflow-hidden border border-gray-100 dark:border-gray-700 ${
              profile.imageUrl ? 'cursor-pointer hover:scale-105 transition-transform' : (profile.gender === 'male' ? 'bg-blue-50' : 'bg-pink-50')
            }`}
            onClick={(e) => {
              if(profile.imageUrl) {
                e.preventDefault();
                e.stopPropagation();
                onImageClick(profile.imageUrl);
              }
            }}
            title={profile.imageUrl ? "Click to view full image" : ""}
          >
             {profile.imageUrl ? (
                <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover aspect-square" />
              ) : (
                profile.gender === 'male' ? '👨' : '👩'
              )}
          </div>
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm truncate max-w-full">{profile.name}</h3>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap">{profile.age} yrs</span>
            {profile.isVerified && (
              <span className="text-[9px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded-md whitespace-nowrap">✓ Verified</span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1 whitespace-nowrap"><FiMapPin size={10} className="text-amber-500"/> {profile.city}</span>
            {profile.caste && <span className="whitespace-nowrap">• {profile.caste}</span>}
            {profile.profession && <span className="flex items-center gap-1 whitespace-nowrap"><FiBriefcase size={10} className="text-amber-500"/> {profile.profession}</span>}
          </div>
          {profile.bio && (
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 italic">"{profile.bio}"</p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-1.5 mt-2 sm:mt-0">
          <Link
            href={`/user/profile/${profile._id}`}
            className="px-3 py-1.5 border border-amber-500 text-amber-600 dark:text-amber-400 rounded-lg text-[11px] font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition whitespace-nowrap text-center"
          >
            View
          </Link>
          
          {isSameGender ? (
             <button disabled className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-lg text-[11px] font-medium cursor-not-allowed whitespace-nowrap">
               Not Allowed
             </button>
          ) : !requestInfo ? (
            <button
              onClick={() => onSendRista(profile)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-medium transition flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <FiHeart size={11} /> Send
            </button>
          ) : requestInfo.status === 'ACCEPTED' ? (
            <button disabled className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-[11px] font-medium opacity-70 cursor-not-allowed flex items-center justify-center gap-1 whitespace-nowrap">
              <FiCheckCircle size={11} /> Accepted
            </button>
          ) : requestInfo.isIncoming ? (
            <button 
              onClick={() => router.push('/user/requests')} 
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <FiMail size={11} /> Received
            </button>
          ) : requestInfo.status === 'PENDING_ADMIN' ? (
            <button disabled className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-[11px] font-medium opacity-70 cursor-not-allowed flex items-center justify-center gap-1 whitespace-nowrap">
              <FiClock size={11} /> Pending
            </button>
          ) : requestInfo.status === 'SENT_TO_USER' ? (
            <button disabled className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-[11px] font-medium opacity-70 cursor-not-allowed flex items-center justify-center gap-1 whitespace-nowrap">
              <FiMessageCircle size={11} /> Sent
            </button>
          ) : (
            <button
              onClick={() => onSendRista(profile)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-medium transition flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <FiHeart size={11} /> Send Again
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
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${colors[color]}`}>
      {icon}
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:opacity-70 p-0.5">
        <FiX size={11} />
      </button>
    </span>
  );
}