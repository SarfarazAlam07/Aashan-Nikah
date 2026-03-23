// app/user/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiUsers, FiMail, FiUser, FiLogOut, FiMenu, FiX, FiBell } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/signin');
      }
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch request count
  useEffect(() => {
    if (user) {
      const fetchRequestCount = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/requests?userId=${user.id}&type=received`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (data.success) {
            const pendingCount = data.requests.filter((r: any) => r.status === 'SENT_TO_USER').length;
            setRequestCount(pendingCount);
          }
        } catch (error) {
          console.error('Error fetching requests:', error);
        }
      };
      fetchRequestCount();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const navItems = [
    { href: '/user/dashboard', icon: FiHome, label: 'Dashboard' },
    { href: '/user/profiles', icon: FiUsers, label: 'Browse Profiles' },
    { href: '/user/requests', icon: FiMail, label: 'My Requests', badge: requestCount },
    { href: '/user/profile', icon: FiUser, label: 'My Profile' },
  ];

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          success: { style: { background: '#10b981', color: 'white' } },
          error: { style: { background: '#ef4444', color: 'white' } },
        }}
      />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/user/dashboard" className="flex items-center space-x-2">
            <span className="text-emerald-700 text-2xl">🕌</span>
            <span className="font-bold text-gray-800">Nikah Aasan</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg transition relative"
              >
                <FiBell size={24} />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-emerald-600 hover:text-emerald-700"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="p-4 text-center text-gray-500">
                    No notifications
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:shadow-none lg:z-10
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link href="/user/dashboard" className="flex items-center space-x-2">
            <span className="text-emerald-700 text-2xl">🕌</span>
            <span className="font-bold text-gray-800">Nikah Aasan</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">
              {user?.gender === 'male' ? '👨' : '👩'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg transition
                  ${isActive 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition w-full"
          >
            <FiLogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <header className="hidden lg:block fixed top-0 left-64 right-0 bg-white border-b border-gray-200 z-20">
        <div className="flex items-center justify-end px-8 h-16">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg transition relative"
            >
              <FiBell size={20} />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    Clear all
                  </button>
                </div>
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              </div>
            )}
          </div>
          <span className="ml-4 text-sm text-gray-700">
            {user?.name} ({user?.role})
          </span>
        </div>
      </header>

      <main className={`
        min-h-screen transition-all duration-300
        lg:ml-64
        pt-16 lg:pt-16
      `}>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}