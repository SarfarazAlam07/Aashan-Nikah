'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiCamera, FiChevronDown } from 'react-icons/fi';
import { BIHAR_DISTRICTS, ALL_CITIES } from '@/lib/locations';

// 🔥 FIXED CUSTOM SELECT COMPONENT 🔥
function CustomSelect({ name, value, options, onChange, placeholder = "Select option..." }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt: any) => opt.value === value)?.label || placeholder;

  return (
    // Dynamic z-index: jab open ho toh sabse upar z-50
    <div className={`relative w-full min-w-0 ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 sm:py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm bg-white dark:bg-gray-800 text-left flex justify-between items-center transition-shadow shadow-sm"
      >
        <span className={`truncate pr-2 ${!value ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-white'}`}>
          {selectedLabel}
        </span>
        <FiChevronDown size={14} className={`text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl max-h-48 overflow-y-auto py-1 animate-fade-in z-50">
          {options.length === 0 ? (
            <li className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">No options found</li>
          ) : (
            options.map((opt: any) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange({ target: { name, value: opt.value } });
                  setIsOpen(false); // Select karne par band karo
                }}
                className={`px-3 py-2.5 text-xs sm:text-sm cursor-pointer truncate transition-colors ${
                  value === opt.value 
                    ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold border-l-2 border-amber-500' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {opt.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
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
    imageUrl: '',
    motherTongue: '',
    maritalStatus: 'Never Married',
    height: '',
    postedBy: 'Self',
    familyDetails: '',
    partnerPreferences: '',
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
            imageUrl: profile.imageUrl || '',
            motherTongue: profile.motherTongue || '',
            maritalStatus: profile.maritalStatus || 'Never Married',
            height: profile.height || '',
            postedBy: profile.postedBy || 'Self',
            familyDetails: profile.familyDetails || '',
            partnerPreferences: profile.partnerPreferences || '',
          });
          setSelectedDistrict(profile.district || 'Saran');
          setLoading(false);
          return;
        }
      }
      
      const savedProfile = localStorage.getItem(`userProfile_${parsedUser.id}`);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setFormData(prev => ({ ...prev, ...profile }));
      }
      
      setSelectedDistrict('Saran');
      setLoading(false);
      
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoading(false);
    }
  };

  const filteredCities = selectedDistrict 
    ? ALL_CITIES.filter((city: any) => city.district === selectedDistrict) // 🔥 FIXED: Added (city: any)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string, value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'district') {
      setSelectedDistrict(value);
      setFormData(prev => ({ ...prev, city: '' }));
    }
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Check agar start me '+' hai
    const hasPlus = val.startsWith('+');
    
    // Baaki puri string se saare non-numbers (A-Z, space, -, etc.) hata do
    const digitsOnly = val.replace(/\D/g, '');
    
    // Agar shuru me '+' tha, toh usko wapas laga do numbers ke aage
    const finalValue = hasPlus ? '+' + digitsOnly : digitsOnly;
    
    // Limit to max 15 characters (+ aur 14 numbers) taaki bohot lamba na ho
    if (finalValue.length <= 15) {
      setFormData(prev => ({ ...prev, phone: finalValue }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading('Uploading profile picture...');

    try {
      const data = new FormData();
      data.append('file', file);
      
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
        toast.success('Image uploaded! Click Save Changes to update.', { id: toastId });
      } else {
        toast.error('Failed to upload image. Check preset.', { id: toastId });
      }
    } catch (error) {
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
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to save');
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

  const maritalStatusOptions = [
    { value: 'Never Married', label: 'Never Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' },
    { value: 'Awaiting Divorce', label: 'Awaiting Divorce' }
  ];

  const postedByOptions = [
    { value: 'Self', label: 'Self' },
    { value: 'Parent', label: 'Parent' },
    { value: 'Sibling', label: 'Sibling' },
    { value: 'Relative', label: 'Relative' },
    { value: 'Friend', label: 'Friend' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
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
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Profile" className="w-full h-full object-cover aspect-square" />
                ) : (
                  formData.gender === 'male' ? '👨' : '👩'
                )}

                {isEditing && (
                  <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all duration-300">
                    {uploadingImage ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiCamera className="text-white text-xl" />
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                )}
              </div>
              
              {isEditing && !uploadingImage && (
                 <div className="absolute bottom-0 right-0 bg-amber-500 text-white p-1.5 rounded-full shadow-md border-2 border-white pointer-events-none z-10">
                   <FiEdit2 size={12} />
                 </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-4 sm:px-6 pb-6 pt-14 sm:pt-16 bg-white">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{formData.name || user?.name}</h1>
          <p className="text-amber-600 text-sm sm:text-base truncate">{formData.email || user?.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-10 overflow-visible">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Basic Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full text-black min-w-0 max-w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm overflow-hidden text-ellipsis" />
              </div>

              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} disabled className="w-full min-w-0 max-w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm overflow-hidden text-ellipsis" />
              </div>

              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone</label>
<input 
  type="tel" 
  name="phone" 
  value={formData.phone} 
  onChange={handlePhoneChange} 
  placeholder="+919876543210" 
  maxLength={15}
  className="w-full text-black min-w-0 max-w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm overflow-hidden text-ellipsis" 
/>              </div>

              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} min="18" max="100" placeholder="25" className="w-full text-black min-w-0 max-w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm overflow-hidden text-ellipsis" />
              </div>

              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Gender</label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} className="accent-amber-500  w-4 h-4" />
                    <span className="text-sm text-black">Male</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} className="accent-amber-500  w-4 h-4" />
                    <span className="text-sm text-black">Female</span>
                  </label>
                </div>
              </div>

              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Caste</label>
                <input type="text" name="caste" value={formData.caste} onChange={handleChange} placeholder="e.g., Sheikh, Ansari" className="w-full text-black min-w-0 max-w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm overflow-hidden text-ellipsis" />
              </div>

              {/* District Custom Select */}
              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">District</label>
                <CustomSelect 
                  name="district"
                  value={formData.district}
                  options={BIHAR_DISTRICTS}
                  onChange={handleChange}
                  placeholder="Select District"
                />
              </div>

              {/* City Custom Select */}
              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">City</label>
                <CustomSelect 
                  name="city"
                  value={formData.city}
                  options={filteredCities}
                  onChange={handleChange}
                  placeholder={formData.district ? "Select City" : "Select District first"}
                />
              </div>
              
              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Profession</label>
                <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="e.g., Teacher" className="w-full text-black min-w-0 max-w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm overflow-hidden text-ellipsis" />
              </div>

              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Education</label>
                <input type="text" name="education" value={formData.education} onChange={handleChange} placeholder="e.g., B.Tech, M.A." className="w-full text-black min-w-0 max-w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm overflow-hidden text-ellipsis" />
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-8 mb-4 border-b pb-2">Matrimony Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
              {/* Marital Status Custom Select */}
              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                <CustomSelect 
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  options={maritalStatusOptions}
                  onChange={handleChange}
                />
              </div>

              {/* Posted By Custom Select */}
              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Profile Posted By</label>
                <CustomSelect 
                  name="postedBy"
                  value={formData.postedBy}
                  options={postedByOptions}
                  onChange={handleChange}
                />
              </div>

              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Height</label>
                <input type="text" name="height" value={formData.height} onChange={handleChange} placeholder="e.g., 5 ft 6 in" className="w-full text-black min-w-0 max-w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm overflow-hidden text-ellipsis" />
              </div>

              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Mother Tongue</label>
                <input type="text" name="motherTongue" value={formData.motherTongue} onChange={handleChange} placeholder="e.g., Urdu, Hindi" className="w-full text-black min-w-0 max-w-full px-3 py-2.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm overflow-hidden text-ellipsis" />
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5 pt-2 w-full">
              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">About Me (Bio)</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Tell us about your personality..." className="w-full text-black min-w-0 max-w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none text-sm" />
              </div>

              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Family Details</label>
                <textarea name="familyDetails" value={formData.familyDetails} onChange={handleChange} rows={3} placeholder="Tell us about your parents, siblings..." className="w-full text-black min-w-0 max-w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none text-sm" />
              </div>

              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Partner Preferences</label>
                <textarea name="partnerPreferences" value={formData.partnerPreferences} onChange={handleChange} rows={3} placeholder="What kind of life partner are you looking for?" className="w-full text-black min-w-0 max-w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none text-sm" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100 relative z-0">
              <button type="submit" disabled={saving || uploadingImage} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 font-medium transition disabled:opacity-50 shadow-sm">
                {saving ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <FiSave size={18} />}
                Save Changes
              </button>
              <button type="button" onClick={cancelEdit} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition">
                <FiX size={18} /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8 w-full">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Basic Information</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 sm:gap-x-4">
                <InfoBlock label="Full Name" value={formData.name || user?.name} />
                <InfoBlock label="Gender" value={formData.gender} capitalize />
                <InfoBlock label="Age" value={formData.age ? `${formData.age} years` : ''} />
                <InfoBlock label="Phone" value={formData.phone} />
                <InfoBlock label="District" value={getDistrictLabel(formData.district)} />
                <InfoBlock label="City" value={formData.city} />
                <InfoBlock label="Caste" value={formData.caste} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Matrimony Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 sm:gap-x-4">
                <InfoBlock label="Marital Status" value={formData.maritalStatus} />
                <InfoBlock label="Profile Posted By" value={formData.postedBy} />
                <InfoBlock label="Height" value={formData.height} />
                <InfoBlock label="Mother Tongue" value={formData.motherTongue} />
                <InfoBlock label="Education" value={formData.education} />
                <InfoBlock label="Profession" value={formData.profession} />
              </div>
            </div>

            <div className="space-y-6">
              {formData.bio && (
                <div className="w-full">
                  <h3 className="text-sm font-medium text-gray-500 mb-1.5">About Me</h3>
                  <p className="text-gray-800 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed break-words whitespace-pre-wrap">{formData.bio}</p>
                </div>
              )}
              {formData.familyDetails && (
                <div className="w-full">
                  <h3 className="text-sm font-medium text-gray-500 mb-1.5">Family Details</h3>
                  <p className="text-gray-800 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed break-words whitespace-pre-wrap">{formData.familyDetails}</p>
                </div>
              )}
              {formData.partnerPreferences && (
                <div className="w-full">
                  <h3 className="text-sm font-medium text-gray-500 mb-1.5">Partner Preferences</h3>
                  <p className="text-gray-800 bg-amber-50 border border-amber-100 p-4 rounded-xl text-sm leading-relaxed break-words whitespace-pre-wrap">{formData.partnerPreferences}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ label, value, capitalize = false }: { label: string, value: string, capitalize?: boolean }) {
  return (
    <div className="p-3 bg-gray-50 rounded-xl w-full min-w-0 overflow-hidden">
      <p className="text-[11px] text-gray-500 mb-0.5 truncate">{label}</p>
      <p className={`text-gray-800 font-medium text-sm truncate ${capitalize ? 'capitalize' : ''}`}>
        {value || 'Not Provided'}
      </p>
    </div>
  );
}

function getDistrictLabel(districtValue: string): string {
  const district = BIHAR_DISTRICTS.find(d => d.value === districtValue);
  return district?.label || districtValue;
}