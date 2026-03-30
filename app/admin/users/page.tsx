'use client';

import { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiCheckCircle, 
  FiXCircle, 
  FiTrash2, 
  FiEye,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  gender: string;
  city?: string;
  district: string;
  caste?: string;
  profession?: string;
  imageUrl?: string;
  isVerified: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
    toast.success('Users refreshed');
  };

  const handleVerify = async (userId: string) => {
    toast.loading('Verifying...', { id: 'verify' });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users?userId=${userId}&action=verify`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User verified!', { id: 'verify' });
        fetchUsers();
      } else {
        toast.error('Failed to verify', { id: 'verify' });
      }
    } catch (error) {
      toast.error('Error', { id: 'verify' });
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;
    
    toast.loading('Deleting...', { id: 'delete' });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users?userId=${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User deleted!', { id: 'delete' });
        fetchUsers();
      } else {
        toast.error('Failed to delete', { id: 'delete' });
      }
    } catch (error) {
      toast.error('Error', { id: 'delete' });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                          user.email.toLowerCase().includes(search.toLowerCase()) ||
                          (user.city && user.city.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' ? true : 
                          filterStatus === 'verified' ? user.isVerified : !user.isVerified;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: users.length,
    verified: users.filter(u => u.isVerified).length,
    pending: users.filter(u => !u.isVerified).length,
    male: users.filter(u => u.gender === 'male').length,
    female: users.filter(u => u.gender === 'female').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Loading users...</p>
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
              <FiUsers className="text-white text-sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">User Management</h1>
          </div>
          <p className="text-gray-400 text-xs">Manage and verify user profiles</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg hover:border-amber-500/50 transition text-sm"
        >
          <FiRefreshCw size={12} className={`text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-gray-300">Refresh</span>
        </button>
      </div>

      {/* Stats Cards - Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          <StatChip label="Total" value={stats.total} color="blue" />
          <StatChip label="Verified" value={stats.verified} color="green" />
          <StatChip label="Pending" value={stats.pending} color="amber" />
          <StatChip label="Male" value={stats.male} color="blue" />
          <StatChip label="Female" value={stats.female} color="pink" />
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-300 text-sm flex items-center gap-1"
          >
            <FiChevronDown size={14} className={`transition ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
            Filter
          </button>
        </div>
        
        {/* Mobile Filters Dropdown */}
        {mobileFiltersOpen && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {['all', 'verified', 'pending'].map(status => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setMobileFiltersOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs transition ${
                  filterStatus === status
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-700 text-gray-300'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Users Cards - Mobile Friendly */}
      {filteredUsers.length === 0 ? (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 text-center">
          <FiUsers className="text-3xl text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const isExpanded = expandedUser === user._id;
            
            return (
              <div key={user._id} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                {/* Card Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Avatar */}
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-sm overflow-hidden flex-shrink-0">
                        {user.imageUrl ? (
                          <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover aspect-square" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      
                      {/* Basic Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-white font-semibold text-base">{user.name}</h3>
                          {user.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-400">
                              <FiCheckCircle size={10} /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400">
                              <FiXCircle size={10} /> Pending
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-gray-500 text-xs">{user.age || '?'} yrs</span>
                          <span className="text-gray-600 text-xs">•</span>
                          <span className="text-gray-500 text-xs">{user.city || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expand Button */}
                    <button
                      onClick={() => setExpandedUser(isExpanded ? null : user._id)}
                      className="p-1.5 rounded-lg bg-slate-700/50 text-gray-400"
                    >
                      {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </button>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-700 px-4 py-3 space-y-2 bg-slate-800/30">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Phone</p>
                        <p className="text-white text-sm">{user.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Gender</p>
                        <p className="text-white text-sm capitalize">{user.gender}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Caste</p>
                        <p className="text-white text-sm">{user.caste || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Profession</p>
                        <p className="text-white text-sm">{user.profession || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">District</p>
                        <p className="text-white text-sm">{user.district}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Joined</p>
                        <p className="text-white text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-slate-700">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-700/50 rounded-lg text-blue-400 text-sm hover:bg-slate-700 transition"
                      >
                        <FiEye size={14} /> View
                      </button>
                      {!user.isVerified && (
                        <button
                          onClick={() => handleVerify(user._id)}
                          className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-700/50 rounded-lg text-green-400 text-sm hover:bg-slate-700 transition"
                        >
                          <FiCheckCircle size={14} /> Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-700/50 rounded-lg text-red-400 text-sm hover:bg-slate-700 transition"
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <UserModal user={selectedUser} onClose={() => setShowUserModal(false)} />
      )}
    </div>
  );
}

// Stat Chip for Mobile
function StatChip({ label, value, color }: any) {
  const colors: any = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    amber: 'bg-amber-500/20 text-amber-400',
    pink: 'bg-pink-500/20 text-pink-400'
  };

  return (
    <div className={`flex-shrink-0 px-3 py-1.5 rounded-full ${colors[color]}`}>
      <span className="text-xs font-medium">{label}: {value}</span>
    </div>
  );
}

// User Modal Component
function UserModal({ user, onClose, onVerify }: { user: User; onClose: () => void; onVerify: (id: string) => void }) {
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);
  
  const quickReplies = [
    "Please upload a clear profile photo.",
    "Please complete your bio, caste and qualification details.",
    "Your profession details are incomplete."
  ];

  const handleSendMessage = async () => {
    if (!msg.trim()) return toast.error('Message cannot be empty');
    setSending(true);
    try {
      const res = await fetch('/api/admin/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ userId: user._id, message: msg })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Message sent to user!');
        setMsg('');
      } else throw new Error();
    } catch { toast.error('Failed to send message'); } 
    finally { setSending(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl border border-slate-600 bg-slate-700 overflow-hidden">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">{user.name.charAt(0)}</div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${user.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {user.isVerified ? '✓ Verified' : '⏳ Pending'}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-700/50 hover:bg-slate-600 rounded-lg text-white"><FiX size={20}/></button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <ModalDetail icon={<FiMail />} label="Email" value={user.email} />
            <ModalDetail icon={<FiPhone />} label="Phone" value={user.phone || 'N/A'} />
            <ModalDetail label="Age" value={user.age ? `${user.age} yrs` : 'N/A'} />
            <ModalDetail label="Gender" value={user.gender} />
            <ModalDetail icon={<FiMapPin />} label="Location" value={`${user.city || 'N/A'}, ${user.district}`} />
            <ModalDetail label="Caste" value={user.caste || 'N/A'} />
          </div>

          <div className="bg-slate-700/30 rounded-xl p-4 mb-6 border border-slate-700">
            <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2"><FiMail /> Direct Message (Quick Notification)</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {quickReplies.map((reply, i) => (
                <button key={i} onClick={() => setMsg(reply)} className="text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 px-2 py-1 rounded transition">
                  {reply}
                </button>
              ))}
            </div>
            <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type custom message..." rows={2} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-sm text-white mb-2" />
            <button onClick={handleSendMessage} disabled={sending || !msg} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
              {sending ? 'Sending...' : 'Send to User'}
            </button>
          </div>
          
          <div className="flex gap-3">
            {!user.isVerified && (
              <button onClick={() => { onVerify(user._id); onClose(); }} className="flex-1 py-3 bg-green-600 text-white rounded-xl">✓ Approve & Verify</button>
            )}
            <button onClick={onClose} className="flex-1 py-3 bg-slate-700 text-white rounded-xl">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalDetail({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-2 p-2 bg-slate-700/30 rounded-lg">
      {icon && <div className="text-amber-400 mt-0.5 text-sm">{icon}</div>}
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-white text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}