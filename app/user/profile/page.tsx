'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiCamera, FiChevronDown, FiCheckCircle, FiUser, FiBookOpen, FiStar } from 'react-icons/fi';
import { BIHAR_DISTRICTS, ALL_CITIES } from '@/lib/locations';

// 🔥 CUSTOM SELECT COMPONENT 🔥
function CustomSelect({ name, value, options, onChange, placeholder = "Select option..." }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className={`relative w-full min-w-0 ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 sm:py-2 border border-gray-200 dark:border-dark-100 rounded-lg focus:ring-2 focus:ring-green-500 text-xs sm:text-sm bg-white dark:bg-dark-100 text-left flex justify-between items-center transition-shadow shadow-sm"
      >
        <span className={`truncate pr-2 ${!value ? 'text-gray-400' : 'text-gray-800 dark:text-white'}`}>
          {selectedLabel}
        </span>
        <FiChevronDown size={14} className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul className="absolute left-0 right-0 mt-1 bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-100 rounded-lg shadow-2xl max-h-48 overflow-y-auto py-1 animate-fade-in z-50">
          {options.length === 0 ? (
            <li className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">No options found</li>
          ) : (
            options.map((opt: any) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange({ target: { name, value: opt.value } });
                  setIsOpen(false);
                }}
                className={`px-3 py-2.5 text-xs sm:text-sm cursor-pointer truncate transition-colors ${
                  value === opt.value 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold border-l-2 border-green-500' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
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

  // WhatsApp Image Enlarge Modal handling
  const [showImageModal, setShowImageModal] = useState(false);
  
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
    maritalStatus: 'Unmarried',
    height: '',
    postedBy: 'Self',
    familyDetails: '',
    partnerPreferences: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowImageModal(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const loadProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) { router.push('/signin'); return; }
      
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(`/api/users/${parsedUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
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
          maritalStatus: profile.maritalStatus || 'Unmarried',
          height: profile.height || '',
          postedBy: profile.postedBy || 'Self',
          familyDetails: profile.familyDetails || '',
          partnerPreferences: profile.partnerPreferences || '',
        });
        setSelectedDistrict(profile.district || 'Saran');
      }
    } catch (error) { toast.error('Failed to load profile'); } 
    finally { setLoading(false); }
  };

  const filteredCities = selectedDistrict 
    ? ALL_CITIES.filter((city: any) => city.district === selectedDistrict)
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
    const hasPlus = val.startsWith('+');
    const digitsOnly = val.replace(/\D/g, '');
    const finalValue = hasPlus ? '+' + digitsOnly : digitsOnly;
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
    const toastId = toast.loading('Uploading...');

    try {
      if (formData.imageUrl) {
        const token = localStorage.getItem('token');
        // Delete request ko background me daal diya taaki UI slow na ho
        fetch('/api/delete-image', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ imageUrl: formData.imageUrl })
        }).catch(err => console.error("Failed to delete old image", err));
      }
      const data = new FormData();
      data.append('file', file);
      const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME || 'dhn69yomz';
      const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET || 'barkati_preset';
      data.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST', body: data
      });
      const uploadedImage = await response.json();

      if (uploadedImage.secure_url) {
        setFormData(prev => ({ ...prev, imageUrl: uploadedImage.secure_url }));
        toast.success('Uploaded! Click Save to update.', { id: toastId });
      } else { toast.error('Upload failed', { id: toastId }); }
    } catch (error) { toast.error('Upload error', { id: toastId }); } 
    finally { setUploadingImage(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to save');
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...formData }));
        toast.success('Profile updated!');
        setIsEditing(false);
      } else { toast.error(data.error || 'Failed to update'); }
    } catch (error) { toast.error('Network error'); } 
    finally { setSaving(false); }
  };

  const cancelEdit = () => { loadProfile(); setIsEditing(false); };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div></div>;
  }

  const maritalStatusOptions = [
    { value: 'Unmarried', label: 'Unmarried' },
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
    <div className="max-w-4xl mx-auto px-2 sm:px-0 pb-12">
      
      <div className="relative bg-white dark:bg-dark-200 rounded-3xl shadow-xl mb-6 border border-gray-100 dark:border-gray-700/50">
        
        {/* Cover Background */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-gray-900 rounded-t-3xl z-0">
          {formData.imageUrl ? (
            <img 
              src={formData.imageUrl} 
              alt="bg" 
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50" 
            />
          ) : (
            <div className={`absolute inset-0 w-full h-full ${formData.gender === 'male' ? 'bg-gradient-to-br from-blue-900 to-slate-900' : 'bg-gradient-to-br from-pink-900 to-slate-900'}`}></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-6 right-6 bg-green-600/20 backdrop-blur-md border border-green-500/30 text-green-300 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition flex items-center gap-2 text-sm z-30 shadow-xl"
            >
              <FiEdit2 size={16} />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </button>
          )}
        </div>

        <div className="absolute top-36 sm:top-[168px] left-5 sm:left-10 z-20">
          <div className="rounded-full p-1 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-500 shadow-xl shadow-black/30 group relative">
            <div 
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[5px] sm:border-[6px] border-white dark:border-dark-200 overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center relative ${formData.imageUrl && !isEditing ? 'cursor-pointer hover:scale-105 transition' : ''}`}
              onClick={() => !isEditing && formData.imageUrl && setShowImageModal(true)} 
              title={!isEditing && formData.imageUrl ? "Click to enlarge" : ""}
            >
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt={formData.name} className="w-full h-full object-cover aspect-square relative z-10" />
              ) : (
                formData.gender === 'male' ? <span className="text-5xl sm:text-6xl relative z-10">👨</span> : <span className="text-5xl sm:text-6xl relative z-10">👩</span>
              )}

              {isEditing && (
                <label className="absolute inset-0 z-20 cursor-pointer overflow-hidden flex items-center justify-center">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-all"></div>
                  <div className="relative z-30 flex flex-col gap-1 items-center justify-center">
                    {uploadingImage ? (
                      <div className="w-6 h-6 border-2 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FiCamera className="text-green-300 text-2xl drop-shadow-lg" />
                        <span className="text-[10px] text-green-200 font-medium">Change</span>
                      </>
                    )}
                  </div>
                </label>
              )}
            </div>
            
            {isEditing && !uploadingImage && (
               <div className="absolute bottom-1 right-1 bg-emerald-600 text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-dark-200 pointer-events-none z-30">
                 <FiEdit2 size={12} className="sm:w-3.5 sm:h-3.5" />
               </div>
            )}
          </div>
        </div>

        {/* 🔥 FIXED: Profile Content Section specifically optimized for mobile wrap 🔥 */}
        <div className="px-5 sm:px-10 pb-8 pt-16 sm:pt-20 bg-white dark:bg-dark-200 rounded-b-3xl relative z-10">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="text-[22px] sm:text-3xl font-extrabold text-gray-900 dark:text-white capitalize leading-tight">
                {formData.name || user?.name}
              </h1>
              {/* Modern Verified Badge (Text hides on mobile to save space) */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-[10px] sm:text-xs border border-green-200/50 dark:border-green-800/50 shadow-sm whitespace-nowrap">
                <FiCheckCircle size={12} /> 
                <span className="hidden sm:inline">Verified Profile</span>
                <span className="sm:hidden">Verified</span>
              </span>
            </div>
            <p className="text-sm sm:text-base text-green-600 dark:text-green-400 font-medium truncate opacity-90 mt-0.5">
              {formData.email || user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Main Info Section */}
      <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-lg p-4 sm:p-7 mb-10 border border-gray-100 dark:border-gray-700/50">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 border-b dark:border-gray-700 pb-2 flex items-center gap-2"><div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"><FiUser className="text-green-600"/></div> Basic Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
              <FormField label="Full Name *" name="name" value={formData.name} onChange={handleChange} required />
              <FormField label="Email" name="email" value={formData.email} disabled />
              
              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handlePhoneChange} placeholder="+919876543210" maxLength={15} className="w-full text-gray-900 dark:text-white px-3 py-2.5 sm:py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-white dark:bg-dark-100" />
              </div>
              
              <FormField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} min="18" max="100" />
              
              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} className="accent-green-500 w-4 h-4" />
                    <span className="text-sm text-gray-800 dark:text-gray-200">Male</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} className="accent-green-500 w-4 h-4" />
                    <span className="text-sm text-gray-800 dark:text-gray-200">Female</span>
                  </label>
                </div>
              </div>

              <FormField label="Caste" name="caste" value={formData.caste} onChange={handleChange} />
              
              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">District</label>
                <CustomSelect name="district" value={formData.district} options={BIHAR_DISTRICTS} onChange={handleChange} />
              </div>

              <div className="min-w-0 w-full">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">City</label>
                <CustomSelect name="city" value={formData.city} options={filteredCities} onChange={handleChange} />
              </div>
              
              <FormField label="Profession" name="profession" value={formData.profession} onChange={handleChange} />
              <FormField label="Education" name="education" value={formData.education} onChange={handleChange} />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b dark:border-gray-700 pb-2 flex items-center gap-2"><div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"><FiBookOpen className="text-green-600"/></div> Matrimony Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
              <div className="min-w-0 w-full"><label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Marital Status</label><CustomSelect name="maritalStatus" value={formData.maritalStatus} options={maritalStatusOptions} onChange={handleChange} /></div>
              <div className="min-w-0 w-full"><label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Profile Posted By</label><CustomSelect name="postedBy" value={formData.postedBy} options={postedByOptions} onChange={handleChange} /></div>
              <FormField label="Height" name="height" value={formData.height} onChange={handleChange} />
              <FormField label="Mother Tongue" name="motherTongue" value={formData.motherTongue} onChange={handleChange} />
            </div>

            <div className="space-y-4 sm:space-y-6 pt-3 w-full">
              <div className="min-w-0 w-full"><label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">About Me (Bio)</label><textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full text-gray-900 dark:text-white px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 resize-none text-sm transition bg-white dark:bg-dark-100 leading-relaxed" /></div>
              <div className="min-w-0 w-full"><label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Family Details</label><textarea name="familyDetails" value={formData.familyDetails} onChange={handleChange} rows={4} className="w-full text-gray-900 dark:text-white px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 resize-none text-sm transition bg-white dark:bg-dark-100 leading-relaxed" /></div>
              <div className="min-w-0 w-full"><label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5"><FiStar className="text-amber-500"/> Partner Preferences</label><textarea name="partnerPreferences" value={formData.partnerPreferences} onChange={handleChange} rows={4} className="w-full text-gray-900 dark:text-white px-3 py-2.5 border border-amber-200 dark:border-amber-900/40 rounded-xl focus:ring-2 focus:ring-green-500 resize-none text-sm transition bg-white dark:bg-dark-100 leading-relaxed" /></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100 dark:border-gray-700 relative z-0">
              <button type="submit" disabled={saving || uploadingImage} className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 font-bold transition disabled:opacity-60 shadow-lg shadow-green-500/20 active:scale-95 hover:scale-105">
                {saving ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <FiSave size={18} />}
                Save My Changes ✓
              </button>
              <button type="button" onClick={cancelEdit} className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 font-bold transition">
                <FiX size={18} /> Cancel & Revert
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-10 w-full">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-6 flex items-center gap-2"><div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"><FiUser className="text-green-600"/></div> Basic Information</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-2 sm:gap-x-4">
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-6 flex items-center gap-2"><div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"><FiBookOpen className="text-green-600"/></div> Matrimony Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-2 sm:gap-x-4">
                <InfoBlock label="Marital Status" value={formData.maritalStatus} />
                <InfoBlock label="Profile Posted By" value={formData.postedBy} />
                <InfoBlock label="Height" value={formData.height} />
                <InfoBlock label="Mother Tongue" value={formData.motherTongue} />
                <InfoBlock label="Education" value={formData.education} />
                <InfoBlock label="Profession" value={formData.profession} />
              </div>
            </div>

            <div className="space-y-6">
              {formData.bio && <InfoArea label="About Me" value={formData.bio} />}
              {formData.familyDetails && <InfoArea label="Family Details" value={formData.familyDetails} />}
              {formData.partnerPreferences && <InfoArea label="Partner Preferences" value={formData.partnerPreferences} color="amber" />}
            </div>
          </div>
        )}
      </div>

      {/* 🔥 WhatsApp Image Enlarge Modal (Lightbox) 🔥 */}
      {showImageModal && formData.imageUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <button 
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2.5 rounded-full z-[110]"
          >
            <FiX size={28} />
          </button>
          
          <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={formData.imageUrl} 
              alt={formData.name} 
              className="rounded-lg shadow-2xl object-contain max-w-full max-h-[90vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ label, value, capitalize = false }: { label: string, value: string, capitalize?: boolean }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-dark-100 rounded-xl w-full min-w-0 overflow-hidden border border-gray-100 dark:border-gray-700/50">
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5 truncate font-bold uppercase tracking-wide">{label}</p>
      <p className={`text-gray-900 dark:text-white font-semibold text-sm truncate ${capitalize ? 'capitalize' : ''}`}>
        {value || 'Not Provided'}
      </p>
    </div>
  );
}

