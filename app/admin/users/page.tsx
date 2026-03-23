// app/admin/users/page.tsx
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
  FiCalendar
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

  const handleVerify = async (userId: string) => {
    toast.loading('Verifying...', { id: 'verify' });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users?userId=${userId}&action=verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-white">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-gray-400 mt-1">Manage and verify user profiles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatBox label="Total Users" value={stats.total} color="blue" />
        <StatBox label="Verified" value={stats.verified} color="green" />
        <StatBox label="Pending" value={stats.pending} color="yellow" />
        <StatBox label="Male" value={stats.male} color="blue" />
        <StatBox label="Female" value={stats.female} color="pink" />
      </div>

      {/* Search & Filter */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'verified', 'pending'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition ${
                  filterStatus === status
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-300">User</th>
                <th className="px-6 py-3 text-left text-xs text-gray-300">Contact</th>
                <th className="px-6 py-3 text-left text-xs text-gray-300">Location</th>
                <th className="px-6 py-3 text-left text-xs text-gray-300">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.age} yrs • {user.caste || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white text-sm">{user.email}</p>
                    <p className="text-xs text-gray-400">{user.phone || 'No phone'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white text-sm">{user.city || 'N/A'}</p>
                    <p className="text-xs text-gray-400">{user.district}</p>
                  </td>
                  <td className="px-6 py-4">
                    {user.isVerified ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center w-fit gap-1">
                        <FiCheckCircle size={12} /> Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs flex items-center w-fit gap-1">
                        <FiXCircle size={12} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="p-1 text-blue-400 hover:text-blue-300"
                        title="View"
                      >
                        <FiEye size={18} />
                      </button>
                      {!user.isVerified && (
                        <button
                          onClick={() => handleVerify(user._id)}
                          className="p-1 text-green-400 hover:text-green-300"
                          title="Verify"
                        >
                          <FiCheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <UserModal user={selectedUser} onClose={() => setShowUserModal(false)} />
      )}
    </div>
  );
}

function StatBox({ label, value, color }: any) {
  const colors: any = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    pink: 'text-pink-400'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}

function UserModal({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">User Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
          </div>
          
          <div className="space-y-3">
            <DetailItem icon={<FiUser />} label="Name" value={user.name} />
            <DetailItem icon={<FiMail />} label="Email" value={user.email} />
            <DetailItem icon={<FiPhone />} label="Phone" value={user.phone || 'Not provided'} />
            <DetailItem label="Age" value={user.age ? `${user.age} years` : 'Not provided'} />
            <DetailItem label="Gender" value={user.gender === 'male' ? 'Male' : 'Female'} />
            <DetailItem icon={<FiMapPin />} label="Location" value={`${user.city || 'N/A'}, ${user.district}`} />
            <DetailItem label="Caste" value={user.caste || 'Not provided'} />
            <DetailItem label="Profession" value={user.profession || 'Not provided'} />
            <DetailItem icon={<FiCalendar />} label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
          </div>
          
          <button
            onClick={onClose}
            className="mt-6 w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-white text-sm">{value}</p>
      </div>
    </div>
  );
}