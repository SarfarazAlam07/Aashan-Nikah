// app/admin/muftis/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiTrash2, FiStar, FiMail, FiPhone, FiMapPin, FiUser, FiEdit2, FiX, FiSave, FiRefreshCw } from 'react-icons/fi';
import AddMuftiModal from '@/components/admin/AddMuftiModal';
import toast from 'react-hot-toast';

interface Mufti {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  qualification: string;
  experience: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  approvedRequests?: number;
}

export default function MuftisPage() {
  const router = useRouter();
  const [muftis, setMuftis] = useState<Mufti[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editingMufti, setEditingMufti] = useState<Mufti | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    qualification: '',
    experience: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          router.push('/signin');
          return;
        }
        
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        if (parsedUser.role !== 'SUPER_ADMIN') {
          toast.error('Access Denied');
          router.push('/admin/dashboard');
          return;
        }
        
        await fetchMuftis();
        
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/signin');
      }
    };
    
    checkAuth();
  }, [router]);

  // Fetch real muftis from database
  const fetchMuftis = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/muftis', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMuftis(data.muftis);
      } else {
        toast.error(data.error || 'Failed to load muftis');
      }
    } catch (error) {
      console.error('Error fetching muftis:', error);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Delete mufti
  const handleDeleteMufti = async (id: string, name: string) => {
    if (!confirm(`Delete Mufti ${name}? This action cannot be undone.`)) {
      return;
    }
    
    const toastId = toast.loading('Deleting mufti...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/muftis?muftiId=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Mufti deleted successfully', { id: toastId });
        await fetchMuftis(); // Refresh list
      } else {
        toast.error(data.error || 'Failed to delete', { id: toastId });
      }
    } catch (error) {
      console.error('Error deleting mufti:', error);
      toast.error('Network error', { id: toastId });
    }
  };

  // Edit mufti
  const handleEditClick = (mufti: Mufti) => {
    setEditingMufti(mufti);
    setEditFormData({
      name: mufti.name,
      email: mufti.email,
      phone: mufti.phone || '',
      city: mufti.city || '',
      qualification: mufti.qualification || '',
      experience: mufti.experience || ''
    });
  };

  const handleEditSubmit = async (id: string) => {
  if (!editFormData.name || !editFormData.email) {
    toast.error('Name and email are required');
    return;
  }

  const toastId = toast.loading('Updating mufti...');
  
  try {
    const token = localStorage.getItem('token');
    // ✅ Send all fields including qualification and experience
    const response = await fetch(`/api/admin/muftis?muftiId=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone || '',
        city: editFormData.city || '',
        qualification: editFormData.qualification || '',
        experience: editFormData.experience || ''
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      toast.success('Mufti updated successfully', { id: toastId });
      setEditingMufti(null);
      await fetchMuftis();
    } else {
      toast.error(data.error || 'Failed to update', { id: toastId });
    }
  } catch (error) {
    console.error('Error updating mufti:', error);
    toast.error('Network error', { id: toastId });
  }
};

  const handleEditCancel = () => {
    setEditingMufti(null);
  };

  const handleMuftiAdded = () => {
    fetchMuftis();
  };

  // Calculate stats
  const totalMuftis = muftis.length;
  const activeMuftis = muftis.filter(m => m.isVerified).length;
  const totalApproved = muftis.reduce((sum, m) => sum + (m.approvedRequests || 0), 0);
  const avgApproved = totalMuftis > 0 ? Math.round(totalApproved / totalMuftis) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-3 text-white text-sm">Loading muftis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Manage Muftis</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Add, edit or remove religious scholars</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchMuftis}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition text-sm"
          >
            <FiRefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition text-sm"
          >
            <FiPlus size={16} />
            <span>Add Mufti</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Muftis" value={totalMuftis} color="blue" />
        <StatCard label="Active" value={activeMuftis} color="green" />
        <StatCard label="Total Approved" value={totalApproved} color="purple" />
        <StatCard label="Avg per Mufti" value={avgApproved} color="yellow" />
      </div>

      {/* Muftis List */}
      {muftis.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiStar className="text-2xl text-gray-500" />
          </div>
          <h3 className="text-white font-semibold text-base mb-1">No Muftis Added</h3>
          <p className="text-gray-400 text-xs mb-4">Click the button above to add your first Mufti</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm"
          >
            + Add New Mufti
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {muftis.map((mufti) => (
            <div key={mufti._id} className="bg-gray-800 rounded-xl p-4">
              {/* Edit Mode */}
              {editingMufti?._id === mufti._id ? (
                // Edit Form
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <div>
    <label className="text-gray-400 text-xs mb-1 block">Name *</label>
    <input
      type="text"
      value={editFormData.name}
      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
    />
  </div>
  <div>
    <label className="text-gray-400 text-xs mb-1 block">Email *</label>
    <input
      type="email"
      value={editFormData.email}
      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
    />
  </div>
  <div>
    <label className="text-gray-400 text-xs mb-1 block">Phone</label>
    <input
      type="tel"
      value={editFormData.phone}
      onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
    />
  </div>
  <div>
    <label className="text-gray-400 text-xs mb-1 block">City</label>
    <input
      type="text"
      value={editFormData.city}
      onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
    />
  </div>
  <div>
    <label className="text-gray-400 text-xs mb-1 block">Qualification</label>
    <input
      type="text"
      value={editFormData.qualification}
      onChange={(e) => setEditFormData({...editFormData, qualification: e.target.value})}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
    />
  </div>
  <div>
    <label className="text-gray-400 text-xs mb-1 block">Experience</label>
    <input
      type="text"
      value={editFormData.experience}
      onChange={(e) => setEditFormData({...editFormData, experience: e.target.value})}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
    />
  </div>
</div>
              ) : (
                // View Mode
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                        <FiStar className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-base">{mufti.name}</h3>
                        <p className="text-gray-400 text-xs">{mufti.experience || 'N/A'} experience</p>
                        {mufti.isVerified ? (
                          <span className="inline-block text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full mt-1">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-block text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full mt-1">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditClick(mufti)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                        title="Edit Mufti"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteMufti(mufti._id, mufti.name)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        title="Delete Mufti"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Details Grid */}
<div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700">
  <div>
    <p className="text-gray-500 text-[10px] mb-1">Email</p>
    <p className="text-white text-xs truncate">{mufti.email}</p>
  </div>
  <div>
    <p className="text-gray-500 text-[10px] mb-1">Phone</p>
    <p className="text-white text-xs">{mufti.phone || 'N/A'}</p>
  </div>
  <div>
    <p className="text-gray-500 text-[10px] mb-1">City</p>
    <p className="text-white text-xs">{mufti.city || 'N/A'}</p>
  </div>
  <div>
    <p className="text-gray-500 text-[10px] mb-1">Qualification</p>
    <p className="text-white text-xs truncate">{mufti.qualification || 'N/A'}</p>
  </div>
  <div>
    <p className="text-gray-500 text-[10px] mb-1">Experience</p>
    <p className="text-white text-xs">{mufti.experience || 'N/A'}</p>
  </div>
  <div>
    <p className="text-gray-500 text-[10px] mb-1">Approved Requests</p>
    <p className="text-green-400 text-sm font-bold">{mufti.approvedRequests || 0}</p>
  </div>
  <div>
    <p className="text-gray-500 text-[10px] mb-1">Joined</p>
    <p className="text-gray-400 text-xs">{new Date(mufti.createdAt).toLocaleDateString()}</p>
  </div>
</div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Mufti Modal */}
      <AddMuftiModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleMuftiAdded}
      />
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: any = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    yellow: 'text-yellow-400'
  };

  return (
    <div className="bg-gray-800 rounded-xl p-3">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className={`text-xl font-bold ${colors[color]} mt-1`}>{value}</p>
    </div>
  );
}