// app/admin/users/page.tsx
'use client';

import { useState } from 'react';
import { 
  FiSearch, 
  FiUserCheck, 
  FiUserX, 
  FiTrash2, 
  FiEdit, 
  FiEye,
  FiFilter,
  FiCheckCircle,
  FiXCircle,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// Dummy users data
const DUMMY_USERS = [
  {
    id: 1,
    name: 'Fatima Khan',
    email: 'fatima@example.com',
    phone: '+91 98765 43210',
    gender: 'female',
    age: 24,
    city: 'Chhapra',
    district: 'Saran',
    caste: 'Sheikh',
    profession: 'Teacher',
    verified: true,
    registered: '2024-01-15',
    status: 'active'
  },
  {
    id: 2,
    name: 'Mohammad Ali',
    email: 'ali@example.com',
    phone: '+91 98765 43211',
    gender: 'male',
    age: 27,
    city: 'Patna',
    district: 'Patna',
    caste: 'Syed',
    profession: 'Engineer',
    verified: true,
    registered: '2024-02-10',
    status: 'active'
  },
  {
    id: 3,
    name: 'Aisha Begum',
    email: 'aisha@example.com',
    phone: '+91 98765 43212',
    gender: 'female',
    age: 22,
    city: 'Siwan',
    district: 'Siwan',
    caste: 'Ansari',
    profession: 'Student',
    verified: false,
    registered: '2024-03-05',
    status: 'pending'
  },
  {
    id: 4,
    name: 'Omar Farooq',
    email: 'omar@example.com',
    phone: '+91 98765 43213',
    gender: 'male',
    age: 29,
    city: 'Gopalganj',
    district: 'Gopalganj',
    caste: 'Pathan',
    profession: 'Business',
    verified: true,
    registered: '2024-01-20',
    status: 'active'
  },
  {
    id: 5,
    name: 'Zainab Ansari',
    email: 'zainab@example.com',
    phone: '+91 98765 43214',
    gender: 'female',
    age: 26,
    city: 'Muzaffarpur',
    district: 'Muzaffarpur',
    caste: 'Ansari',
    profession: 'Doctor',
    verified: false,
    registered: '2024-03-01',
    status: 'pending'
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(DUMMY_USERS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSearch = () => {
    const filtered = DUMMY_USERS.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.city.toLowerCase().includes(search.toLowerCase())
    );
    setUsers(filtered);
  };

  const handleFilter = (status: string) => {
    setFilterStatus(status);
    if (status === 'all') {
      setUsers(DUMMY_USERS);
    } else {
      const filtered = DUMMY_USERS.filter(user => 
        status === 'verified' ? user.verified : !user.verified
      );
      setUsers(filtered);
    }
  };

  const handleVerify = (userId: number) => {
    toast.loading('Verifying user...', { id: 'verify' });
    
    setTimeout(() => {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, verified: true, status: 'active' } : user
      ));
      toast.success('User verified successfully!', { id: 'verify' });
    }, 1000);
  };

  const handleDelete = (userId: number) => {
    toast.loading('Deleting user...', { id: 'delete' });
    
    setTimeout(() => {
      setUsers(users.filter(user => user.id !== userId));
      setShowDeleteModal(false);
      toast.success('User deleted successfully!', { id: 'delete' });
    }, 1000);
  };

  const stats = {
    total: users.length,
    verified: users.filter(u => u.verified).length,
    pending: users.filter(u => !u.verified).length,
    male: users.filter(u => u.gender === 'male').length,
    female: users.filter(u => u.gender === 'female').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-gray-400 mt-1">Manage and verify user profiles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Users" value={stats.total} color="blue" />
        <StatCard label="Verified" value={stats.verified} color="green" />
        <StatCard label="Pending" value={stats.pending} color="yellow" />
        <StatCard label="Male" value={stats.male} color="blue" />
        <StatCard label="Female" value={stats.female} color="pink" />
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === 'all' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilter('verified')}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === 'verified' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => handleFilter('pending')}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.profession}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{user.email}</div>
                    <div className="text-xs text-gray-400">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{user.city}</div>
                    <div className="text-xs text-gray-400">{user.district}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{user.age} yrs • {user.caste}</div>
                    <div className="text-xs text-gray-400">Joined: {user.registered}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.verified ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center w-fit">
                        <FiCheckCircle className="mr-1" size={12} />
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs flex items-center w-fit">
                        <FiXCircle className="mr-1" size={12} />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="p-1 text-blue-400 hover:text-blue-300 transition"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
                      {!user.verified && (
                        <button
                          onClick={() => handleVerify(user.id)}
                          className="p-1 text-green-400 hover:text-green-300 transition"
                          title="Verify User"
                        >
                          <FiCheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-red-400 hover:text-red-300 transition"
                        title="Delete User"
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

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 pb-4 border-b border-gray-700">
                  <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{selectedUser.name}</h4>
                    <p className="text-gray-400">{selectedUser.profession}</p>
                  </div>
                </div>

                <DetailRow icon={<FiMail />} label="Email" value={selectedUser.email} />
                <DetailRow icon={<FiPhone />} label="Phone" value={selectedUser.phone} />
                <DetailRow label="Age" value={`${selectedUser.age} years`} />
                <DetailRow label="Gender" value={selectedUser.gender} />
                <DetailRow label="Caste" value={selectedUser.caste} />
                <DetailRow label="City" value={`${selectedUser.city}, ${selectedUser.district}`} />
                <DetailRow label="Registered" value={new Date(selectedUser.registered).toLocaleDateString()} />
                <DetailRow 
                  label="Status" 
                  value={selectedUser.verified ? 'Verified' : 'Pending Verification'}
                  valueClass={selectedUser.verified ? 'text-green-400' : 'text-yellow-400'}
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="text-red-400 text-2xl" />
              </div>
              
              <h3 className="text-lg font-bold text-white text-center mb-2">Delete User</h3>
              <p className="text-gray-400 text-center mb-6">
                Are you sure you want to delete <span className="text-white font-medium">{selectedUser.name}</span>? This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleDelete(selectedUser.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: any) {
  const colors: any = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    pink: 'bg-pink-500/20 text-pink-400'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${colors[color].split(' ')[1]}`}>{value}</p>
    </div>
  );
}

function DetailRow({ icon, label, value, valueClass = 'text-white' }: any) {
  return (
    <div className="flex items-start space-x-3">
      {icon && <div className="text-gray-400 mt-1">{icon}</div>}
      <div className="flex-1">
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`${valueClass} font-medium`}>{value}</p>
      </div>
    </div>
  );
}