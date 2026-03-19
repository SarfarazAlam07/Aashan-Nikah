// app/user/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiUsers, FiMail, FiUser, FiLogOut, FiMenu, FiX, FiBell } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { DUMMY_REQUESTS } from '@/models/RistaRequest'; 
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/signin');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Welcome notification
      toast.success(`Welcome back, ${parsedUser.name}! 👋`, {
        duration: 4000,
        position: 'top-right',
        icon: '🕌',
      });
      
    } catch (error) {
      router.push('/signin');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Calculate pending requests and notifications
  useEffect(() => {
    if (user) {
      // Pending requests count
      const pending = DUMMY_REQUESTS.filter(
        r => r.receiverId === user.id && r.status === 'SENT_TO_USER'
      ).length;
      setRequestCount(pending);

      // Create notifications for new requests
      const newRequests = DUMMY_REQUESTS.filter(
        r => r.receiverId === user.id && r.status === 'SENT_TO_USER'
      );

      if (newRequests.length > 0) {
        setNotifications(newRequests.map(req => ({
          id: req.id,
          title: 'New Rista Request',
          message: `${req.senderName} sent you a request`,
          time: new Date(req.createdAt).toLocaleTimeString(),
          read: false
        })));

        // Show toast for new requests
        newRequests.forEach(req => {
          toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-xl">
                      {req.senderName.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New Rista Request
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {req.senderName} sent you a request
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    router.push('/user/requests');
                  }}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-emerald-600 hover:text-emerald-500 focus:outline-none"
                >
                  View
                </button>
              </div>
            </div>
          ), { duration: 5000 });
        });
      }
    }
  }, [user, router]);

  const handleLogout = () => {
    toast.success('Logged out successfully! 👋', {
      duration: 3000,
      position: 'top-right',
      icon: '👋',
    });
    
    setTimeout(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      router.push('/signin');
    }, 1000);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success('All notifications cleared', {
      duration: 2000,
      position: 'top-right',
    });
  };

  const navItems = [
    { href: '/user/dashboard', icon: FiHome, label: 'Dashboard' },
    { href: '/user/profiles', icon: FiUsers, label: 'Browse Profiles' },
    { href: '/user/requests', icon: FiMail, label: 'My Requests', badge: requestCount },
    { href: '/user/profile', icon: FiUser, label: 'My Profile' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
              color: 'white',
            },
          },
          error: {
            duration: 3000,
            style: {
              background: '#ef4444',
              color: 'white',
            },
          },
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
            {/* Notification Bell - Mobile */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg transition relative"
              >
                <FiBell size={24} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications Dropdown - Mobile */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-emerald-600 hover:text-emerald-700"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-emerald-50' : ''
                          }`}
                          onClick={() => {
                            markNotificationAsRead(notification.id);
                            router.push('/user/requests');
                            setShowNotifications(false);
                          }}
                        >
                          <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      ))
                    )}
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

      {/* Sidebar - Mobile & Desktop */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:shadow-none lg:z-10
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
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

        {/* User Info */}
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

        {/* Logout Button */}
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

      {/* Desktop Header - with Notification */}
      <header className="hidden lg:block fixed top-0 left-64 right-0 bg-white border-b border-gray-200 z-20">
        <div className="flex items-center justify-end px-8 h-16">
          {/* Notification Bell - Desktop */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg transition relative"
            >
              <FiBell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notifications Dropdown - Desktop */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-emerald-600 hover:text-emerald-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-emerald-50' : ''
                        }`}
                        onClick={() => {
                          markNotificationAsRead(notification.id);
                          router.push('/user/requests');
                          setShowNotifications(false);
                        }}
                      >
                        <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Name */}
          <span className="ml-4 text-sm text-gray-700">
            {user?.name} ({user?.role})
          </span>
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