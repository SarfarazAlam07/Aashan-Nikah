'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiCamera } from 'react-icons/fi'; // FiCamera add kiya hai
import { BIHAR_DISTRICTS, ALL_CITIES } from '@/lib/locations';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false); // Image upload loading state
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    city: '',
    district: 'Saran',
    caste: '',
    profession: '',
    education: '',
    bio: '',
    imageUrl: '' // Naya field add kiya
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/signin');
        return;
      }
      
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/users/${parsedUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          const profile = data.user;
          setFormData({
            name: profile.name || parsedUser.name,
            email: profile.email || parsedUser.email,
            phone: profile.phone || '',
            age: profile.age || '',
            gender: profile.gender || '',
            city: profile.city || '',
            district: profile.district || 'Saran',
            caste: profile.caste || '',
            profession: profile.profession || '',
            education: profile.education || '',
            bio: profile.bio || '',
            imageUrl: profile.imageUrl || '' // Database se image load karna
          });
          setSelectedDistrict(profile.district || 'Saran');
          setLoading(false);
          return;
        }
      }
      
      // Fallback to local storage
      const savedProfile = localStorage.getItem(`userProfile_${parsedUser.id}`);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setFormData({
          name: profile.name || parsedUser.name,
          email: profile.email || parsedUser.email,
          phone: profile.phone || '',
          age: profile.age || '',
          gender: profile.gender || '',
          city: profile.city || '',
          district: profile.district || 'Saran',
          caste: profile.caste || '',
          profession: profile.profession || '',
          education: profile.education || '',
          bio: profile.bio || '',
          imageUrl: profile.imageUrl || ''
        });
      } else {
        setFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: '',
          age: '',
          gender: '',
          city: '',
          district: 'Saran',
          caste: '',
          profession: '',
          education: '',
          bio: '',
          imageUrl: ''
        });
      }
      setSelectedDistrict('Saran');
      setLoading(false);
      
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoading(false);
    }
  };

  const filteredCities = selectedDistrict 
    ? ALL_CITIES.filter(city => city.district === selectedDistrict)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'district') {
      setSelectedDistrict(value);
      setFormData(prev => ({ ...prev, city: '' }));
    }
  };

  // ✅ Image Upload Logic
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Size Validation (Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading('Uploading profile picture...');

    try {
      const data = new FormData();
      data.append('file', file);
      
      // 🔥 FIX: Using environment variables instead of dummy text 🔥
      const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME ;
      const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET ;
      
      data.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: data,
      });

      const uploadedImage = await response.json();

      if (uploadedImage.secure_url) {
        setFormData(prev => ({ ...prev, imageUrl: uploadedImage.secure_url }));
        toast.success('Image uploaded! Click Save Changes to update.', { id: toastId });
      } else {
        console.error('Cloudinary Error:', uploadedImage);
        toast.error('Failed to upload. Check your Upload Preset name.', { id: toastId });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Network error during upload', { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData) // imageUrl bhi saath jayega
      });
      
      if (!response.ok) {
        throw new Error('Failed to save');
      }
      
      const data = await response.json();
      
      if (data.success) {
        const updatedUser = { ...currentUser, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem(`userProfile_${currentUser.id}`, JSON.stringify(formData));
        setUser(updatedUser);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    loadProfile(); 
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="h-28 sm:h-32 relative">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-4 right-4 sm:right-6 bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/30 transition flex items-center gap-2 text-sm sm:text-base z-10"
            >
              <FiEdit2 size={16} />
              <span>Edit Profile</span>
            </button>
          )}
          
          <div className="absolute -bottom-12 left-4 sm:left-6">
            <div className="bg-white rounded-full p-1 shadow-xl relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-100 rounded-full flex items-center justify-center text-3xl sm:text-4xl overflow-hidden relative">
                
                {/* 🖼️ Image rendering logic */}
                {formData.imageUrl ? (
                  <img 
                    src={formData.imageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover aspect-square"
                  />
                ) : (
                  formData.gender === 'male' ? '👨' : '👩'
                )}

                {/* 📷 Hover Overlay for Upload (Only in Edit Mode) */}
                {isEditing && (
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
              
              {/* Pencil Icon indicator */}
              {isEditing && !uploadingImage && (
                 <div className="absolute bottom-0 right-0 bg-amber-500 text-white p-1.5 rounded-full shadow-md border-2 border-white pointer-events-none z-10">
                   <FiEdit2 size={12} />
                 </div>
              )}

            </div>
          </div>
        </div>
        
        <div className="px-4 sm:px-6 pb-6 pt-14 sm:pt-16 bg-white">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{formData.name || user?.name}</h1>
          <p className="text-amber-600 text-sm sm:text-base">{formData.email || user?.email}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="18"
                  max="100"
                  placeholder="25"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleChange}
                      className="accent-amber-500"
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleChange}
                      className="accent-amber-500"
                    />
                    <span>Female</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caste</label>
                <input
                  type="text"
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                  placeholder="e.g., Sheikh, Ansari"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  {BIHAR_DISTRICTS.map((district) => (
                    <option key={district.value} value={district.value}>
                      {district.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select City</option>
                  {filteredCities.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="e.g., Teacher, Engineer"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g., Graduate, MA"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
              >
                {saving ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> : <FiSave size={16} />}
                Save Changes
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                <FiX size={16} />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Profile Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-gray-800 font-medium text-sm">{formData.name || user?.name}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-gray-800 font-medium text-sm">{formData.email || user?.email}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-gray-800 font-medium text-sm">{formData.phone || 'Not provided'}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Age</p>
                <p className="text-gray-800 font-medium text-sm">{formData.age ? `${formData.age} years` : 'Not provided'}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Gender</p>
                <p className="text-gray-800 font-medium text-sm">{formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : 'Not provided'}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Caste</p>
                <p className="text-gray-800 font-medium text-sm">{formData.caste || 'Not provided'}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">City</p>
                <p className="text-gray-800 font-medium text-sm">{formData.city || 'Not provided'}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">District</p>
                <p className="text-gray-800 font-medium text-sm">{getDistrictLabel(formData.district)}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Profession</p>
                <p className="text-gray-800 font-medium text-sm">{formData.profession || 'Not provided'}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Education</p>
                <p className="text-gray-800 font-medium text-sm">{formData.education || 'Not provided'}</p>
              </div>
            </div>
            
            {formData.bio && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="font-medium text-gray-700 mb-2">About Me</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{formData.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getDistrictLabel(districtValue: string): string {
  const district = BIHAR_DISTRICTS.find(d => d.value === districtValue);
  return district?.label || districtValue;
}