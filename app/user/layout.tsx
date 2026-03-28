'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FiHome, 
  FiUsers, 
  FiMail, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiBell,
  FiHeart,
  FiCompass,
  FiSettings,
  FiChevronRight
} from 'react-icons/fi';
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
            headers: { 'Authorization': `Bearer ${token}` }
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
    { href: '/user/profiles', icon: FiUsers, label: 'Browse Profiles', iconActive: FiCompass },
    { href: '/user/requests', icon: FiMail, label: 'My Requests', badge: requestCount },
    { href: '/user/profile', icon: FiUser, label: 'My Profile' },
  ];

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-dark-400 dark:to-dark-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-400 dark:to-dark-300">
      <Toaster 
        position="top-right"
        toastOptions={{
          success: { 
            style: { background: '#10b981', color: 'white' },
            iconTheme: { primary: 'white', secondary: '#10b981' }
          },
          error: { 
            style: { background: '#ef4444', color: 'white' },
            iconTheme: { primary: 'white', secondary: '#ef4444' }
          },
        }}
      />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 dark:bg-dark-200/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 z-30">
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/user/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🕌</span>
            </div>
            <span className="font-bold text-gray-800 dark:text-white">Nikah Aasan</span>
          </Link>
          
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-100 transition"
            >
              <FiBell size={20} className="text-gray-600 dark:text-gray-400" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-100 transition"
            >
              <FiMenu size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Notifications Dropdown - Mobile */}
        {showNotifications && (
          <div className="absolute top-16 left-4 right-4 bg-white dark:bg-dark-200 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-green-600 dark:text-green-400 hover:text-green-700"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <FiBell className="mx-auto mb-2 text-2xl opacity-50" />
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-100 transition ${
                      !notification.read ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                    onClick={() => {
                      // Mark as read and navigate
                      setShowNotifications(false);
                    }}
                  >
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{notification.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-dark-200 shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:relative lg:w-64
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200 dark:border-gray-700">
          <Link href="/user/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🕌</span>
            </div>
            <span className="font-bold text-gray-800 dark:text-white">Nikah Aasan</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-100 transition"
          >
            <FiX size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="m-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">{user.role?.toLowerCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${active 
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-100'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={active ? 'text-green-600 dark:text-green-400' : ''} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {active && <FiChevronRight size={14} className="text-green-600" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
          >
            <FiLogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Desktop Header */}
      <header className="hidden lg:block fixed top-0 left-64 right-0 bg-white/95 dark:bg-dark-200/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 z-20">
        <div className="flex items-center justify-end px-6 h-16">
          {/* Welcome Message */}
          <div className="flex items-center gap-2 mr-4">
            <FiHeart className="text-red-500 text-sm" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Assalamu Alaikum, <span className="font-medium text-gray-800 dark:text-white">{user.name?.split(' ')[0]}</span>
            </span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-100 transition relative"
            >
              <FiBell size={18} className="text-gray-600 dark:text-gray-400" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown - Desktop */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-200 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-green-600 dark:text-green-400 hover:text-green-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <FiBell className="mx-auto mb-2 text-2xl opacity-50" />
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-100 transition ${
                          !notification.read ? 'bg-green-50 dark:bg-green-900/20' : ''
                        }`}
                        onClick={() => {
                          setShowNotifications(false);
                          router.push('/user/requests');
                        }}
                      >
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{notification.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
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