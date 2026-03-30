'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiMapPin, 
  FiBriefcase, 
  FiHeart, 
  FiCalendar,
  FiUser,
  FiUsers, 
  FiMessageCircle,
  FiCheckCircle,
  FiClock,
  FiChevronLeft,
  FiBookOpen,
  FiStar,
  FiX
} from 'react-icons/fi';
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
  imageUrl?: string;
  isVerified: boolean;
  createdAt: string;
  // 🔥 Saare naye fields yahan hain
  motherTongue?: string;
  maritalStatus?: string;
  height?: string;
  postedBy?: string;
  familyDetails?: string;
  partnerPreferences?: string;
}

export default function ViewProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: profileId } = use(params);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Image Lightbox State
  const [showImageModal, setShowImageModal] = useState(false);

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
        
        if (!token) {
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
        
        const data = await response.json();
        
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

  // Handle ESC key press to close image modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowImageModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

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
        const existingRequest = data.requests.find((r: any) => r.receiverId?._id === receiverId || r.receiverId === receiverId);
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
          message: `Assalamu Alaikum, I am interested in your profile.`
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
        <button disabled className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 font-bold cursor-not-allowed border border-gray-200 dark:border-gray-700">
          Not Allowed (Same Gender)
        </button>
      );
    }
    
    if (!requestStatus) {
      return (
        <button onClick={handleSendRista} className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold transition-all shadow-lg hover:shadow-green-500/30 hover:scale-105 active:scale-95">
          <FiMessageCircle size={20} /> Send Connection Request
        </button>
      );
    }
    
    switch(requestStatus) {
      case 'PENDING_ADMIN':
        return (
          <button disabled className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-yellow-500 text-white font-bold opacity-80 cursor-not-allowed">
            <FiClock size={20} /> Pending Admin Approval
          </button>
        );
      case 'SENT_TO_USER':
        return (
          <button disabled className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-blue-500 text-white font-bold opacity-80 cursor-not-allowed">
            <FiMessageCircle size={20} /> Request Sent
          </button>
        );
      case 'ACCEPTED':
        return (
          <button disabled className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-green-600 text-white font-bold cursor-not-allowed shadow-lg shadow-green-500/20">
            <FiCheckCircle size={20} /> Rista Accepted ✓
          </button>
        );
      case 'REJECTED':
        return (
          <button onClick={handleSendRista} className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold hover:scale-105 transition-all shadow-lg">
            <FiHeart size={20} /> Send Rista Again
          </button>
        );
      default:
        return (
          <button onClick={handleSendRista} className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold transition-all shadow-lg hover:scale-105">
            <FiMessageCircle size={20} /> Send Connection Request
          </button>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Fetching profile details...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Profile not found</h2>
        <button onClick={() => router.back()} className="text-green-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="pb-12 max-w-5xl mx-auto relative px-2 sm:px-0">
      {/* Back Button */}
      <div className="mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 transition font-medium">
          <FiChevronLeft size={20} /> Back to Profiles
        </button>
      </div>

      {/* Main Profile Card - Premium Design */}
      <div className="bg-white dark:bg-dark-200 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700/50">
        
        {/* HERO HEADER AREA */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-900">
          
          {/* Blurred Background Image */}
          {profile.imageUrl ? (
            <img 
              src={profile.imageUrl} 
              alt="background" 
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50"
            />
          ) : (
            <div className={`absolute inset-0 w-full h-full ${profile.gender === 'male' ? 'bg-gradient-to-br from-blue-900 to-slate-900' : 'bg-gradient-to-br from-pink-900 to-slate-900'}`}></div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Verified Badge */}
          {profile.isVerified && (
            <div className="absolute top-6 right-6 bg-green-500/20 backdrop-blur-md border border-green-500/30 px-4 py-1.5 rounded-full flex items-center gap-2 text-green-400 font-medium text-sm shadow-lg z-20">
              <FiCheckCircle /> Verified Profile
            </div>
          )}

          {/* Center Large Profile Image with Fixes */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <div 
              className={`w-40 h-40 sm:w-44 sm:h-44 rounded-full border-[6px] border-white dark:border-dark-200 shadow-2xl overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center ${profile.imageUrl ? 'cursor-pointer hover:scale-105 transition-transform duration-300' : ''}`}
              onClick={() => profile.imageUrl && setShowImageModal(true)}
              title={profile.imageUrl ? "Click to enlarge" : ""}
            >
              {profile.imageUrl ? (
                <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover aspect-square" />
              ) : (
                <span className="text-6xl">{profile.gender === 'male' ? '👨' : '👩'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-6 px-6 md:px-10 pb-10 text-center">
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white capitalize">{profile.name}</h1>
          {profile.profession && (
            <p className="text-lg text-green-600 dark:text-green-400 font-medium mt-1">{profile.profession}</p>
          )}
          
          {/* Quick Badges - Using Real Data */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-5 text-gray-600 dark:text-gray-300 font-medium">
            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-dark-100 px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700/50">
              <FiUser className="text-green-500"/> {profile.age} Yrs {profile.height ? `, ${profile.height}` : ''}
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-dark-100 px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700/50 capitalize">
              <FiHeart className="text-green-500"/> {profile.maritalStatus || profile.gender}
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-dark-100 px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700/50">
              <FiMapPin className="text-green-500"/> {profile.city || profile.district}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center">
            {getRequestButton()}
          </div>
        </div>
      </div>

      {/* Detailed Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Me */}
          {profile.bio && (
            <div className="bg-white dark:bg-dark-200 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"><FiUser className="text-green-600"/></div> 
                About Me
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          {/* Family Details */}
          {profile.familyDetails && (
            <div className="bg-white dark:bg-dark-200 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"><FiUsers className="text-green-600"/></div> 
                Family Details
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap">{profile.familyDetails}</p>
            </div>
          )}

          {/* Education & Career */}
          <div className="bg-white dark:bg-dark-200 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 grid sm:grid-cols-2 gap-8 hover:shadow-md transition">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"><FiBookOpen className="text-green-600"/></div> 
                Education
              </h3>
              <p className="font-semibold text-gray-800 dark:text-white text-lg">{profile.education || 'Not Specified'}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"><FiBriefcase className="text-green-600"/></div> 
                Profession
              </h3>
              <p className="font-semibold text-gray-800 dark:text-white text-lg">{profile.profession || 'Not Specified'}</p>
            </div>
          </div>
        </div>

        {/* Right Column (Key Stats) */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-dark-200 p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-5 border-b border-gray-100 dark:border-gray-700 pb-3">Personal Info</h4>
            <div className="space-y-3">
              <InfoRow label="Age" value={`${profile.age} Years`} />
              <InfoRow label="Height" value={profile.height || 'Not Specified'} />
              <InfoRow label="Marital Status" value={profile.maritalStatus || 'Never Married'} />
              <InfoRow label="Mother Tongue" value={profile.motherTongue || 'Not Specified'} />
              <InfoRow label="Gender" value={profile.gender} capitalize />
              <InfoRow label="Caste" value={profile.caste || 'Not Specified'} />
              <InfoRow label="City" value={profile.city || 'Not Specified'} />
              <InfoRow label="District" value={profile.district} />
              <InfoRow label="Posted By" value={profile.postedBy || 'Self'} />
            </div>
          </div>

          {/* Partner Preferences */}
          {profile.partnerPreferences && (
            <div className="bg-white dark:bg-dark-200 p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiStar className="text-amber-500"/> Partner Preferences
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30 whitespace-pre-wrap leading-relaxed">
                {profile.partnerPreferences}
              </p>
            </div>
          )}

          {/* Verified Callout */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-3xl border border-green-100 dark:border-green-800/30 text-center shadow-sm">
            <div className="w-12 h-12 bg-white dark:bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-green-100 dark:border-green-800/50">
              <FiCheckCircle className="text-green-500 text-xl" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Verified by Mufti</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Profiles on Nikah Aasan are reviewed for authenticity. Send a request to connect securely.
            </p>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {showImageModal && profile?.imageUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in"
          onClick={() => setShowImageModal(false)}
        >
          <button 
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2.5 rounded-full z-[110] transition-all hover:scale-110 active:scale-95"
            title="Close (Esc)"
          >
            <FiX size={28} />
          </button>

          <div 
            className="relative max-w-5xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} 
          >
            <img 
              src={profile.imageUrl} 
              alt={profile.name} 
              className="rounded-lg shadow-2xl object-contain max-w-full max-h-[90vh] animate-scale-in"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-medium capitalize shadow-lg">
              {profile.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for the right sidebar info rows
function InfoRow({ label, value, capitalize = false }: { label: string, value: string, capitalize?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
      <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</span>
      <span className={`text-gray-900 dark:text-white font-semibold text-sm text-right w-1/2 break-words ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </span>
    </div>
  );
}