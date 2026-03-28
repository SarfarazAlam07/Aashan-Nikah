'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiMail, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiSend,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiEye,
  FiRefreshCw,
  FiUser,
  FiCalendar
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useRequests } from '@/lib/hooks/useRequests';

interface Request {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    age: number;
    city: string;
  };
  receiverId: {
    _id: string;
    name: string;
    age: number;
    city: string;
  };
  senderName: string;
  receiverName: string;
  message?: string;
  status: string;
  adminNote?: string;
  createdAt: string;
}

export default function RequestsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/signin');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const { 
    requests: receivedRequests, 
    isLoading: receivedLoading,
    mutate: mutateReceived 
  } = useRequests(user?.id, 'received');
  
  const { 
    requests: sentRequests, 
    isLoading: sentLoading,
    mutate: mutateSent 
  } = useRequests(user?.id, 'sent');

  const isLoading = receivedLoading || sentLoading;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([mutateReceived(), mutateSent()]);
    setIsRefreshing(false);
    toast.success('Requests refreshed');
  };

  const handleRespond = async (requestId: string, action: 'ACCEPTED' | 'REJECTED') => {
    const toastId = toast.loading('Processing...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: action })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success(`Request ${action.toLowerCase()}!`, { id: toastId });
        await Promise.all([mutateReceived(), mutateSent()]);
      } else {
        toast.error(data?.error || 'Failed to respond', { id: toastId });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error', { id: toastId });
    }
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'PENDING_ADMIN':
        return { 
          bg: 'bg-amber-50 dark:bg-amber-900/30', 
          text: 'text-amber-700 dark:text-amber-400', 
          icon: FiClock, 
          label: 'Pending Admin' 
        };
      case 'SENT_TO_USER':
        return { 
          bg: 'bg-blue-50 dark:bg-blue-900/30', 
          text: 'text-blue-700 dark:text-blue-400', 
          icon: FiSend, 
          label: 'Sent to User' 
        };
      case 'ACCEPTED':
        return { 
          bg: 'bg-green-50 dark:bg-green-900/30', 
          text: 'text-green-700 dark:text-green-400', 
          icon: FiCheckCircle, 
          label: 'Accepted' 
        };
      case 'REJECTED':
        return { 
          bg: 'bg-red-50 dark:bg-red-900/30', 
          text: 'text-red-700 dark:text-red-400', 
          icon: FiXCircle, 
          label: 'Rejected' 
        };
      default:
        return { 
          bg: 'bg-gray-50 dark:bg-gray-800', 
          text: 'text-gray-700 dark:text-gray-400', 
          icon: FiAlertCircle, 
          label: status 
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Requests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your rista requests
          </p>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <FiRefreshCw className={`text-gray-500 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} size={16} />
          <span className="text-sm text-gray-600 dark:text-gray-300">Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('received')}
            className={`pb-4 px-1 font-medium text-sm border-b-2 transition ${
              activeTab === 'received'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Received ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`pb-4 px-1 font-medium text-sm border-b-2 transition ${
              activeTab === 'sent'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>
      </div>

      {/* Received Requests */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedRequests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
              <FiMail className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No received requests</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">When someone sends you a request, it will appear here</p>
            </div>
          ) : (
            receivedRequests.map((req) => {
              const status = getStatusConfig(req.status);
              const StatusIcon = status.icon;
              
              return (
                <div key={req._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition">
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        {/* Sender Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 flex items-center justify-center text-xl">
                            {req.senderName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white text-base">
                              {req.senderName}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                              <FiUser size={12} />
                              {req.senderId?.age || '?'} yrs • {req.senderId?.city || 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Message */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-3">
                          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                            "{req.message}"
                          </p>
                        </div>
                        
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                            <StatusIcon size={12} />
                            {status.label}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <FiCalendar size={12} />
                            {formatDate(req.createdAt)}
                          </span>
                        </div>

                        {/* Admin Note */}
                        {req.adminNote && (
                          <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-xs text-gray-500 dark:text-gray-400 border-l-2 border-amber-500">
                            <span className="font-medium">Admin Note:</span> {req.adminNote}
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/user/profile/${req.senderId?._id || req.senderId}`}
                          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                          title="View Profile"
                        >
                          <FiEye size={18} />
                        </Link>
                        
                        {req.status === 'SENT_TO_USER' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRespond(req._id, 'ACCEPTED')}
                              className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                              title="Accept"
                            >
                              <FiCheck size={18} />
                            </button>
                            <button
                              onClick={() => handleRespond(req._id, 'REJECTED')}
                              className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                              title="Reject"
                            >
                              <FiX size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Sent Requests */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentRequests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
              <FiSend className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No sent requests</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">When you send a request, it will appear here</p>
              <Link
                href="/user/profiles"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition"
              >
                Browse Profiles →
              </Link>
            </div>
          ) : (
            sentRequests.map((req) => {
              const status = getStatusConfig(req.status);
              const StatusIcon = status.icon;
              
              return (
                <div key={req._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition">
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        {/* Receiver Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 flex items-center justify-center text-xl">
                            {req.receiverName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white text-base">
                              {req.receiverName}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                              <FiUser size={12} />
                              {req.receiverId?.age || '?'} yrs • {req.receiverId?.city || 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Message */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-3">
                          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                            "{req.message}"
                          </p>
                        </div>
                        
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                            <StatusIcon size={12} />
                            {status.label}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <FiCalendar size={12} />
                            Sent {formatDate(req.createdAt)}
                          </span>
                        </div>

                        {/* Admin Note */}
                        {req.adminNote && (
                          <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-xs text-gray-500 dark:text-gray-400 border-l-2 border-amber-500">
                            <span className="font-medium">Admin Note:</span> {req.adminNote}
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/user/profile/${req.receiverId?._id || req.receiverId}`}
                          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                          title="View Profile"
                        >
                          <FiEye size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Send Message to {selectedRequest.senderName}
              </h3>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                placeholder="Write your message..."
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('Message sent!');
                    setShowMessageModal(false);
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}