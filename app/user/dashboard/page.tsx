'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiUsers, 
  FiMail, 
  FiUser, 
  FiHeart, 
  FiTrendingUp,
  FiCheckCircle,
  FiSend,
  FiChevronRight,
  FiActivity
} from 'react-icons/fi';
import { FaMosque } from 'react-icons/fa';

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
      const response = await fetch('/api/users/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } else {
        console.error('API is not returning JSON. Check /api/users/stats route.');
      }
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const hasActivity = stats.receivedRequests > 0 || stats.matches > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Premium Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-emerald-900/20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base text-emerald-100/80 mb-1.5 font-medium tracking-wide uppercase">{greeting}</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                Assalamu Alaikum, {user.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base font-medium opacity-90">
                Welcome back to your matchmaking journey.
              </p>
            </div>
            <div className="hidden md:flex">
              <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
                <FaMosque className="text-3xl text-emerald-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Stats Grid (Classic Clean Look) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          icon={<FiUsers size={22} />}
          label="Potential Matches"
          value={loadingStats ? '...' : stats.potentialMatches}
          color="emerald"
        />
        <StatCard 
          icon={<FiHeart size={22} />}
          label="Successful Matches"
          value={loadingStats ? '...' : stats.matches}
          color="rose"
        />
        <StatCard 
          icon={<FiSend size={22} />}
          label="Sent Requests"
          value={loadingStats ? '...' : stats.sentRequests}
          color="amber"
        />
        <StatCard 
          icon={<FiMail size={22} />}
          label="Received Requests"
          value={loadingStats ? '...' : stats.receivedRequests}
          color="blue"
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions (Classic Menu Style) */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-200 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <QuickActionCard 
              href="/user/profiles"
              icon={<FiUsers size={24} />}
              title="Browse Profiles"
              description="Find your ideal match"
              iconBg="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
            />
            <QuickActionCard 
              href="/user/requests"
              icon={<FiMail size={24} />}
              title="My Requests"
              description="Inbox & Outbox"
              iconBg="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            />
            <QuickActionCard 
              href="/user/profile"
              icon={<FiUser size={24} />}
              title="Edit Profile"
              description="Update your details"
              iconBg="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
            />
          </div>
        </div>

        {/* Dynamic Activity Feed */}
        <div className="bg-white dark:bg-dark-200 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiActivity className="text-emerald-500" /> Activity
            </h2>
          </div>
          
          <div className="space-y-4">
             {hasActivity ? (
               <>
                 {stats.receivedRequests > 0 && (
                     <ActivityItem 
                         icon={<FiMail className="text-blue-500" />}
                         title="New Requests"
                         description={`You have ${stats.receivedRequests} pending requests`}
                         href="/user/requests"
                         bg="bg-blue-50 dark:bg-blue-900/10"
                     />
                 )}
                 {stats.matches > 0 && (
                     <ActivityItem 
                         icon={<FiCheckCircle className="text-emerald-500" />}
                         title="Rista Accepted"
                         description="You have successful matches!"
                         href="/user/requests"
                         bg="bg-emerald-50 dark:bg-emerald-900/10"
                     />
                 )}
               </>
             ) : (
               <div className="text-center py-6">
                 <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                   <FiTrendingUp className="text-gray-400" size={20} />
                 </div>
                 <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity yet.</p>
                 <Link href="/user/profiles" className="text-emerald-600 text-sm font-medium mt-2 inline-block hover:underline">
                   Start browsing profiles &rarr;
                 </Link>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* 🔥 TechEraX Branding Footer 🔥 */}
      <div className="mt-8 text-center">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center justify-center gap-1 font-semibold">
          Powered by 
          <a 
            href="https://tech-era-x.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
          >
            TechEraX
          </a>
        </p>
      </div>

    </div>
  );
}

// Classic Stat Card (Clean & Minimal)
function StatCard({ icon, label, value, color }: any) {
  const colorMap: any = {
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30',
    rose: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30'
  };

  return (
    <div className="bg-white dark:bg-dark-200 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-6 hover:shadow-md transition duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</p>
        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}

// Clean Quick Action Card
function QuickActionCard({ href, icon, title, description, iconBg }: any) {
  return (
    <Link href={href} className="group block p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-100 hover:bg-white dark:hover:bg-dark-200 hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-900/50 transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${iconBg}`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{description}</p>
    </Link>
  );
}

// Dynamic Activity Item with Link
function ActivityItem({ icon, title, description, href, bg }: any) {
  return (
    <Link href={href} className={`flex items-center justify-between p-4 rounded-2xl transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700 ${bg}`}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-dark-200 flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white text-sm">{title}</p>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      <FiChevronRight className="text-gray-400" />
    </Link>
  );
}