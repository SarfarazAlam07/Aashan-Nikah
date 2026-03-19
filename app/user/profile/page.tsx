// app/user/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiGraduationCap, FiEdit2, FiSave } from 'react-icons/fi';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
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
    setFormData(prev => ({ ...prev, ...parsed }));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    alert('Profile updated!');
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-32 relative">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-4 right-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition flex items-center gap-2"
          >
            {isEditing ? <FiSave /> : <FiEdit2 />}
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
        
        <div className="px-6 pb-6">
          <div className="flex items-center -mt-12 mb-4">
            <div className="bg-white rounded-full p-1 shadow-xl">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-4xl">
                {user.gender === 'male' ? '👨' : '👩'}
              </div>
            </div>
            <div className="ml-4 mt-8">
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-emerald-600">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <InputField name="name" label="Full Name" value={formData.name} onChange={handleChange} icon={<FiUser />} />
              <InputField name="email" label="Email" value={formData.email} onChange={handleChange} icon={<FiMail />} />
              <InputField name="phone" label="Phone" value={formData.phone} onChange={handleChange} icon={<FiPhone />} />
              <InputField name="age" label="Age" value={formData.age} onChange={handleChange} type="number" />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <InputField name="caste" label="Caste" value={formData.caste} onChange={handleChange} />
              <InputField name="city" label="City" value={formData.city} onChange={handleChange} icon={<FiMapPin />} />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Saran">Saran (Chhapra)</option>
                  <option value="Patna">Patna</option>
                  <option value="Siwan">Siwan</option>
                  <option value="Gopalganj">Gopalganj</option>
                </select>
              </div>

              <InputField name="profession" label="Profession" value={formData.profession} onChange={handleChange} icon={<FiBriefcase />} />
              <InputField name="education" label="Education" value={formData.education} onChange={handleChange} icon={<FiGraduationCap />} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <InfoItem icon={<FiUser />} label="Name" value={user.name} />
              <InfoItem icon={<FiMail />} label="Email" value={user.email} />
              <InfoItem icon={<FiPhone />} label="Phone" value={formData.phone || 'Not provided'} />
              <InfoItem label="Age" value={formData.age ? `${formData.age} years` : 'Not provided'} />
              <InfoItem label="Gender" value={formData.gender || 'Not provided'} />
              <InfoItem label="Caste" value={formData.caste || 'Not provided'} />
              <InfoItem icon={<FiMapPin />} label="Location" value={`${formData.city || ''}, ${formData.district}`} />
              <InfoItem icon={<FiBriefcase />} label="Profession" value={formData.profession || 'Not provided'} />
              <InfoItem icon={<FiGraduationCap />} label="Education" value={formData.education || 'Not provided'} />
            </div>
            
            {formData.bio && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">About</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{formData.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
function InputField({ name, label, value, onChange, type = 'text', icon }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500`}
        />
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      {icon && <div className="text-emerald-600 mt-1">{icon}</div>}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}