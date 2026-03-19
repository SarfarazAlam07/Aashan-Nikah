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
  FiPieChart,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('user');
    const userRole = localStorage.getItem('userRole');
    
    if (!userData || userRole !== 'ADMIN') {
      toast.error('Unauthorized access! Redirecting...', {
        duration: 3000,
        position: 'top-center',
      });
      setTimeout(() => router.push('/signin'), 2000);
      return;
    }
    
    try {
      setAdmin(JSON.parse(userData));
      toast.success(`Welcome back, ${JSON.parse(userData).name}! 👋`, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      router.push('/signin');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    toast.success('Logged out successfully!', {
      duration: 2000,
      position: 'top-center',
    });
    setTimeout(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      router.push('/signin');
    }, 1000);
  };

  const navItems = [
    { href: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { href: '/admin/users', icon: FiUsers, label: 'Users', badge: 12 },
    { href: '/admin/requests', icon: FiMail, label: 'Requests', badge: 5 },
    { href: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-white">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          success: { style: { background: '#10b981', color: 'white' } },
          error: { style: { background: '#ef4444', color: 'white' } },
        }}
      />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-30">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-500 text-2xl">⚡</span>
            <span className="font-bold text-white">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <FiMenu size={24} className="text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
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
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-500 text-2xl">⚡</span>
            <span className="font-bold text-white">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <FiX size={20} className="text-white" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{admin?.name}</p>
              <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
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
                    ? 'bg-emerald-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition w-full"
          >
            <FiLogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        min-h-screen transition-all duration-300
        lg:ml-64
        pt-16 lg:pt-0
      `}>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}