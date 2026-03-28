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
  FiChevronRight,
  FiUserCheck
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
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
  };

  // app/admin/layout.tsx - In getNavItems function
const getNavItems = () => {
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isMufti = user?.role === 'MUFTI';
  
  const baseItems = [
    { href: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
  ];
  
  if (isSuperAdmin) {
    // Super Admin sees everything
    baseItems.push(
      { href: '/admin/requests', icon: FiMail, label: 'Requests' },
      { href: '/admin/profiles', icon: FiUsers, label: 'Browse Profiles' },
      { href: '/admin/users', icon: FiUserCheck, label: 'Users' },
      { href: '/admin/muftis', icon: FiStar, label: 'Muftis' },
      { href: '/admin/settings', icon: FiSettings, label: 'Settings' }
    );
  } else if (isMufti) {
    // Mufti sees limited options
    baseItems.push(
      { href: '/admin/mufti/dashboard', icon: FiMail, label: 'Requests' },
      { href: '/admin/profiles', icon: FiUsers, label: 'Browse Profiles' },
      { href: '/admin/advice', icon: FiBookOpen, label: 'Islamic Advice' }
    );
  }
  
  return baseItems;
};

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Toaster 
        position="top-right"
        toastOptions={{
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

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-slate-800/95 backdrop-blur-xl border-b border-slate-700 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <span className="text-amber-400 text-sm">⚡</span>
            </div>
            <span className="font-bold text-white text-sm">
              {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Mufti Panel'}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <FiMenu size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed position, proper z-index */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-800 shadow-2xl z-40
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">⚡</span>
            </div>
            <span className="font-bold text-white text-sm">
              {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Mufti Panel'}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <FiX size={18} className="text-white" />
          </button>
        </div>

        {/* Admin Info Card */}
        <div className="mx-4 mt-4 p-4 bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl border border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-1 ${
                user.role === 'SUPER_ADMIN' 
                  ? 'bg-amber-500/20 text-amber-400' 
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Mufti'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={isActive ? 'text-amber-400' : ''} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {isActive && <FiChevronRight size={14} className="text-amber-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
          >
            <FiLogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content - Proper margin-left on desktop */}
      <div className="lg:ml-64">
        {/* Mobile top padding */}
        <div className="pt-14 lg:pt-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}