function InfoArea({ label, value, color='green' }: { label: string, value: string, color?: string }) {
  const styles = color === 'amber' 
    ? { icon: <FiStar className="text-amber-500"/>, bg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-300', border: 'border-amber-100 dark:border-amber-900/40' }
    : { icon: <FiUser className="text-green-600"/>, bg: 'bg-gray-50 dark:bg-dark-100 text-gray-800 dark:text-gray-300', border: 'border-gray-100 dark:border-gray-700/50' };

  return (
    <div className={`p-6 sm:p-7 rounded-3xl w-full border ${styles.bg} ${styles.border}`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${styles.bg.includes('amber') ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
        {styles.icon} {label}
      </h3>
      <p className="leading-relaxed text-base whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function FormField({ label, ...props }: any) {
  return (
    <div className="min-w-0 w-full">
      <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input 
        type="text" 
        className="w-full text-gray-900 dark:text-white px-3 py-2.5 sm:py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-white dark:bg-dark-100 transition disabled:bg-gray-50 dark:disabled:bg-dark-100/50 dark:disabled:text-gray-500 disabled:text-gray-500" 
        {...props} 
      />
    </div>
  );
}

function getDistrictLabel(districtValue: string): string {
  const district = BIHAR_DISTRICTS.find(d => d.value === districtValue);
  return district?.label || districtValue;
}