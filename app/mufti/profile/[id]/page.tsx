'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar, 
  FiBriefcase, 
  FiBookOpen,
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiStar
} from 'react-icons/fi';
import { FaVenusMars, FaGraduationCap, FaMosque } from 'react-icons/fa';
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

export default function MuftiProfileDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
    
    fetchProfile();
  }, [router, params.id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.user);
      } else {
        toast.error('Profile not found');
        router.push('/mufti/profiles');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Profile not found</p>
        <Link href="/mufti/profiles" className="mt-4 inline-block text-amber-600 hover:underline">
          Back to Profiles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/mufti/profiles"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition mb-4 group"
      >
        <FiArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
        <span>Back to Profiles</span>
      </Link>

      {/* Profile Card */}
      <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header Banner */}
        <div className={`h-32 ${profile.gender === 'male' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-pink-500 to-pink-600'}`}>
          <div className="flex justify-end p-4">
            {profile.isVerified ? (
              <span className="bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-green-400 flex items-center gap-1">
                <FiCheckCircle size={12} /> Verified
              </span>
            ) : (
              <span className="bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-yellow-400 flex items-center gap-1">
                <FiXCircle size={12} /> Pending
              </span>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="absolute -top-12 left-6">
            <div className={`w-24 h-24 rounded-2xl border-4 border-white dark:border-dark-200 shadow-lg flex items-center justify-center text-4xl ${
              profile.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
            }`}>
              {profile.gender === 'male' ? '👨' : '👩'}
            </div>
          </div>

          {/* Name and Basic Info */}
          <div className="pt-14 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{profile.name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-gray-500 dark:text-gray-400">{profile.age} years</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 dark:text-gray-400 capitalize">{profile.gender}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 dark:text-gray-400">{profile.caste || 'Caste not specified'}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <DetailCard 
              icon={<FiMail className="text-amber-500" />}
              label="Email"
              value={profile.email}
            />
            {profile.phone && (
              <DetailCard 
                icon={<FiPhone className="text-amber-500" />}
                label="Phone"
                value={profile.phone}
              />
            )}
            <DetailCard 
              icon={<FiMapPin className="text-amber-500" />}
              label="Location"
              value={`${profile.city}, ${profile.district}`}
            />
            <DetailCard 
              icon={<FaVenusMars className="text-amber-500" />}
              label="Gender"
              value={profile.gender === 'male' ? 'Male' : 'Female'}
            />
            {profile.profession && (
              <DetailCard 
                icon={<FiBriefcase className="text-amber-500" />}
                label="Profession"
                value={profile.profession}
              />
            )}
            {profile.education && (
              <DetailCard 
                icon={<FaGraduationCap className="text-amber-500" />}
                label="Education"
                value={profile.education}
              />
            )}
            <DetailCard 
              icon={<FiCalendar className="text-amber-500" />}
              label="Member Since"
              value={new Date(profile.createdAt).toLocaleDateString()}
            />
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <FiBookOpen className="text-amber-500" />
                About
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Islamic Note */}
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <FaMosque className="text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Islamic Note</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  This profile is being reviewed by Mufti. Please ensure all information is verified and Sharia-compliant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href={`/mufti/requests`}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition text-center"
        >
          <FiStar size={18} />
          Review Related Requests
        </Link>
        <Link
          href="/mufti/profiles"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-100 transition text-center"
        >
          <FiUser size={18} />
          Browse More Profiles
        </Link>
      </div>
    </div>
  );
}

// DetailCard Component
function DetailCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dark-100 rounded-xl">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm text-gray-800 dark:text-white font-medium">{value}</p>
      </div>
    </div>
  );
}