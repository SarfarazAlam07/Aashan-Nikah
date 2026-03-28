'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiBookOpen, 
  FiAward,
  FiEdit2,
  FiSave,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MuftiMyProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    qualification: '',
    experience: '',
    bio: ''
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
    
    fetchProfile(parsed.id);
  }, [router]);

  const fetchProfile = async (userId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.user);
        setFormData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          city: data.user.city || '',
          qualification: data.user.qualification || '',
          experience: data.user.experience || '',
          bio: data.user.bio || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const toastId = toast.loading('Updating profile...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Profile updated successfully!', { id: toastId });
        setEditing(false);
        setProfile(data.user);
        
        // Update local storage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        storedUser.name = formData.name;
        localStorage.setItem('user', JSON.stringify(storedUser));
      } else {
        toast.error(data.error || 'Failed to update', { id: toastId });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Network error', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FiUser className="text-amber-500 text-xl" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Profile</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your mufti profile information</p>
        </div>
        
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
          >
            <FiEdit2 size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profile?.name?.charAt(0).toUpperCase() || 'M'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{profile?.name}</h2>
              <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <FiAward size={14} />
                Mufti
              </p>
            </div>
          </div>

          {editing ? (
            // Edit Mode
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FiUser className="inline mr-2" size={14} />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FiMail className="inline mr-2" size={14} />
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FiPhone className="inline mr-2" size={14} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FiMapPin className="inline mr-2" size={14} />
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="e.g., Patna, Chhapra"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FiBookOpen className="inline mr-2" size={14} />
                  Qualification
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                  placeholder="e.g., Darul Uloom Deoband"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FiAward className="inline mr-2" size={14} />
                  Experience
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  placeholder="e.g., 5 years"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio / Introduction
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                  placeholder="Tell about yourself..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateProfile}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center justify-center gap-2"
                >
                  <FiSave size={16} />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-100 transition flex items-center justify-center gap-2"
                >
                  <FiX size={16} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-4">
              <InfoRow label="Email" value={profile?.email} icon={<FiMail />} />
              <InfoRow label="Phone" value={profile?.phone || 'Not provided'} icon={<FiPhone />} />
              <InfoRow label="City" value={profile?.city || 'Not provided'} icon={<FiMapPin />} />
              <InfoRow label="Qualification" value={profile?.qualification || 'Not provided'} icon={<FiBookOpen />} />
              <InfoRow label="Experience" value={profile?.experience || 'Not provided'} icon={<FiAward />} />
              
              {profile?.bio && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</p>
                  <p className="text-gray-600 dark:text-gray-400">{profile.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dark-100 rounded-xl">
      <div className="text-amber-500 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm text-gray-800 dark:text-white font-medium">{value}</p>
      </div>
    </div>
  );
}