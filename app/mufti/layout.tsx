'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiMail, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiRefreshCw,
  FiUser,
  FiCalendar,
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp,
  FiStar
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Request {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    age: number;
    city: string;
    gender: string;
  };
  receiverId: {
    _id: string;
    name: string;
    age: number;
    city: string;
    gender: string;
  };
  message: string;
  status: string;
  adminNote?: string;
  createdAt: string;
}

export default function MuftiDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    pending: 0,
    total: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/signin');
      return;
    }
    
    const parsed = JSON.parse(userData);
    setUser(parsed);
    
    if (parsed.role !== 'MUFTI') {
      toast.error('Access Denied');
      router.push('/user/dashboard');
      return;
    }
    
    fetchRequests();
  }, [router]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests);
        const pending = data.requests.filter((r: any) => r.status === 'PENDING_ADMIN').length;
        setStats({
          pending: pending,
          total: data.requests.length
        });
      } else {
        toast.error(data.error || 'Failed to load');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    if (!adminNote.trim()) {
      toast.error('Please add a note');
      return;
    }

    setProcessing(true);
    const toastId = toast.loading('Approving request...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/requests?requestId=${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'SENT_TO_USER',
          adminNote: adminNote
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('Request approved!', { id: toastId });
        fetchRequests();
        setShowModal(false);
        setAdminNote('');
      } else {
        toast.error(data?.error || 'Failed to approve', { id: toastId });
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Network error', { id: toastId });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!adminNote.trim()) {
      toast.error('Please add a reason');
      return;
    }

    setProcessing(true);
    const toastId = toast.loading('Rejecting request...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/requests?requestId=${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'REJECTED',
          adminNote: adminNote
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('Request rejected', { id: toastId });
        fetchRequests();
        setShowModal(false);
        setAdminNote('');
      } else {
        toast.error(data?.error || 'Failed to reject', { id: toastId });
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      toast.error('Network error', { id: toastId });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING_ADMIN':
        return { color: 'bg-amber-500/20 text-amber-400', label: 'Pending Review', icon: FiClock };
      case 'SENT_TO_USER':
        return { color: 'bg-blue-500/20 text-blue-400', label: 'Sent to User', icon: FiMail };
      case 'ACCEPTED':
        return { color: 'bg-green-500/20 text-green-400', label: 'Accepted', icon: FiCheckCircle };
      case 'REJECTED':
        return { color: 'bg-red-500/20 text-red-400', label: 'Rejected', icon: FiXCircle };
      default:
        return { color: 'bg-gray-500/20 text-gray-400', label: status, icon: FiClock };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter only pending requests for dashboard
  const pendingRequests = requests.filter(r => r.status === 'PENDING_ADMIN');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white">
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-amber-100 mb-1">Assalamu Alaikum</p>
              <h1 className="text-2xl sm:text-3xl font-bold">Mufti {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="mt-2 text-amber-100 text-sm">Review and approve rista requests</p>
            </div>
            <div className="hidden sm:block">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FiStar className="text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Pending Requests</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
        </div>
        <div className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Processed</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-100 transition"
        >
          <FiRefreshCw size={14} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Requests List */}
      {pendingRequests.length === 0 ? (
        <div className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <FiCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No pending requests to review</p>
          <p className="text-sm text-gray-400 mt-2">All requests have been processed!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => {
            const statusBadge = getStatusBadge(request.status);
            const StatusIcon = statusBadge.icon;
            const isExpanded = expandedRequest === request._id;
            
            return (
              <div key={request._id} className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      {/* Sender & Receiver */}
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                            {request.senderId?.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="text-gray-800 dark:text-white font-medium">{request.senderId?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {request.senderId?.age} yrs • {request.senderId?.city}
                            </p>
                          </div>
                        </div>
                        
                        <FiMail className="text-gray-400" size={16} />
                        
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold">
                            {request.receiverId?.name?.charAt(0) || 'R'}
                          </div>
                          <div>
                            <p className="text-gray-800 dark:text-white font-medium">{request.receiverId?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {request.receiverId?.age} yrs • {request.receiverId?.city}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Message */}
                      <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-3 mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          💬 {request.message}
                        </p>
                      </div>
                      
                      {/* Status & Date */}
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                          <StatusIcon size={12} />
                          {statusBadge.label}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FiCalendar size={12} />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowModal(true);
                          setAdminNote('');
                        }}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => setExpandedRequest(isExpanded ? null : request._id)}
                        className="p-2 bg-gray-100 dark:bg-dark-100 text-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-100 transition"
                      >
                        {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-3">
                          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Sender Details</p>
                          <p className="text-gray-800 dark:text-white text-sm">{request.senderId?.name}</p>
                          <p className="text-gray-500 text-xs">{request.senderId?.age} years</p>
                          <p className="text-gray-500 text-xs">{request.senderId?.city}</p>
                          <p className="text-gray-500 text-xs capitalize">{request.senderId?.gender}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-3">
                          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Receiver Details</p>
                          <p className="text-gray-800 dark:text-white text-sm">{request.receiverId?.name}</p>
                          <p className="text-gray-500 text-xs">{request.receiverId?.age} years</p>
                          <p className="text-gray-500 text-xs">{request.receiverId?.city}</p>
                          <p className="text-gray-500 text-xs capitalize">{request.receiverId?.gender}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-200 rounded-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Review Request</h3>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-3">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Sender</p>
                    <p className="text-gray-800 dark:text-white font-medium">{selectedRequest.senderId?.name}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-3">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Receiver</p>
                    <p className="text-gray-800 dark:text-white font-medium">{selectedRequest.receiverId?.name}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-3">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Message</p>
                  <p className="text-gray-800 dark:text-white">{selectedRequest.message}</p>
                </div>
                
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Admin Note *</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                    placeholder="Add your notes or reason..."
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(selectedRequest._id)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedRequest._id)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-dark-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}