// app/admin/profiles/page.tsx
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
  FiCalendar,
  FiUser,
  FiEye,
  FiTrash2,
  FiCheckCircle,
  FiMail,
  FiPhone,
  FiChevronDown,
  FiClock
} from 'react-icons/fi';
import { FaVenusMars, FaGraduationCap, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Profile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
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
  createdAt: string;
}

export default function AdminProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // 🔥 NEW: State to store URL of image to preview full-screen 🔥
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    gender: '',
    city: '',
    minAge: '',
    maxAge: '',
    caste: '',
    verified: ''
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      
      if (parsed.role !== 'SUPER_ADMIN' && parsed.role !== 'MUFTI') {
        toast.error('Access Denied');
        router.push('/user/dashboard');
        return;
      }
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
      if (filters.caste) params.append('caste', filters.caste);
      if (filters.verified === 'verified') params.append('verified', 'true');
      if (filters.verified === 'pending') params.append('verified', 'false');
      
      const response = await fetch(`/api/admin/profiles?${params.toString()}`, {
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
    toast.success('Filters applied');
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters({
      gender: '',
      city: '',
      minAge: '',
      maxAge: '',
      caste: '',
      verified: ''
    });
    // Use timeout to ensure state is updated before fetch
    setTimeout(fetchProfiles, 100);
    toast.success('All filters cleared');
  };

  const handleVerify = async (userId: string) => {
    const toastId = toast.loading('Verifying...');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users?userId=${userId}&action=verify`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User verified!', { id: toastId });
        fetchProfiles();
      } else {
        toast.error('Failed to verify', { id: toastId });
      }
    } catch (error) {
      toast.error('Error', { id: toastId });
    }
  };

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`Delete ${name}? This action cannot be undone.`)) return;
    
    const toastId = toast.loading('Deleting...');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users?userId=${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User deleted!', { id: toastId });
        fetchProfiles();
      } else {
        toast.error('Failed to delete', { id: toastId });
      }
    } catch (error) {
      toast.error('Error', { id: toastId });
    }
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Browse Profiles</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {isSuperAdmin ? 'Manage all user profiles' : 'View user profiles'}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl hover:border-amber-500/50 transition shadow-sm text-sm"
        >
          <FiFilter size={16} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by name, city, profession..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-semibold transition shadow-sm text-sm"
        >
          Search
        </button>
      </div>

      {/* 🔥 PREMIUM UPDATED GRID (More columns for smaller cards) 🔥 */}
      {profiles.length === 0 ? (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-12 text-center">
          <FiUsers className="text-5xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-medium">No profiles found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {profiles.map((profile) => (
            <div key={profile._id} className="group bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-700/50 flex flex-col">
              
              {/* 🔥 PREMIUM COMPACT HEADER 🔥 */}
              <div className="h-20 relative overflow-hidden bg-gray-900/50">
                {profile.imageUrl ? (
                  <>
                    <img 
                      src={profile.imageUrl} 
                      alt="background" 
                      className="absolute inset-0 w-full h-full object-cover blur-sm scale-110 opacity-50 group-hover:scale-115 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                  </>
                ) : (
                  <div className={`absolute inset-0 w-full h-full ${profile.gender === 'male' ? 'bg-gradient-to-br from-blue-700/80 to-blue-900/80' : 'bg-gradient-to-br from-pink-700/80 to-pink-900/80'}`}></div>
                )}

                {/* Verification Badge */}
                {profile.isVerified ? (
                  <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] text-green-400 flex items-center gap-1 z-10 border border-white/5 font-medium tracking-wide">
                    <FiCheckCircle size={10} />
                    <span>Verified</span>
                  </div>
                ) : (
                  <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] text-yellow-400 flex items-center gap-1 z-10 border border-white/5 font-medium tracking-wide">
                    <FiClock size={10} />
                    <span>Pending</span>
                  </div>
                )}
                
                {/* 🔥 UPDATED CLICKABLE AVATAR 🔥 */}
                <div className="absolute bottom-2 left-3 z-20">
                  <div 
                    className={`w-12 h-12 rounded-xl border-2 border-slate-800 shadow-lg flex items-center justify-center text-xl overflow-hidden bg-slate-700 ${profile.imageUrl ? 'cursor-pointer' : ''}`}
                    // 🔥 Open full image modal on click 🔥
                    onClick={() => profile.imageUrl && setPreviewImageUrl(profile.imageUrl)}
                    title={profile.imageUrl ? "Click to view full image" : ""}
                  >
                     {profile.imageUrl ? (
                        <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover aspect-square transition-transform hover:scale-105 duration-300" />
                      ) : (
                        profile.gender === 'male' ? '👨' : '👩'
                      )}
                  </div>
                </div>
              </div>

              {/* Profile Content (Compact) */}
              <div className="pt-2 p-3 flex-grow flex flex-col">
                <div className="mb-2">
                  <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition truncate">
                    {profile.name}
                  </h3>
                  <p className="text-[11px] text-gray-400">{profile.age} yrs • {profile.caste || 'Caste N/A'}</p>
                </div>

                {/* Details barkaraar hain but fonts compact kiye hain */}
                <div className="space-y-1 mb-3 text-[11px] text-gray-400 flex-grow">
                  <div className="flex items-center gap-1.5 py-0.5 border-b border-slate-700/30 last:border-0">
                    <FiMapPin className="text-amber-500" size={11} />
                    <span className="truncate">{profile.city}, {profile.district}</span>
                  </div>
                  {profile.profession && (
                    <div className="flex items-center gap-1.5 py-0.5 border-b border-slate-700/30 last:border-0">
                      <FiBriefcase className="text-amber-500" size={11} />
                      <span className="truncate">{profile.profession}</span>
                    </div>
                  )}
                  {profile.education && (
                    <div className="flex items-center gap-1.5 py-0.5 border-b border-slate-700/30 last:border-0">
                      <FaGraduationCap className="text-amber-500" size={11} />
                      <span className="truncate">{profile.education}</span>
                    </div>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-[11px] text-gray-500 mb-3 line-clamp-2 bg-slate-900/50 p-1.5 rounded-lg italic">"{profile.bio}"</p>
                )}

                {/* Compact Admin Action Buttons */}
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-slate-700/50">
                  <button
                    onClick={() => {
                      setSelectedProfile(profile);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 bg-slate-700 text-white py-1.5 rounded-lg text-[11px] font-medium hover:bg-slate-600 transition"
                  >
                    <FiEye size={12} /> View
                  </button>
                  
                  {isSuperAdmin && !profile.isVerified && (
                    <button
                      onClick={() => handleVerify(profile._id)}
                      className="p-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition"
                      title="Verify User"
                    >
                      <FiCheckCircle size={13} />
                    </button>
                  )}
                  
                  {isSuperAdmin && (
                    <button
                      onClick={() => handleDelete(profile._id, profile.name)}
                      className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition"
                      title="Delete User"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl animate-scale-in">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FiFilter className="text-amber-500" /> Filter Profiles
              </h2>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-slate-700 rounded-lg text-gray-400 transition">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Gender */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Gender</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFilters({...filters, gender: 'male'})}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition border ${
                      filters.gender === 'male' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-700 border-transparent text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    👨 Male
                  </button>
                  <button
                    onClick={() => setFilters({...filters, gender: 'female'})}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition border ${
                      filters.gender === 'female' ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'bg-slate-700 border-transparent text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    👩 Female
                  </button>
                  <button
                    onClick={() => setFilters({...filters, gender: ''})}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                      filters.gender === '' ? 'bg-slate-600 text-white' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>

              {/* Verification Status (Super Admin only) */}
              {isSuperAdmin && (
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Verification Status</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFilters({...filters, verified: 'verified'})}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition border ${
                        filters.verified === 'verified' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-700 border-transparent text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      ✓ Verified
                    </button>
                    <button
                      onClick={() => setFilters({...filters, verified: 'pending'})}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition border ${
                        filters.verified === 'pending' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-slate-700 border-transparent text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      ⏳ Pending
                    </button>
                    <button
                      onClick={() => setFilters({...filters, verified: ''})}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                        filters.verified === '' ? 'bg-slate-600 text-white' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                      }`}
                    >
                      All
                    </button>
                  </div>
                </div>
              )}

              {/* City */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">City / Location</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    placeholder="e.g., Patna, Chhapra"
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full pl-9 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>

              {/* Caste */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Caste / Community</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    placeholder="e.g., Sheikh, Ansari"
                    value={filters.caste}
                    onChange={(e) => setFilters({...filters, caste: e.target.value})}
                    className="w-full pl-9 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>

              {/* Age Range */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Age Range</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minAge}
                    onChange={(e) => setFilters({...filters, minAge: e.target.value})}
                    className="w-1/2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-center text-sm"
                  />
                  <span className="text-gray-600">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxAge}
                    onChange={(e) => setFilters({...filters, maxAge: e.target.value})}
                    className="w-1/2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-center text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-4 flex gap-3 z-10">
              <button
                onClick={handleApplyFilters}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition shadow-lg text-sm"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setShowFilters(false);
                }}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Details Modal (Unchanged Details, Compact Styling) */}
      {showDetailsModal && selectedProfile && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full border border-slate-600 shadow-2xl animate-scale-in flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-700/50 flex justify-between items-center sticky top-0 bg-slate-800 z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FiUser className="text-amber-500" /> Profile Details
                </h3>
                <button onClick={() => setShowDetailsModal(false)} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-400 transition">
                  <FiX size={18} />
                </button>
            </div>
            
            <div className="p-6 space-y-3 bg-slate-800 overflow-y-auto custom-scrollbar flex-1">
              {selectedProfile.imageUrl && (
                <div className="w-20 h-20 mx-auto mb-5 rounded-xl border-4 border-slate-700 shadow-inner overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => setPreviewImageUrl(selectedProfile.imageUrl!)}>
                  <img src={selectedProfile.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-2.5 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <DetailRow label="Name" value={selectedProfile.name} />
                <DetailRow label="Email" value={selectedProfile.email} />
                {isSuperAdmin && <DetailRow label="Phone" value={selectedProfile.phone || 'N/A'} />}
                <DetailRow label="Age" value={`${selectedProfile.age} years`} />
                <DetailRow label="Gender" value={selectedProfile.gender === 'male' ? '👨 Male' : '👩 Female'} capitalize />
                <DetailRow label="Caste" value={selectedProfile.caste || 'N/A'} />
                <DetailRow label="City / Dist" value={`${selectedProfile.city}, ${selectedProfile.district}`} />
                <DetailRow label="Profession" value={selectedProfile.profession || 'N/A'} />
                <DetailRow label="Education" value={selectedProfile.education || 'N/A'} />
                <DetailRow label="Status" value={selectedProfile.isVerified ? '✓ Verified' : '⏳ Pending'} isStatus statusType={selectedProfile.isVerified ? 'success' : 'warning'} />
                <DetailRow label="Joined" value={new Date(selectedProfile.createdAt).toLocaleDateString('en-GB')} />
              </div>
              
              {selectedProfile.bio && (
                <div className="mt-4">
                  <p className="text-gray-400 text-[11px] mb-1.5 font-medium tracking-wide">Bio / About</p>
                  <p className="text-gray-300 text-sm bg-slate-700/50 p-3 rounded-xl italic leading-relaxed border border-slate-700/50">
                    "{selectedProfile.bio}"
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-700/50 bg-slate-800/80 sticky bottom-0">
                <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition text-sm"
                >
                    Close
                </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 NEW: Image Preview Modal (Lightbox) 🔥 */}
      {previewImageUrl && (
        <div 
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          // Close modal when clicking on background
          onClick={() => setPreviewImageUrl(null)} 
        >
          <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
             {/* Close button */}
             <button 
              onClick={() => setPreviewImageUrl(null)}
              className="absolute -top-12 right-0 p-2.5 bg-slate-800/50 hover:bg-red-600/20 hover:text-red-400 text-gray-400 rounded-full transition z-10"
             >
                <FiX size={24} />
             </button>
             
             <img 
              src={previewImageUrl} 
              alt="Profile Full View" 
              className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border-2 border-slate-700/50"
             />
          </div>
        </div>
      )}
    </div>
  );
}

// 🔥 Helper Component with Compact Styling 🔥
function DetailRow({ label, value, isStatus = false, statusType = '', capitalize = false }: { label: string; value: string; isStatus?: boolean; statusType?: string, capitalize?: boolean }) {
  const getStatusColor = () => {
    if(statusType === 'success') return 'text-green-400 bg-green-500/10';
    if(statusType === 'warning') return 'text-yellow-400 bg-yellow-500/10';
    return 'text-white bg-slate-700';
  }

  return (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-slate-700/50 last:border-0">
      <span className="text-gray-500 text-[11px] font-medium tracking-wide mt-0.5">{label}</span>
      {isStatus ? (
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${getStatusColor()}`}>{value}</span>
      ) : (
          <span className={`text-gray-100 text-sm text-right font-medium max-w-[70%] break-words ${capitalize ? 'capitalize' : ''}`}>{value}</span>
      )}
    </div>
  );
}