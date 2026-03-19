// app/user/profiles/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiSearch, FiFilter, FiMapPin, FiBriefcase, FiHeart, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DUMMY_PROFILES = [
  {
    id: 1,
    name: 'Fatima Khan',
    age: 24,
    gender: 'female',
    city: 'Chhapra',
    district: 'Saran',
    caste: 'Sheikh',
    profession: 'Teacher',
    education: 'MA',
    bio: 'Looking for pious and kind partner. Love reading Quran and teaching children.',
  },
  {
    id: 2,
    name: 'Mohammad Ali',
    age: 27,
    gender: 'male',
    city: 'Patna',
    district: 'Patna',
    caste: 'Syed',
    profession: 'Software Engineer',
    education: 'BTech',
    bio: 'Simple and religious person. Working in MNC, looking for pious spouse.',
  },
  {
    id: 3,
    name: 'Aisha Begum',
    age: 22,
    gender: 'female',
    city: 'Siwan',
    district: 'Siwan',
    caste: 'Ansari',
    profession: 'Student',
    education: 'Graduate',
    bio: 'Love reading Quran, interested in Islamic studies. Looking for kind partner.',
  },
  {
    id: 4,
    name: 'Omar Farooq',
    age: 29,
    gender: 'male',
    city: 'Gopalganj',
    district: 'Gopalganj',
    caste: 'Pathan',
    profession: 'Businessman',
    education: 'MBA',
    bio: 'Own garment business in Patna. Looking for housewife with good values.',
  },
];

export default function ProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState(DUMMY_PROFILES);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    city: '',
    minAge: '',
    maxAge: ''
  });

  const handleSearch = () => {
    let filtered = DUMMY_PROFILES;
    
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.caste.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (filters.gender) filtered = filtered.filter(p => p.gender === filters.gender);
    if (filters.city) filtered = filtered.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
    if (filters.minAge) filtered = filtered.filter(p => p.age >= parseInt(filters.minAge));
    if (filters.maxAge) filtered = filtered.filter(p => p.age <= parseInt(filters.maxAge));
    
    setProfiles(filtered);
    
    // Show search results toast
    if (filtered.length === 0) {
      toast.error('No profiles found matching your criteria', {
        duration: 3000,
        position: 'top-center',
        icon: '😔',
      });
    } else {
      toast.success(`Found ${filtered.length} profiles`, {
        duration: 2000,
        position: 'top-center',
      });
    }
  };

  const handleFilter = () => {
    let filtered = DUMMY_PROFILES;
    
    if (filters.gender) filtered = filtered.filter(p => p.gender === filters.gender);
    if (filters.city) filtered = filtered.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
    if (filters.minAge) filtered = filtered.filter(p => p.age >= parseInt(filters.minAge));
    if (filters.maxAge) filtered = filtered.filter(p => p.age <= parseInt(filters.maxAge));
    
    setProfiles(filtered);
    setShowFilters(false);
    
    // Show filter applied toast
    toast.success('Filters applied successfully', {
      duration: 2000,
      position: 'top-center',
    });
  };

  const clearFilters = () => {
    setFilters({ gender: '', city: '', minAge: '', maxAge: '' });
    setSearch('');
    setProfiles(DUMMY_PROFILES);
    setShowFilters(false);
    
    toast.success('All filters cleared', {
      duration: 2000,
      position: 'top-center',
      icon: '✨',
    });
  };

  const handleSendRista = (profile: any) => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      toast.error('Please login to send rista request', {
        duration: 3000,
        position: 'top-center',
      });
      router.push('/signin');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Sending rista request...');

    // Simulate API call
    setTimeout(() => {
      toast.dismiss(loadingToast);
      
      // Success toast with custom design
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col border-l-4 border-emerald-600`}>
          <div className="flex items-start p-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <FiHeart className="text-emerald-600" size={20} />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Rista Request Sent! 🎉
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Your request has been sent to {profile.name} for admin approval
              </p>
              <div className="mt-3 flex space-x-3">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    router.push('/user/requests');
                  }}
                  className="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition"
                >
                  View Requests
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="text-sm bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="ml-4 text-gray-400 hover:text-gray-500"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      ), { duration: 6000 });

      // Also show a simple success toast
      toast.success('Request sent to admin for approval', {
        duration: 3000,
        position: 'top-center',
        icon: '✅',
      });

    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Rest of your JSX remains the same */}
        
        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
              {/* Profile Header */}
              <div className={`h-28 sm:h-32 relative ${profile.gender === 'male' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-pink-500 to-pink-600'}`}>
                <div className="absolute -bottom-10 left-6">
                  <div className={`w-20 h-20 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl ${
                    profile.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
                  }`}>
                    {profile.gender === 'male' ? '👨' : '👩'}
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="pt-12 p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {profile.age} years • {profile.caste}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiMapPin className="mr-2 text-emerald-500 flex-shrink-0" size={16} />
                    <span className="truncate">{profile.city}, {profile.district}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiBriefcase className="mr-2 text-emerald-500 flex-shrink-0" size={16} />
                    <span className="truncate">{profile.profession}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Education:</span> {profile.education}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {profile.bio}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href={`/user/profile/${profile.id}`}
                    className="flex-1 text-center px-4 py-2.5 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition font-medium text-sm"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => handleSendRista(profile)}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition font-medium text-sm shadow-sm hover:shadow active:scale-95"
                  >
                    <FiHeart size={16} />
                    <span>Send Rista</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}