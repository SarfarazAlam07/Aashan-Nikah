// app/mufti/requests/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  FiMail, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiRefreshCw,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiCalendar,
  FiMessageSquare,
  FiStar,
  FiEye
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
  senderName: string;
  receiverName: string;
  message: string;
  status: string;
  adminNote?: string;
  createdAt: string;
}

export default function MuftiRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('PENDING_ADMIN');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  useEffect(() => {
    fetchRequests();
  }, []);

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

  const filteredRequests = requests.filter(r => 
    filterStatus === 'all' ? true : r.status === filterStatus
  );

  const stats = {
    pending: requests.filter(r => r.status === 'PENDING_ADMIN').length,
    sent: requests.filter(r => r.status === 'SENT_TO_USER').length,
    accepted: requests.filter(r => r.status === 'ACCEPTED').length,
    rejected: requests.filter(r => r.status === 'REJECTED').length,
    total: requests.length
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
        return { color: 'bg-gray-500/20 text-gray-400', label: status, icon: FiAlertCircle };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <FiStar className="text-white text-sm sm:text-lg" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                Rista Requests
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-0 sm:ml-12">
              Review and approve matrimony requests
            </p>
          </div>
          
          <button
            onClick={fetchRequests}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-dark-100 rounded-xl hover:bg-gray-200 dark:hover:bg-dark-100 transition text-sm"
          >
            <FiRefreshCw size={14} className="text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <div className="flex gap-2 sm:gap-3 min-w-max">
          <StatCard label="Pending" value={stats.pending} color="amber" />
          <StatCard label="Sent" value={stats.sent} color="blue" />
          <StatCard label="Accepted" value={stats.accepted} color="green" />
          <StatCard label="Rejected" value={stats.rejected} color="red" />
          <StatCard label="Total" value={stats.total} color="gray" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 p-1.5">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {['PENDING_ADMIN', 'SENT_TO_USER', 'ACCEPTED', 'REJECTED', 'all'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                filterStatus === status
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-100'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
              {status !== 'all' && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                  filterStatus === status
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 dark:bg-dark-100 text-gray-600 dark:text-gray-400'
                }`}>
                  {requests.filter(r => r.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="text-2xl text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">No requests found</p>
          <p className="text-xs text-gray-400 mt-1">All requests have been processed</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredRequests.map((request) => {
            const statusBadge = getStatusBadge(request.status);
            const StatusIcon = statusBadge.icon;
            const isExpanded = expandedRequest === request._id;
            
            return (
              <div 
                key={request._id} 
                className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <div className="p-4 sm:p-5">
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      {/* Sender & Receiver */}
                      <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-base flex-shrink-0">
                            {request.senderName.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base truncate">
                              {request.senderName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                              <FiUser size={10} />
                              {request.senderId?.age || '?'} yrs • {request.senderId?.city || 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-gray-400 dark:text-gray-500 flex-shrink-0">
                          <FiMail size={14} className="sm:hidden" />
                          <FiMail size={16} className="hidden sm:block" />
                        </div>
                        
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold text-sm sm:text-base flex-shrink-0">
                            {request.receiverName.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base truncate">
                              {request.receiverName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                              <FiUser size={10} />
                              {request.receiverId?.age || '?'} yrs • {request.receiverId?.city || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Message Preview */}
                      <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-2.5 sm:p-3 mb-3">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          💬 {request.message}
                        </p>
                      </div>
                      
                      {/* Status & Date */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ${statusBadge.color}`}>
                          <StatusIcon size={10} className="sm:w-3 sm:h-3" />
                          {statusBadge.label}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                          <FiCalendar size={10} />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3 sm:mt-0">
                      {request.status === 'PENDING_ADMIN' && (
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                            setAdminNote('');
                          }}
                          className="flex-1 sm:flex-none px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
                        >
                          Review
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedRequest(isExpanded ? null : request._id)}
                        className="p-2 bg-gray-100 dark:bg-dark-100 text-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-100 transition"
                      >
                        {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-3">
                          <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs mb-1">Sender Details</p>
                          <p className="text-gray-800 dark:text-white text-sm font-medium">{request.senderName}</p>
                          <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                            <span>{request.senderId?.age} years</span>
                            <span>•</span>
                            <span>{request.senderId?.city}</span>
                            <span>•</span>
                            <span className="capitalize">{request.senderId?.gender}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-3">
                          <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs mb-1">Receiver Details</p>
                          <p className="text-gray-800 dark:text-white text-sm font-medium">{request.receiverName}</p>
                          <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                            <span>{request.receiverId?.age} years</span>
                            <span>•</span>
                            <span>{request.receiverId?.city}</span>
                            <span>•</span>
                            <span className="capitalize">{request.receiverId?.gender}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Full Message */}
                      <div className="mt-3 bg-gray-50 dark:bg-dark-100 rounded-xl p-3">
                        <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs mb-1">Full Message</p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{request.message}</p>
                      </div>
                      
                      {request.adminNote && (
                        <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border-l-2 border-amber-500">
                          <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs mb-1">Previous Note</p>
                          <p className="text-amber-700 dark:text-amber-300 text-sm">{request.adminNote}</p>
                        </div>
                      )}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-200 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">Review Request</h3>
              
              <div className="space-y-4 mb-6">
                {/* Sender & Receiver Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-3">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Sender</p>
                    <p className="text-gray-800 dark:text-white font-semibold text-sm">{selectedRequest.senderName}</p>
                    <p className="text-xs text-gray-500 mt-1">{selectedRequest.senderId?.age} yrs • {selectedRequest.senderId?.city}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-3">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Receiver</p>
                    <p className="text-gray-800 dark:text-white font-semibold text-sm">{selectedRequest.receiverName}</p>
                    <p className="text-xs text-gray-500 mt-1">{selectedRequest.receiverId?.age} yrs • {selectedRequest.receiverId?.city}</p>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-3">
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Message</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{selectedRequest.message}</p>
                </div>
                
                {/* Admin Note Input */}
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2 font-medium">
                    Admin Note <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                    placeholder="Add your notes or reason for approval/rejection..."
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(selectedRequest._id)}
                  disabled={processing}
                  className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 shadow-sm"
                >
                  {processing ? 'Processing...' : '✓ Approve'}
                </button>
                <button
                  onClick={() => handleReject(selectedRequest._id)}
                  disabled={processing}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 shadow-sm"
                >
                  {processing ? 'Processing...' : '✗ Reject'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-200 dark:hover:bg-dark-100 transition-all duration-200"
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

// Stat Card Component
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: any = {
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    gray: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
  };

  return (
    <div className={`flex-shrink-0 w-[85px] sm:w-[100px] rounded-xl border ${colors[color]} p-2.5 sm:p-3 text-center`}>
      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-lg sm:text-xl font-bold mt-0.5 ${colors[color].split(' ')[1]}`}>{value}</p>
    </div>
  );
}