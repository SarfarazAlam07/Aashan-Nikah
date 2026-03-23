// app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FiHome, 
  FiUsers, 
  FiMail, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiStar,
  FiBookOpen,
  FiChevronRight
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast.error('Please login first');
        setTimeout(() => router.push('/signin'), 1000);
        return;
      }
      
      if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'MUFTI') {
        toast.error('Unauthorized access');
        setTimeout(() => router.push('/user/dashboard'), 1000);
        return;
      }
      
      setLoading(false);
      // toast.success(`Welcome back, ${user?.name}! 👋`);
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
  };

  const getNavItems = () => {
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    
    const baseItems = [
      { href: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
      { href: '/admin/requests', icon: FiMail, label: 'Requests' },
    ];
    
    if (isSuperAdmin) {
      baseItems.push(
        { href: '/admin/users', icon: FiUsers, label: 'Users' },
        { href: '/admin/muftis', icon: FiStar, label: 'Muftis' },
        { href: '/admin/settings', icon: FiSettings, label: 'Settings' }
      );
    } else {
      baseItems.push(
        { href: '/admin/advice', icon: FiBookOpen, label: 'Advice' }
      );
    }
    
    return baseItems;
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-white text-sm">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          success: { style: { background: '#10b981', color: 'white' } },
          error: { style: { background: '#ef4444', color: 'white' } },
        }}
      />

      {/* Mobile Header - Only ONE hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 text-xl">⚡</span>
            <span className="font-bold text-white text-sm">
              {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Mufti Panel'}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <FiMenu size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-gray-800 shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 text-xl">⚡</span>
            <span className="font-bold text-white text-sm">
              {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Mufti Panel'}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-700 rounded-lg"
          >
            <FiX size={18} className="text-white" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="p-4 mx-2 mt-4 bg-gray-700/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {user.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-1 ${
                user.role === 'SUPER_ADMIN' 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Mufti'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-lg transition group
                  ${isActive 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {isActive && <FiChevronRight size={14} className="text-white" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition w-full group"
          >
            <FiLogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        min-h-screen transition-all duration-300
        lg:ml-64
      `}>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}