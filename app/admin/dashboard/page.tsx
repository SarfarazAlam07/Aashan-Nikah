// app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiUsers, 
  FiMail, 
  FiCheckCircle, 
  FiClock,
  FiUserCheck,
  FiStar,
  FiUserPlus,
  FiTrendingUp,
  FiCalendar,
  FiMapPin
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showAddMuftiModal, setShowAddMuftiModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    totalMuftis: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedToday: 0,
    thisWeek: 0,
    maleUsers: 0,
    femaleUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      
      if (parsed.role !== 'SUPER_ADMIN') {
        toast.error('Access Denied');
        router.push('/admin/dashboard');
        return;
      }
    }
    fetchStats();
    setLoading(false);
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-white text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-white text-sm">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name}!</p>
        </div>
        <button
          onClick={() => router.push('/admin/muftis')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          <FiUserPlus size={18} />
          <span>Manage Muftis</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FiUsers className="text-xl" />}
          color="blue"
          trend="+12 this week"
        />
        <StatCard
          title="Verified"
          value={stats.verifiedUsers}
          icon={<FiUserCheck className="text-xl" />}
          color="green"
          trend={`${Math.round(stats.verifiedUsers/(stats.totalUsers||1)*100)}% verified`}
        />
        <StatCard
          title="Muftis"
          value={stats.totalMuftis}
          icon={<FiStar className="text-xl" />}
          color="purple"
          trend="Active scholars"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={<FiClock className="text-xl" />}
          color="yellow"
          trend="Need review"
        />
      </div>

      {/* Gender Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Gender Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">👨 Male</span>
                <span className="text-blue-400 font-bold">{stats.maleUsers}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.maleUsers/(stats.totalUsers||1))*100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">👩 Female</span>
                <span className="text-pink-400 font-bold">{stats.femaleUsers}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${(stats.femaleUsers/(stats.totalUsers||1))*100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Request Stats */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Request Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 flex items-center gap-2">
                <FiCheckCircle className="text-green-500" size={16} />
                Total Requests
              </span>
              <span className="text-white font-bold">{stats.totalRequests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 flex items-center gap-2">
                <FiClock className="text-yellow-500" size={16} />
                Pending
              </span>
              <span className="text-yellow-400 font-bold">{stats.pendingRequests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 flex items-center gap-2">
                <FiTrendingUp className="text-blue-500" size={16} />
                This Week
              </span>
              <span className="text-blue-400 font-bold">{stats.thisWeek || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ActionButton
            icon={<FiUsers size={18} />}
            label="Manage Users"
            onClick={() => router.push('/admin/users')}
            color="blue"
          />
          <ActionButton
            icon={<FiMail size={18} />}
            label="Review Requests"
            onClick={() => router.push('/admin/requests')}
            color="purple"
          />
          <ActionButton
            icon={<FiStar size={18} />}
            label="Manage Muftis"
            onClick={() => router.push('/admin/muftis')}
            color="emerald"
          />
          <ActionButton
            icon={<FiMapPin size={18} />}
            label="Location Stats"
            onClick={() => toast.info('Coming soon!')}
            color="orange"
          />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color, trend }: any) {
  const colors: any = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    yellow: 'bg-yellow-500/20 text-yellow-400'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{title}</span>
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-500">{trend}</div>
    </div>
  );
}

// Action Button Component
function ActionButton({ icon, label, onClick, color }: any) {
  const colors: any = {
    blue: 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30',
    purple: 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30',
    emerald: 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30',
    orange: 'bg-orange-600/20 text-orange-400 hover:bg-orange-600/30'
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl ${colors[color]} transition w-full`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}