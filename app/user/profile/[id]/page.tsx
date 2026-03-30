// app/user/profile/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiMapPin, 
  FiBriefcase, 
  FiHeart, 
  FiCalendar,
  FiUser,
  FiMessageCircle,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Profile {
  _id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  city: string;
  district: string;
  caste?: string;
  profession?: string;
  education?: string;
  bio?: string;
  isVerified: boolean;
  createdAt: string;
}

export default function ViewProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: profileId } = use(params);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/signin');
      return;
    }
    
    setCurrentUser(JSON.parse(userData));
    
    const token = localStorage.getItem('token');
    console.log('🔐 Token exists:', token ? 'Yes' : 'No');
    console.log('🔍 Fetching profile:', profileId);
    
    if (!token) {
      console.log('❌ No token found');
      toast.error('Please login again');
      router.push('/signin');
      return;
    }
    
    const response = await fetch(`/api/users/${profileId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📥 Response status:', response.status);
    
    const data = await response.json();
    console.log('📥 Response data:', data);
    
    if (data.success) {
      setProfile(data.user);
      await checkRequestStatus(profileId);
    } else if (response.status === 403) {
      toast.error('You cannot view this profile');
      router.back();
    } else {
      toast.error(data.error || 'Failed to load profile');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    toast.error('Failed to load profile');
  } finally {
    setLoading(false);
  }
};
    
    fetchProfile();
  }, [profileId, router]);

  const checkRequestStatus = async (receiverId: string) => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      
      const currentUserData = JSON.parse(userData);
      
      const response = await fetch(`/api/requests?userId=${currentUserData.id}&type=sent`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        const existingRequest = data.requests.find((r: any) => r.receiverId?._id === receiverId);
        if (existingRequest) {
          setRequestStatus(existingRequest.status);
        }
      }
    } catch (error) {
      console.error('Error checking request status:', error);
    }
  };

  const handleSendRista = async () => {
    if (!currentUser) {
      toast.error('Please login');
      router.push('/signin');
      return;
    }
    
    const toastId = toast.loading('Sending request...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: profile?._id,
          message: `I am interested in your profile.`
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('Request sent to admin for approval!', { id: toastId });
        setRequestStatus('PENDING_ADMIN');
      } else {
        toast.error(data.error || 'Failed to send request', { id: toastId });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error', { id: toastId });
    }
  };

  const getRequestButton = () => {
    if (currentUser?.gender === profile?.gender) {
      return (
        <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium border border-gray-200">
          Cannot send request to same gender
        </div>
      );
    }
    if (!requestStatus) {
      return (
        <button
          onClick={handleSendRista}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
        >
          <FiHeart size={18} />
          Send Rista
        </button>
      );
    }
    
    switch(requestStatus) {
      case 'PENDING_ADMIN':
        return (
          <button
            disabled
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-xl opacity-70 cursor-not-allowed"
          >
            <FiClock size={18} />
            Pending Admin Approval
          </button>
        );
      case 'SENT_TO_USER':
        return (
          <button
            disabled
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl opacity-70 cursor-not-allowed"
          >
            <FiMessageCircle size={18} />
            Request Sent
          </button>
        );
      case 'ACCEPTED':
        return (
          <button
            disabled
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl opacity-70 cursor-not-allowed"
          >
            <FiCheckCircle size={18} />
            Rista Accepted ✓
          </button>
        );
      case 'REJECTED':
        return (
          <button
            onClick={handleSendRista}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
          >
            <FiHeart size={18} />
            Send Rista Again
          </button>
        );
      default:
        return (
          <button
            onClick={handleSendRista}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
          >
            <FiHeart size={18} />
            Send Rista
          </button>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Profile not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-emerald-600">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="h-32 relative">
          <div className="absolute -bottom-12 left-6">
            <div className="bg-white rounded-full p-1 shadow-xl">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center text-4xl">
                {profile.imageUrl ? (
                  <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover aspect-square" />
                ) : (
                  profile.gender === 'male' ? '👨' : '👩'
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 pb-6 pt-14 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
              <p className="text-gray-600">{profile.age} years</p>
              {profile.isVerified && (
                <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  ✓ Verified Profile
                </span>
              )}
            </div>
            {getRequestButton()}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">About</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InfoItem icon={<FiMapPin />} label="Location" value={`${profile.city || 'N/A'}, ${profile.district}`} />
          <InfoItem icon={<FiBriefcase />} label="Profession" value={profile.profession || 'Not provided'} />
          <InfoItem icon={<FaGraduationCap />} label="Education" value={profile.education || 'Not provided'} />
          <InfoItem icon={<FiUser />} label="Caste" value={profile.caste || 'Not provided'} />
          <InfoItem icon={<FiCalendar />} label="Member Since" value={new Date(profile.createdAt).toLocaleDateString()} />
        </div>
        
        {profile.bio && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="font-medium text-gray-700 mb-2">Bio</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="text-emerald-600">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}