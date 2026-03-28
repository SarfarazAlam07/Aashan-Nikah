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
  FiPhone
} from 'react-icons/fi';
import { FaVenusMars, FaGraduationCap } from 'react-icons/fa';
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
    fetchProfiles();
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-white">Loading profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Browse Profiles</h1>
          <p className="text-gray-400 mt-1">
            {isSuperAdmin ? 'Manage all user profiles' : 'View user profiles'}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
        >
          <FiFilter size={16} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
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
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Search
        </button>
      </div>

      {/* Profiles Grid */}
      {profiles.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <FiUsers className="text-4xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No profiles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {profiles.map((profile) => (
            <div key={profile._id} className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition">
              {/* Header */}
              <div className={`h-24 relative ${
                profile.gender === 'male' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-r from-pink-500 to-pink-600'
              }`}>
                {profile.isVerified ? (
                  <div className="absolute top-2 right-2 bg-green-500/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] text-green-400">
                    ✓ Verified
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 bg-yellow-500/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] text-yellow-400">
                    Pending
                  </div>
                )}
                <div className="absolute -bottom-8 left-4">
                  <div className={`w-14 h-14 rounded-xl border-3 border-gray-800 shadow flex items-center justify-center text-2xl ${
                    profile.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
                  }`}>
                    {profile.gender === 'male' ? '👨' : '👩'}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-8 p-4">
                <h3 className="text-base font-semibold text-white">{profile.name}</h3>
                <p className="text-xs text-gray-400 mb-2">{profile.age} yrs • {profile.caste || 'N/A'}</p>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <FiMapPin className="text-emerald-500" size={12} />
                    <span>{profile.city}, {profile.district}</span>
                  </div>
                  {profile.profession && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <FiBriefcase className="text-emerald-500" size={12} />
                      <span>{profile.profession}</span>
                    </div>
                  )}
                  {profile.education && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <FaGraduationCap className="text-emerald-500" size={12} />
                      <span>{profile.education}</span>
                    </div>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{profile.bio}</p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProfile(profile);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 bg-gray-700 text-white py-2 rounded-lg text-xs font-medium hover:bg-gray-600"
                  >
                    <FiEye size={12} />
                    View Details
                  </button>
                  
                  {isSuperAdmin && !profile.isVerified && (
                    <button
                      onClick={() => handleVerify(profile._id)}
                      className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30"
                      title="Verify User"
                    >
                      <FiCheckCircle size={14} />
                    </button>
                  )}
                  
                  {isSuperAdmin && (
                    <button
                      onClick={() => handleDelete(profile._id, profile.name)}
                      className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30"
                      title="Delete User"
                    >
                      <FiTrash2 size={14} />
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
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Filter Profiles</h2>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white">
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Gender */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Gender</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFilters({...filters, gender: 'male'})}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        filters.gender === 'male' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => setFilters({...filters, gender: 'female'})}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        filters.gender === 'female' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      Female
                    </button>
                    <button
                      onClick={() => setFilters({...filters, gender: ''})}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm"
                    >
                      All
                    </button>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">City</label>
                  <input
                    type="text"
                    placeholder="e.g., Patna, Chhapra"
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                {/* Caste */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Caste</label>
                  <input
                    type="text"
                    placeholder="e.g., Sheikh, Ansari"
                    value={filters.caste}
                    onChange={(e) => setFilters({...filters, caste: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Age Range</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minAge}
                      onChange={(e) => setFilters({...filters, minAge: e.target.value})}
                      className="w-1/2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAge}
                      onChange={(e) => setFilters({...filters, maxAge: e.target.value})}
                      className="w-1/2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                </div>

                {/* Verification Status (Super Admin only) */}
                {isSuperAdmin && (
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Verification</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setFilters({...filters, verified: 'verified'})}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          filters.verified === 'verified' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        Verified
                      </button>
                      <button
                        onClick={() => setFilters({...filters, verified: 'pending'})}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          filters.verified === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => setFilters({...filters, verified: ''})}
                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm"
                      >
                        All
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearAllFilters}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Details Modal */}
      {showDetailsModal && selectedProfile && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Profile Details</h3>
                <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-white">
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <DetailRow label="Name" value={selectedProfile.name} />
                <DetailRow label="Email" value={selectedProfile.email} />
                {isSuperAdmin && <DetailRow label="Phone" value={selectedProfile.phone || 'N/A'} />}
                <DetailRow label="Age" value={`${selectedProfile.age} years`} />
                <DetailRow label="Gender" value={selectedProfile.gender === 'male' ? 'Male' : 'Female'} />
                <DetailRow label="Caste" value={selectedProfile.caste || 'N/A'} />
                <DetailRow label="City" value={`${selectedProfile.city}, ${selectedProfile.district}`} />
                <DetailRow label="Profession" value={selectedProfile.profession || 'N/A'} />
                <DetailRow label="Education" value={selectedProfile.education || 'N/A'} />
                <DetailRow label="Status" value={selectedProfile.isVerified ? '✓ Verified' : '⏳ Pending'} />
                <DetailRow label="Member Since" value={new Date(selectedProfile.createdAt).toLocaleDateString()} />
                {selectedProfile.bio && (
                  <div>
                    <p className="text-gray-400 text-xs">Bio</p>
                    <p className="text-white text-sm mt-1">{selectedProfile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-white text-sm">{value}</p>
    </div>
  );
}