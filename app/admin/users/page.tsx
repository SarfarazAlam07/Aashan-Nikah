// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  FiSearch, FiCheckCircle, FiXCircle, FiTrash2, FiEye,
  FiUser, FiMail, FiPhone, FiMapPin, FiUsers,
  FiRefreshCw, FiChevronDown, FiChevronUp, FiX, FiKey, FiCopy,FiCalendar ,FiClock
} from 'react-icons/fi';
import { FaGraduationCap, FaBriefcase, FaVenusMars, FaHeart, FaMosque, FaUsers } from 'react-icons/fa';
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
  education?: string;
  imageUrl?: string;
  isVerified: boolean;
  createdAt: string;
  motherTongue?: string;
  maritalStatus?: string;
  height?: string;
  postedBy?: string;
  familyDetails?: string;
  partnerPreferences?: string;
  bio?: string;
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
  const [resetModalData, setResetModalData] = useState<{name: string, password: string} | null>(null);

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
    const toastId = toast.loading('Verifying...');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users?userId=${userId}&action=verify`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User verified!', { id: toastId });
        fetchUsers();
      } else {
        toast.error('Failed to verify', { id: toastId });
      }
    } catch (error) {
      toast.error('Error', { id: toastId });
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;
    
    const toastId = toast.loading('Deleting...');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users?userId=${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User deleted!', { id: toastId });
        fetchUsers();
      } else {
        toast.error('Failed to delete', { id: toastId });
      }
    } catch (error) {
      toast.error('Error', { id: toastId });
    }
  };

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$*";
    let pass = "";
    for(let i=0; i<8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleResetPassword = async (user: User) => {
    if (!confirm(`Are you sure you want to generate a new random password for ${user.name}?`)) return;

    const newPassword = generateRandomPassword();
    const toastId = toast.loading('Resetting password...');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users?userId=${user._id}&action=reset_password`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Password reset successfully!', { id: toastId });
        setResetModalData({ name: user.name, password: newPassword });
      } else {
        toast.error(data.error || 'Failed to reset password', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Password copied to clipboard! 📋');
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

      {/* Stats Cards */}
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

      {/* Users Cards */}
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
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-sm overflow-hidden flex-shrink-0">
                        {user.imageUrl ? (
                          <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover aspect-square" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      
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
                    
                    <button
                      onClick={() => setExpandedUser(isExpanded ? null : user._id)}
                      className="p-1.5 rounded-lg bg-slate-700/50 text-gray-400"
                    >
                      {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </button>
                  </div>
                </div>
                
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
                    
                    <div className="flex gap-2 pt-3 border-t border-slate-700 mt-3 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-700/50 rounded-lg text-blue-400 text-xs sm:text-sm hover:bg-slate-700 transition"
                      >
                        <FiEye size={14} /> View All
                      </button>
                      
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-yellow-500/10 rounded-lg text-yellow-500 text-xs sm:text-sm hover:bg-yellow-500/20 transition"
                        title="Generate a new random password"
                      >
                        <FiKey size={14} /> Reset Pass
                      </button>

                      {!user.isVerified && (
                        <button
                          onClick={() => handleVerify(user._id)}
                          className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-700/50 rounded-lg text-green-400 text-xs sm:text-sm hover:bg-slate-700 transition"
                        >
                          <FiCheckCircle size={14} /> Verify
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-700/50 rounded-lg text-red-400 text-xs sm:text-sm hover:bg-slate-700 transition"
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

      {/* Password Generated Modal */}
      {resetModalData && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-800 rounded-2xl max-w-sm w-full border border-slate-600 shadow-2xl p-6 text-center animate-scale-in">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-green-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Password Reset!</h3>
            <p className="text-gray-400 text-sm mb-6">
              New password for <span className="text-white font-medium">{resetModalData.name}</span>:
            </p>
            
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-6 flex items-center justify-between group">
              <code className="text-amber-400 text-lg tracking-widest font-bold">
                {resetModalData.password}
              </code>
              <button 
                onClick={() => copyToClipboard(resetModalData.password)}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition group-hover:scale-110"
                title="Copy to clipboard"
              >
                <FiCopy size={18} />
              </button>
            </div>

            <button
              onClick={() => setResetModalData(null)}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* User Full Profile Modal */}
      {showUserModal && selectedUser && (
        <UserModal 
          user={selectedUser} 
          onClose={() => setShowUserModal(false)} 
          onVerify={handleVerify}
        />
      )}
    </div>
  );
}

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

// 🔥 UPGRADED USER MODAL (Full Profile Details) 🔥
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col animate-fade-in">
        
        {/* Modal Header (Sticky) */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800/90 z-10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FiUser className="text-amber-500" /> User Profile
          </h3>
          <button onClick={onClose} className="p-2 bg-slate-700/50 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-gray-400 transition">
            <FiX size={20}/>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 custom-scrollbar">
          
          {/* Header Profile Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-slate-700 bg-slate-700 overflow-hidden shadow-lg flex-shrink-0">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold bg-gradient-to-br from-amber-500 to-amber-600">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 mt-2 sm:mt-0">
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-sm text-gray-400 mb-2">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${user.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {user.isVerified ? <FiCheckCircle size={12}/> : <FiClock size={12}/>}
                  {user.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
                <span className="text-xs px-2.5 py-1 bg-slate-700 text-gray-300 rounded-full flex items-center gap-1">
                  <FiCalendar size={12}/> Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <InfoBox label="Age" value={user.age ? `${user.age} yrs` : '-'} icon={<FiUser />} />
            <InfoBox label="Gender" value={user.gender} icon={<FaVenusMars />} capitalize />
            <InfoBox label="Height" value={user.height || '-'} icon={<FiUser />} />
            <InfoBox label="Marital Status" value={user.maritalStatus || '-'} icon={<FaHeart />} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact & Location */}
            <div className="bg-slate-700/20 rounded-xl p-4 border border-slate-700">
              <h4 className="text-amber-400 text-sm font-semibold mb-3 flex items-center gap-2"><FiMapPin /> Contact & Location</h4>
              <div className="space-y-2">
                <DetailRow label="Phone" value={user.phone} />
                <DetailRow label="City" value={user.city} />
                <DetailRow label="District" value={user.district} />
              </div>
            </div>

            {/* Background */}
            <div className="bg-slate-700/20 rounded-xl p-4 border border-slate-700">
              <h4 className="text-amber-400 text-sm font-semibold mb-3 flex items-center gap-2"><FaMosque /> Background</h4>
              <div className="space-y-2">
                <DetailRow label="Caste" value={user.caste} />
                <DetailRow label="Mother Tongue" value={user.motherTongue} />
                <DetailRow label="Profile By" value={user.postedBy} />
              </div>
            </div>
            
            {/* Career & Education */}
            <div className="bg-slate-700/20 rounded-xl p-4 border border-slate-700 sm:col-span-2">
              <h4 className="text-amber-400 text-sm font-semibold mb-3 flex items-center gap-2"><FaBriefcase /> Career & Education</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow label="Education" value={user.education} />
                <DetailRow label="Profession" value={user.profession} />
              </div>
            </div>
          </div>

          {/* Long Text Sections */}
          <div className="space-y-4">
            {user.bio && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">About (Bio)</h4>
                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{user.bio}</p>
              </div>
            )}
            
            {user.familyDetails && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2"><FaUsers /> Family Details</h4>
                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{user.familyDetails}</p>
              </div>
            )}

            {user.partnerPreferences && (
              <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/20">
                <h4 className="text-sm font-semibold text-amber-400 mb-2">Partner Preferences</h4>
                <p className="text-sm text-amber-200/70 leading-relaxed whitespace-pre-wrap">{user.partnerPreferences}</p>
              </div>
            )}
          </div>

          {/* Message Section */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 mt-6">
            <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2"><FiMail /> Send Admin Message</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {quickReplies.map((reply, i) => (
                <button key={i} onClick={() => setMsg(reply)} className="text-xs bg-slate-800 hover:bg-slate-700 text-gray-400 px-2 py-1.5 rounded-lg border border-slate-700 transition">
                  {reply}
                </button>
              ))}
            </div>
            <textarea 
              value={msg} 
              onChange={(e) => setMsg(e.target.value)} 
              placeholder="Type custom notification to send to user..." 
              rows={2} 
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm text-white mb-2 resize-none focus:ring-1 focus:ring-blue-500 focus:outline-none" 
            />
            <button 
              onClick={handleSendMessage} 
              disabled={sending || !msg} 
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition font-medium text-sm"
            >
              {sending ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </div>

        {/* Modal Footer (Sticky) */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/90 flex gap-3 z-10">
          {!user.isVerified && (
            <button onClick={() => { onVerify(user._id); onClose(); }} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 transition text-white rounded-xl font-medium text-sm shadow-sm flex items-center justify-center gap-2">
              <FiCheckCircle size={16} /> Approve & Verify
            </button>
          )}
          <button onClick={onClose} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 transition text-white rounded-xl font-medium text-sm">
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// Small UI Helpers for the Modal
function InfoBox({ label, value, icon, capitalize = false }: any) {
  return (
    <div className="bg-slate-700/30 p-3 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-center gap-1">
      <div className="text-gray-500 mb-1">{icon}</div>
      <span className={`text-sm font-medium text-white ${capitalize ? 'capitalize' : ''}`}>{value || '-'}</span>
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  );
}

function DetailRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-slate-700/50 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm text-gray-200 text-right font-medium max-w-[60%] break-words">{value || '-'}</span>
    </div>
  );
}