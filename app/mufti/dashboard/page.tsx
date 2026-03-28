'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiMail, 
  FiClock, 
  FiCheckCircle, 
  FiUsers,
  FiBookOpen,
  FiHeart,
  FiTrendingUp,
  FiArrowRight,
  FiStar
} from 'react-icons/fi';
import { FaMosque, FaHandPeace } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Request {
  _id: string;
  senderId: { name: string; age: number; city: string };
  receiverId: { name: string; age: number; city: string };
  message: string;
  status: string;
  createdAt: string;
}

export default function MuftiDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/signin');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    if (parsedUser.role !== 'MUFTI') {
      toast.error('Access Denied');
      router.push('/user/dashboard');
      return;
    }
    
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const pending = data.requests.filter((r: any) => r.status === 'PENDING_ADMIN');
        const approved = data.requests.filter((r: any) => r.status === 'ACCEPTED');
        const rejected = data.requests.filter((r: any) => r.status === 'REJECTED');
        
        setPendingRequests(pending);
        setStats({
          pending: pending.length,
          approved: approved.length,
          rejected: rejected.length,
          total: data.requests.length
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-amber-100 mb-1">Assalamu Alaikum</p>
              <h1 className="text-2xl sm:text-3xl font-bold">Mufti {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="mt-2 text-amber-100 text-sm">Welcome to your Mufti Dashboard</p>
            </div>
            <div className="hidden sm:block">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FaMosque className="text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard 
          label="Pending" 
          value={stats.pending} 
          icon={<FiClock className="text-xl" />}
          color="amber"
        />
        <StatCard 
          label="Approved" 
          value={stats.approved} 
          icon={<FiCheckCircle className="text-xl" />}
          color="green"
        />
        <StatCard 
          label="Rejected" 
          value={stats.rejected} 
          icon={<FiHeart className="text-xl" />}
          color="red"
        />
        <StatCard 
          label="Total" 
          value={stats.total} 
          icon={<FiTrendingUp className="text-xl" />}
          color="blue"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests Preview */}
        <div className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <FiMail className="text-amber-500" />
              Pending Requests
            </h2>
            <Link href="/mufti/requests" className="text-xs text-amber-600 hover:underline flex items-center gap-1">
              View all <FiArrowRight size={12} />
            </Link>
          </div>
          
          {pendingRequests.length === 0 ? (
            <div className="text-center py-6">
              <FiCheckCircle className="text-green-500 text-2xl mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((req) => (
                <div key={req._id} className="bg-gray-50 dark:bg-dark-100 rounded-lg p-3">
                  <p className="font-medium text-gray-800 dark:text-white text-sm">
                    {req.senderId?.name} → {req.receiverId?.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {req.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Islamic Quote */}
        <div className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiBookOpen className="text-amber-500" size={18} />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Islamic Quote</h2>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
            <p className="text-gray-700 dark:text-gray-300 text-sm italic leading-relaxed">
              "The best among you are those who have the best manners and character."
            </p>
            <p className="text-amber-600 dark:text-amber-400 text-xs mt-2">
              — Prophet Muhammad (PBUH)
            </p>
          </div>
          <Link
            href="/mufti/advice"
            className="mt-4 flex items-center justify-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition"
          >
            <FiBookOpen size={14} />
            Share Islamic Advice
            <FiArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-amber-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction 
            href="/mufti/requests"
            icon={<FiMail size={18} />}
            label="Review Requests"
            count={stats.pending}
            color="amber"
          />
          <QuickAction 
            href="/mufti/profiles"
            icon={<FiUsers size={18} />}
            label="Browse Profiles"
            color="blue"
          />
          <QuickAction 
            href="/mufti/profile"
            icon={<FiStar size={18} />}
            label="My Profile"
            color="purple"
          />
          <QuickAction 
            href="/mufti/advice"
            icon={<FiBookOpen size={18} />}
            label="Share Advice"
            color="green"
          />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon, color }: any) {
  const colors: any = {
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
  };

  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  );
}

// Quick Action Component
function QuickAction({ href, icon, label, count, color }: any) {
  const colors: any = {
    amber: 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    green: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400'
  };

  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl ${colors[color]} transition-all duration-200 hover:scale-105`}
    >
      {icon}
      <span className="text-xs font-medium text-center">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
          {count}
        </span>
      )}
    </Link>
  );
}