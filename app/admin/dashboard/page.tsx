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
  FiMapPin,
  FiBarChart2,
  FiActivity
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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
        headers: { 'Authorization': `Bearer ${token}` }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Welcome back, {user?.name}! 👋</p>
        </div>
        <button
          onClick={() => router.push('/admin/muftis')}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition shadow-sm"
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
          color="amber"
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="text-amber-400" size={18} />
            <h3 className="text-white font-semibold text-lg">Gender Distribution</h3>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300 flex items-center gap-2">
                  <span className="text-blue-400">👨</span> Male
                </span>
                <span className="text-blue-400 font-bold">{stats.maleUsers}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats.maleUsers/(stats.totalUsers||1))*100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300 flex items-center gap-2">
                  <span className="text-pink-400">👩</span> Female
                </span>
                <span className="text-pink-400 font-bold">{stats.femaleUsers}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-pink-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats.femaleUsers/(stats.totalUsers||1))*100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Request Stats */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiActivity className="text-amber-400" size={18} />
            <h3 className="text-white font-semibold text-lg">Request Overview</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-xl">
              <span className="text-gray-300 flex items-center gap-2">
                <FiCheckCircle className="text-green-500" size={16} />
                Total Requests
              </span>
              <span className="text-white font-bold text-lg">{stats.totalRequests}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-xl">
              <span className="text-gray-300 flex items-center gap-2">
                <FiClock className="text-yellow-500" size={16} />
                Pending
              </span>
              <span className="text-yellow-400 font-bold text-lg">{stats.pendingRequests}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-xl">
              <span className="text-gray-300 flex items-center gap-2">
                <FiTrendingUp className="text-blue-500" size={16} />
                This Week
              </span>
              <span className="text-blue-400 font-bold text-lg">{stats.thisWeek || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
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
            color="amber"
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
    blue: 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/10 text-green-400 border-green-500/30',
    amber: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/10 text-yellow-400 border-yellow-500/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl border p-5 transition-all hover:scale-105 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/70 text-sm">{title}</span>
        <div className={`p-2 rounded-xl bg-white/10`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-white/50">{trend}</div>
    </div>
  );
}

// Action Button Component
function ActionButton({ icon, label, onClick, color }: any) {
  const colors: any = {
    blue: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20',
    orange: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/20'
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl border ${colors[color]} transition-all duration-200 hover:scale-105 w-full group`}
    >
      <div className="group-hover:scale-110 transition">{icon}</div>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}