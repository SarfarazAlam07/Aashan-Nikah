'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiPlus, 
  FiTrash2, 
  FiStar, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiUser, 
  FiEdit2, 
  FiX, 
  FiSave, 
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiBookOpen,
  FiAward,
  FiCalendar
} from 'react-icons/fi';
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
  const [expandedMufti, setExpandedMufti] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const fetchMuftis = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/muftis', {
        headers: { 'Authorization': `Bearer ${token}` }
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMuftis();
    setIsRefreshing(false);
    toast.success('Muftis refreshed');
  };

  const handleDeleteMufti = async (id: string, name: string) => {
    if (!confirm(`Delete Mufti ${name}? This action cannot be undone.`)) {
      return;
    }
    
    const toastId = toast.loading('Deleting mufti...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/muftis?muftiId=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Mufti deleted successfully', { id: toastId });
        await fetchMuftis();
      } else {
        toast.error(data.error || 'Failed to delete', { id: toastId });
      }
    } catch (error) {
      console.error('Error deleting mufti:', error);
      toast.error('Network error', { id: toastId });
    }
  };

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

  const totalMuftis = muftis.length;
  const activeMuftis = muftis.filter(m => m.isVerified).length;
  const totalApproved = muftis.reduce((sum, m) => sum + (m.approvedRequests || 0), 0);
  const avgApproved = totalMuftis > 0 ? Math.round(totalApproved / totalMuftis) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Loading muftis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
              <FiStar className="text-white text-sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Manage Muftis</h1>
          </div>
          <p className="text-gray-400 text-xs">Add, edit or remove religious scholars</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg hover:border-amber-500/50 transition text-sm"
          >
            <FiRefreshCw size={12} className={`text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-gray-300">Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition text-sm"
          >
            <FiPlus size={12} />
            <span>Add Mufti</span>
          </button>
        </div>
      </div>

      {/* Stats - Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          <StatChip label="Total Muftis" value={totalMuftis} color="blue" />
          <StatChip label="Active" value={activeMuftis} color="green" />
          <StatChip label="Total Approved" value={totalApproved} color="purple" />
          <StatChip label="Avg per Mufti" value={avgApproved} color="amber" />
        </div>
      </div>

      {/* Muftis List - Mobile Card View */}
      {muftis.length === 0 ? (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 text-center">
          <div className="w-14 h-14 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiStar className="text-2xl text-gray-500" />
          </div>
          <h3 className="text-white font-semibold text-base mb-1">No Muftis Added</h3>
          <p className="text-gray-400 text-xs mb-4">Click the button above to add your first Mufti</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm"
          >
            + Add New Mufti
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {muftis.map((mufti) => {
            const isExpanded = expandedMufti === mufti._id;
            const isEditing = editingMufti?._id === mufti._id;
            
            return (
              <div key={mufti._id} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                {isEditing ? (
                  // Edit Mode
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold text-base">Edit Mufti</h3>
                      <button onClick={handleEditCancel} className="text-gray-400 hover:text-white">
                        <FiX size={18} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Name *"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email *"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={editFormData.city}
                        onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Qualification"
                        value={editFormData.qualification}
                        onChange={(e) => setEditFormData({...editFormData, qualification: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Experience"
                        value={editFormData.experience}
                        onChange={(e) => setEditFormData({...editFormData, experience: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                      />
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleEditSubmit(mufti._id)}
                          className="flex-1 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
                        >
                          <FiSave className="inline mr-1" size={14} /> Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="flex-1 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
                            <FiStar className="text-white text-lg" />
                          </div>
                          
                          {/* Basic Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-white font-semibold text-base">{mufti.name}</h3>
                              {mufti.isVerified ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-400">
                                  ✓ Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400">
                                  ⏳ Pending
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs mt-0.5">{mufti.experience || 'N/A'} experience</p>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditClick(mufti)}
                            className="p-1.5 rounded-lg bg-slate-700/50 text-blue-400 hover:bg-slate-700 transition"
                            title="Edit"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteMufti(mufti._id, mufti.name)}
                            className="p-1.5 rounded-lg bg-slate-700/50 text-red-400 hover:bg-slate-700 transition"
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                          </button>
                          <button
                            onClick={() => setExpandedMufti(isExpanded ? null : mufti._id)}
                            className="p-1.5 rounded-lg bg-slate-700/50 text-gray-400 hover:bg-slate-700 transition"
                          >
                            {isExpanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-slate-700 px-4 py-3 space-y-2 bg-slate-800/30">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs flex items-center gap-1"><FiMail size={12} /> Email</p>
                            <p className="text-white text-sm truncate">{mufti.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs flex items-center gap-1"><FiPhone size={12} /> Phone</p>
                            <p className="text-white text-sm">{mufti.phone || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs flex items-center gap-1"><FiMapPin size={12} /> City</p>
                            <p className="text-white text-sm">{mufti.city || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs flex items-center gap-1"><FiBookOpen size={12} /> Qualification</p>
                            <p className="text-white text-sm truncate">{mufti.qualification || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs flex items-center gap-1"><FiAward size={12} /> Experience</p>
                            <p className="text-white text-sm">{mufti.experience || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs flex items-center gap-1"><FiStar size={12} /> Approved</p>
                            <p className="text-green-400 font-bold text-sm">{mufti.approvedRequests || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs flex items-center gap-1"><FiCalendar size={12} /> Joined</p>
                            <p className="text-gray-400 text-xs">{new Date(mufti.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
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

// Stat Chip for Mobile
function StatChip({ label, value, color }: any) {
  const colors: any = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/20 text-amber-400'
  };

  return (
    <div className={`flex-shrink-0 px-3 py-1.5 rounded-full ${colors[color]}`}>
      <span className="text-xs font-medium">{label}: {value}</span>
    </div>
  );
}