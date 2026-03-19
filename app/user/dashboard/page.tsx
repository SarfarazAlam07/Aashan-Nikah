// app/user/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUsers, FiMail, FiUser, FiHeart, FiMapPin } from 'react-icons/fi';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/signin');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 sm:p-6 text-white">
        <h1 className="text-xl sm:text-2xl font-bold">Assalamu Alaikum, {user.name}! 👋</h1>
        <p className="mt-2 text-sm sm:text-base opacity-90">Welcome to your dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard 
          icon={<FiUsers className="text-xl sm:text-2xl" />}
          label="Views"
          value="24"
          color="blue"
        />
        <StatCard 
          icon={<FiHeart className="text-xl sm:text-2xl" />}
          label="Matches"
          value="5"
          color="green"
        />
        <StatCard 
          icon={<FiMail className="text-xl sm:text-2xl" />}
          label="Requests"
          value="3"
          color="orange"
        />
        <StatCard 
          icon={<FiUser className="text-xl sm:text-2xl" />}
          label="Messages"
          value="12"
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h2>
          <div className="space-y-2 sm:space-y-3">
            <QuickActionLink 
              href="/user/profiles"
              bgColor="emerald"
              text="Browse Profiles"
            />
            <QuickActionLink 
              href="/user/requests"
              bgColor="blue"
              text="View Requests"
            />
            <QuickActionLink 
              href="/user/profile"
              bgColor="purple"
              text="Edit Profile"
            />
          </div>
        </div>

        {/* Local Matches */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Local Matches</h2>
          <div className="space-y-2 sm:space-y-3">
            <LocationMatch city="Chhapra" count={24} />
            <LocationMatch city="Patna" count={56} />
            <LocationMatch city="Siwan" count={18} />
            <LocationMatch city="Gopalganj" count={15} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }: any) {
  const colors: any = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-600">{label}</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Quick Action Link Component
function QuickActionLink({ href, bgColor, text }: any) {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100'
  };

  return (
    <Link
      href={href}
      className={`block p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${colors[bgColor]}`}
    >
      {text} →
    </Link>
  );
}

// Location Match Component
function LocationMatch({ city, count }: { city: string; count: number }) {
  return (
    <div className="flex items-center justify-between text-sm sm:text-base">
      <div className="flex items-center space-x-2">
        <FiMapPin className="text-emerald-600 text-sm sm:text-base" />
        <span className="text-gray-700">{city}</span>
      </div>
      <span className="text-xs sm:text-sm font-medium text-emerald-600">{count} profiles</span>
    </div>
  );
}