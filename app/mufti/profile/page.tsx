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
  FiX,
  FiStar,
  FiCalendar,
  FiCamera // Camera icon added
} from 'react-icons/fi';
import Link from 'next/link';
import { FaMosque } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function MuftiProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    qualification: '',
    experience: '',
    bio: '',
    imageUrl: ''
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
          bio: data.user.bio || '',
          imageUrl: data.user.imageUrl || ''
        });
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Image Upload Logic 🔥
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading('Uploading photo...');

    try {
      const data = new FormData();
      data.append('file', file);
      
      // Fetching from .env.local
      const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME || 'dhn69yomz';
      const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET || 'barkati_preset';
      
      data.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: data,
      });

      const uploadedImage = await response.json();

      if (uploadedImage.secure_url) {
        setFormData(prev => ({ ...prev, imageUrl: uploadedImage.secure_url }));
        toast.success('Image uploaded! Click Save Changes.', { id: toastId });
      } else {
        toast.error('Failed to upload image. Check preset.', { id: toastId });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Network error during upload', { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setSaving(true);
    const toastId = toast.loading('Updating profile...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData) // Includes imageUrl
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Profile updated successfully!', { id: toastId });
        setProfile(data.user);
        setEditing(false);
        
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        storedUser.name = formData.name;
        localStorage.setItem('user', JSON.stringify(storedUser));
      } else {
        toast.error(data.error || 'Failed to update', { id: toastId });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Network error', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
      city: profile?.city || '',
      qualification: profile?.qualification || '',
      experience: profile?.experience || '',
      bio: profile?.bio || '',
      imageUrl: profile?.imageUrl || ''
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FiUser className="text-amber-500 text-xl" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              My Profile
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            View and manage your profile information
          </p>
        </div>
        
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition shadow-sm"
          >
            <FiEdit2 size={16} />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-amber-500 to-orange-600 relative">
          
          <div className="absolute -bottom-12 left-6">
            <div className="bg-white rounded-full p-1 shadow-xl relative group">
              <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-dark-200 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden relative">
                
                {/* 🖼️ Image rendering logic */}
                {formData.imageUrl ? (
                  <img 
                    src={formData.imageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover aspect-square"
                  />
                ) : (
                  profile?.name?.charAt(0).toUpperCase() || 'M'
                )}

                {/* 📷 Hover Overlay for Upload */}
                {editing && (
                  <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all duration-300">
                    {uploadingImage ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiCamera className="text-white text-xl" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>

              {/* Edit Indicator */}
              {editing && !uploadingImage && (
                 <div className="absolute bottom-0 right-0 bg-amber-500 text-white p-1.5 rounded-full shadow-md border-2 border-white pointer-events-none z-10">
                   <FiEdit2 size={12} />
                 </div>
              )}
            </div>
          </div>
          
          <div className="absolute bottom-3 right-4">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
              <FiStar size={12} />
              Mufti
            </span>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 p-6">
          {editing ? (
            // Edit Mode
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FiUser className="inline mr-2" size={14} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FiMail className="inline mr-2" size={14} />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
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
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500"
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
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500"
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
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500"
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
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio / Introduction
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                  placeholder="Tell about yourself, your expertise, and your approach to guiding the community..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleUpdateProfile}
                  disabled={saving || uploadingImage}
                  className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={16} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-dark-100 transition flex items-center justify-center gap-2"
                >
                  <FiX size={16} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{profile?.name}</h2>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FiMail size={14} />
                    {profile?.email}
                  </span>
                  {profile?.phone && (
                    <span className="flex items-center gap-1">
                      <FiPhone size={14} />
                      {profile?.phone}
                    </span>
                  )}
                  {profile?.city && (
                    <span className="flex items-center gap-1">
                      <FiMapPin size={14} />
                      {profile?.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    Member since {new Date(profile?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Qualification & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiBookOpen className="text-amber-500" size={18} />
                    <h3 className="font-semibold text-gray-800 dark:text-white">Qualification</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {profile?.qualification || 'Not specified'}
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiAward className="text-amber-500" size={18} />
                    <h3 className="font-semibold text-gray-800 dark:text-white">Experience</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {profile?.experience || 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {profile?.bio && (
                <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">About Me</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{profile?.bio}</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-dark-100 rounded-xl">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{profile?.approvedCount || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Requests Approved</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-dark-100 rounded-xl">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{profile?.totalReviews || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Reviews</p>
                </div>
              </div>

              {/* Islamic Note */}
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <FaMosque className="text-amber-500 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Role & Responsibility</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      As a Mufti, you are responsible for reviewing and approving rista requests, 
                      ensuring they comply with Islamic principles and Sharia law.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/mufti/requests"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition font-medium text-sm"
        >
          <FiStar size={16} />
          Review Requests
        </Link>
        <Link
          href="/mufti/advice"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-100 transition font-medium text-sm"
        >
          <FiBookOpen size={16} />
          Share Advice
        </Link>
      </div>
    </div>
  );
}