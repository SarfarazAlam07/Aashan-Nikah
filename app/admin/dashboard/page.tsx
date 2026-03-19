// app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiMail, 
  FiCheckCircle, 
  FiXCircle, 
  FiTrendingUp,
  FiUserCheck,
  FiUserX,
  FiClock
} from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 156,
    verifiedUsers: 98,
    pendingUsers: 58,
    totalRequests: 45,
    pendingRequests: 12,
    approvedRequests: 28,
    rejectedRequests: 5,
    maleUsers: 82,
    femaleUsers: 74
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: 'New user registered', user: 'Fatima Khan', time: '5 minutes ago', type: 'user' },
    { id: 2, action: 'Rista request pending', user: 'Mohammad Ali → Aisha', time: '10 minutes ago', type: 'request' },
    { id: 3, action: 'Request approved', user: 'Omar → Fatima', time: '1 hour ago', type: 'approve' },
    { id: 4, action: 'New user verified', user: 'Hasan Raza', time: '2 hours ago', type: 'verify' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FiUsers className="text-2xl" />}
          color="blue"
          trend="+12 this week"
        />
        <StatCard
          title="Verified Users"
          value={stats.verifiedUsers}
          icon={<FiUserCheck className="text-2xl" />}
          color="green"
          trend={`${Math.round(stats.verifiedUsers/stats.totalUsers*100)}% verified`}
        />
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          icon={<FiMail className="text-2xl" />}
          color="purple"
          trend="+5 new"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={<FiClock className="text-2xl" />}
          color="yellow"
          trend="Need attention"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-4">Gender Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white">👨 Male</span>
              <span className="text-blue-400 font-bold">{stats.maleUsers}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.maleUsers/stats.totalUsers)*100}%` }}></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-white">👩 Female</span>
              <span className="text-pink-400 font-bold">{stats.femaleUsers}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${(stats.femaleUsers/stats.totalUsers)*100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-4">Request Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white flex items-center"><FiCheckCircle className="text-green-500 mr-2" /> Approved</span>
              <span className="text-green-400 font-bold">{stats.approvedRequests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white flex items-center"><FiClock className="text-yellow-500 mr-2" /> Pending</span>
              <span className="text-yellow-400 font-bold">{stats.pendingRequests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white flex items-center"><FiXCircle className="text-red-500 mr-2" /> Rejected</span>
              <span className="text-red-400 font-bold">{stats.rejectedRequests}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition">
              📋 Verify New Users
            </button>
            <button className="w-full text-left px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition">
              ✉️ Review Pending Requests
            </button>
            <button className="w-full text-left px-3 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition">
              📊 Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between border-b border-gray-700 pb-3 last:border-0">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'request' ? 'bg-yellow-500' :
                  activity.type === 'approve' ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
                <div>
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-gray-400 text-xs">{activity.user}</p>
                </div>
              </div>
              <span className="text-gray-500 text-xs">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }: any) {
  const colors: any = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    yellow: 'bg-yellow-500/20 text-yellow-400'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
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