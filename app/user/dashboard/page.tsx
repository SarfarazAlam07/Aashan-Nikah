'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiUsers, 
  FiMail, 
  FiUser, 
  FiHeart, 
  FiMapPin,
  FiTrendingUp,
  FiCheckCircle,
  FiSend
} from 'react-icons/fi';
import { FaMosque } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
  const [loadingStats, setLoadingStats] = useState(true);
  
  // Real Stats State
  const [stats, setStats] = useState({
    sentRequests: 0,
    receivedRequests: 0,
    matches: 0,
    potentialMatches: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/signin');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Fetch Real Stats
    fetchUserStats(parsedUser.id);
  }, [router]);

  const fetchUserStats = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } else {
        console.error('API is not returning JSON. Did you create app/api/user/stats/route.ts?');
      }
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-emerald-100 mb-1">{greeting}</p>
              <h1 className="text-2xl sm:text-3xl font-bold">Assalamu Alaikum, {user.name?.split(' ')[0]}! 👋</h1>
              <p className="mt-2 text-emerald-100 text-sm">Welcome to your dashboard</p>
            </div>
            <div className="hidden sm:block">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FaMosque className="text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<FiUsers className="text-xl" />}
          label="Potential Matches"
          value={loadingStats ? '...' : stats.potentialMatches}
          color="blue"
        />
        <StatCard 
          icon={<FiHeart className="text-xl" />}
          label="Successful Matches"
          value={loadingStats ? '...' : stats.matches}
          color="green"
        />
        <StatCard 
          icon={<FiSend className="text-xl" />}
          label="Sent Requests"
          value={loadingStats ? '...' : stats.sentRequests}
          color="orange"
        />
        <StatCard 
          icon={<FiMail className="text-xl" />}
          label="Received Requests"
          value={loadingStats ? '...' : stats.receivedRequests}
          color="purple"
        />
      </div>

      {/* Quick Actions & Local Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-200 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Actions</h2>
            <span className="text-xs text-gray-400">Get started</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <QuickActionCard 
              href="/user/profiles"
              icon={<FiUsers size={20} />}
              title="Browse Profiles"
              description="Find your match"
              color="green"
            />
            <QuickActionCard 
              href="/user/requests"
              icon={<FiMail size={20} />}
              title="My Requests"
              description="Manage sent & received"
              color="blue"
            />
            <QuickActionCard 
              href="/user/profile"
              icon={<FiUser size={20} />}
              title="Edit Profile"
              description="Update info & photo"
              color="purple"
            />
          </div>
        </div>

        {/* Action Highlights */}
        <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
            <FiTrendingUp className="text-gray-400" />
          </div>
          <div className="space-y-4">
             {/* Updated dynamic activity based on stats */}
            {stats.receivedRequests > 0 && (
                <ActivityItem 
                    icon={<FiMail className="text-blue-500" />}
                    title="New Requests"
                    description={`You have ${stats.receivedRequests} pending requests`}
                    time="Check now"
                />
            )}
            {stats.matches > 0 && (
                <ActivityItem 
                    icon={<FiCheckCircle className="text-green-500" />}
                    title="Rista Accepted"
                    description="You have successful matches!"
                    time="Mashallah"
                />
            )}
            <ActivityItem 
              icon={<FiUsers className="text-purple-500" />}
              title="Browse Profiles"
              description={`${stats.potentialMatches} new profiles available`}
              time="Updated recently"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
  };

  return (
    <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  );
}

function QuickActionCard({ href, icon, title, description, color }: any) {
  const colors: any = {
    green: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30',
    blue: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30',
    purple: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30'
  };

  return (
    <Link href={href} className={`group p-4 rounded-xl transition-all duration-300 ${colors[color]} hover:scale-105`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="text-gray-700 dark:text-gray-300 group-hover:scale-110 transition">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </Link>
  );
}

function ActivityItem({ icon, title, description, time }: any) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl transition bg-gray-50 dark:bg-dark-100">
      <div className="w-8 h-8 rounded-full bg-white dark:bg-dark-200 flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-800 dark:text-white text-sm">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
      <span className="text-xs text-gray-400 font-medium">{time}</span>
    </div>
  );
}