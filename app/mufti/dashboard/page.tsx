// app/admin/mufti/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiMail, 
  FiClock, 
  FiCheckCircle, 
  FiUsers,
  FiMessageSquare,
  FiBookOpen,
  FiHeart,
  FiTrendingUp,
  FiCalendar
} from 'react-icons/fi';
import { FaMosque, FaStar, FaHandPeace } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Request {
  _id: string;
  senderName: string;
  receiverName: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function MuftiDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [stats, setStats] = useState({
    totalApproved: 0,
    totalRejected: 0,
    pendingCount: 0,
    approvedToday: 0,
    thisWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/signin');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Check if user is MUFTI
    if (parsedUser.role !== 'MUFTI') {
      toast.error('Access Denied');
      router.push('/admin/dashboard');
      return;
    }
    
    fetchPendingRequests();
  }, [router]);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/requests?status=PENDING_ADMIN', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPendingRequests(data.requests);
        setStats({
          ...stats,
          pendingCount: data.requests.length
        });
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    const toastId = toast.loading('Approving request...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/requests?requestId=${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'SENT_TO_USER',
          adminNote: 'Approved by Mufti'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Request approved!', { id: toastId });
        fetchPendingRequests();
      } else {
        toast.error(data.error || 'Failed to approve', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt('Please enter reason for rejection:');
    if (!reason) return;
    
    const toastId = toast.loading('Rejecting request...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/requests?requestId=${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'REJECTED',
          adminNote: reason
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Request rejected', { id: toastId });
        fetchPendingRequests();
      } else {
        toast.error(data.error || 'Failed to reject', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handlePostAdvice = () => {
    if (!advice.trim()) {
      toast.error('Please write some advice');
      return;
    }
    
    toast.success('Islamic advice posted!');
    setAdvice('');
  };

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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl p-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 10L55 25L40 40L25 25L40 10zM40 30L50 40L40 50L30 40L40 30z' fill='%23ffffff' fill-opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <FaHandPeace className="text-white text-2xl" />
            <h1 className="text-2xl font-bold text-white">Assalamu Alaikum, Mufti {user?.name?.split(' ')[0]}! 👋</h1>
          </div>
          <p className="text-amber-100 text-sm">Welcome to your dashboard. Review and approve rista requests.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard 
          label="Pending Requests" 
          value={stats.pendingCount} 
          icon={<FiClock size={18} />}
          color="amber"
        />
        <StatCard 
          label="Approved Today" 
          value={stats.approvedToday} 
          icon={<FiCheckCircle size={18} />}
          color="green"
        />
        <StatCard 
          label="This Week" 
          value={stats.thisWeek} 
          icon={<FiTrendingUp size={18} />}
          color="blue"
        />
        <StatCard 
          label="Total Approved" 
          value={stats.totalApproved} 
          icon={<FiHeart size={18} />}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pending Requests Section */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiMail className="text-amber-400" size={18} />
            <h2 className="text-white font-semibold">Pending Requests ({stats.pendingCount})</h2>
          </div>
          
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <FiCheckCircle className="text-green-500 text-3xl mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No pending requests. All caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 5).map((req) => (
                <div key={req._id} className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-medium text-sm">{req.senderName} → {req.receiverName}</p>
                      <p className="text-xs text-gray-400 mt-1">💬 {req.message.substring(0, 60)}...</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Islamic Advice Section */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiBookOpen className="text-amber-400" size={18} />
            <h2 className="text-white font-semibold">Islamic Advice</h2>
          </div>
          
          <textarea
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            placeholder="Share Islamic advice for the community..."
            rows={4}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-3"
          />
          
          <button
            onClick={handlePostAdvice}
            className="w-full py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition"
          >
            Post Advice
          </button>
          
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <FaMosque className="text-amber-400" size={14} />
              <p className="text-gray-400 text-xs">Recent Islamic Quote</p>
            </div>
            <p className="text-white text-sm italic">
              "The best among you are those who have the best manners and character."
            </p>
            <p className="text-gray-500 text-[10px] mt-1">— Prophet Muhammad (PBUH)</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FiCalendar className="text-amber-400" size={18} />
          <h2 className="text-white font-semibold">Recent Activity</h2>
        </div>
        
        <div className="space-y-3">
          <ActivityItem 
            icon={<FiCheckCircle className="text-green-500" />}
            title="Request Approved"
            description="Mohammad Ali → Fatima Khan"
            time="2 hours ago"
          />
          <ActivityItem 
            icon={<FiHeart className="text-red-500" />}
            title="New Request"
            description="Omar Farooq → Aisha Begum"
            time="5 hours ago"
          />
          <ActivityItem 
            icon={<FiMessageSquare className="text-blue-500" />}
            title="Advice Posted"
            description="Islamic guidance shared"
            time="Yesterday"
          />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon, color }: any) {
  const colors: any = {
    amber: 'bg-amber-500/20 text-amber-400',
    green: 'bg-green-500/20 text-green-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400'
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-xs">{label}</p>
        <div className={`p-1.5 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <p className={`text-2xl font-bold text-white`}>{value}</p>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ icon, title, description, time }: any) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded-lg transition">
      <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-white text-sm font-medium">{title}</p>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>
      <span className="text-gray-500 text-[10px]">{time}</span>
    </div>
  );
}