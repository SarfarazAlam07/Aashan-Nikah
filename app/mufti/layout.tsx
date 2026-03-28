'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FiHome, 
  FiUsers, 
  FiMail, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiStar,
  FiBookOpen,
  FiChevronRight,
  FiUser
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';

export default function MuftiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast.error('Please login first');
        setTimeout(() => router.push('/signin'), 1000);
        return;
      }
      
      if (user?.role !== 'MUFTI') {
        toast.error('Unauthorized access - Mufti only');
        setTimeout(() => router.push('/user/dashboard'), 1000);
        return;
      }
      
      fetchRequestCount();
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchRequestCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const pendingCount = data.requests.filter((r: any) => r.status === 'PENDING_ADMIN').length;
        setRequestCount(pendingCount);
      }
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { href: '/mufti/dashboard', icon: FiHome, label: 'Dashboard', exact: true },
    { href: '/mufti/requests', icon: FiMail, label: 'Review Requests', badge: requestCount },
    { href: '/mufti/profiles', icon: FiUsers, label: 'Browse Profiles' },
    { href: '/mufti/profile', icon: FiUser, label: 'My Profile' },
    { href: '/mufti/advice', icon: FiBookOpen, label: 'Islamic Advice' }
  ];

// Replace the isActive function with this
const isActive = (href: string, exact: boolean = false) => {
  if (exact) {
    return pathname === href;
  }
  
  // Special handling for profile routes
  if (href === '/mufti/profile') {
    // My profile should only be active for exact match or profile without ID
    return pathname === '/mufti/profile';
  }
  
  if (href === '/mufti/profiles') {
    // Browse profiles should be active for /mufti/profiles and /mufti/profiles/[id]
    return pathname === '/mufti/profiles' || pathname?.startsWith('/mufti/profiles/');
  }
  
  // For other routes, use startsWith
  return pathname?.startsWith(href);
};

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-dark-400 dark:to-dark-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading Mufti Panel...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-dark-400 dark:to-dark-300">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          success: { 
            style: { background: '#f59e0b', color: 'white' },
            iconTheme: { primary: 'white', secondary: '#f59e0b' }
          },
          error: { 
            style: { background: '#ef4444', color: 'white' },
            iconTheme: { primary: 'white', secondary: '#ef4444' }
          },
        }}
      />

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-dark-200 shadow-xl z-20">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <FiStar className="text-white text-sm" />
            </div>
            <span className="font-bold text-gray-800 dark:text-white text-sm">Mufti Panel</span>
          </div>
        </div>

        {/* Mufti Info Card */}
        <div className="mx-4 mt-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              {user.name?.charAt(0).toUpperCase() || 'M'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-white text-sm truncate">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full mt-1 bg-amber-500/20 text-amber-600 dark:text-amber-400">
                Mufti
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${active 
                    ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-100'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={active ? 'text-amber-500' : ''} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
                {active && <FiChevronRight size={14} className="text-amber-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
          >
            <FiLogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className={`
        fixed inset-0 z-40 lg:hidden
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="relative w-72 h-full bg-white dark:bg-dark-200 shadow-xl">
          <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <FiStar className="text-white text-sm" />
              </div>
              <span className="font-bold text-gray-800 dark:text-white text-sm">Mufti Panel</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-100 rounded-lg">
              <FiX size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="mx-4 mt-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                {user.name?.charAt(0).toUpperCase() || 'M'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 dark:text-white text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full mt-1 bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  Mufti
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
                    ${active 
                      ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-100'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={active ? 'text-amber-500' : ''} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                  {active && <FiChevronRight size={14} className="text-amber-500" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
            >
              <FiLogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 dark:bg-dark-200/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <FiStar className="text-white text-sm" />
            </div>
            <span className="font-bold text-gray-800 dark:text-white text-sm">Mufti Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-100 rounded-lg">
            <FiMenu size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}