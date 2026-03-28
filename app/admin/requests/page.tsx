'use client';

import { useState, useEffect } from 'react';
import { 
  FiMail, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiEye, 
  FiRefreshCw,
  FiTrash2,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiCalendar,
  FiMessageSquare
} from 'react-icons/fi';
import toast from 'react-hot-toast';

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
  message: string;
  status: string;
  adminNote?: string;
  createdAt: string;
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
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

  const handleDeleteRequest = async (requestId: string) => {
    const toastId = toast.loading('Deleting request...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Request deleted successfully!', { id: toastId });
        fetchRequests();
        setShowDeleteConfirm(false);
        setRequestToDelete(null);
      } else {
        toast.error(data.error || 'Failed to delete', { id: toastId });
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Network error', { id: toastId });
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
        return { color: 'bg-amber-500/20 text-amber-400', label: 'Pending', icon: FiClock };
      case 'SENT_TO_USER':
        return { color: 'bg-blue-500/20 text-blue-400', label: 'Sent', icon: FiMail };
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <FiMail className="text-white text-lg" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Rista Requests
              </h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                Manage all incoming requests
              </span>
              <span className="text-gray-600">|</span>
              <span className="text-amber-400 font-medium">{requests.length} total</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Summary */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 rounded-full border border-slate-700">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-xs text-gray-400">{stats.pending}</span>
              </div>
              <div className="w-px h-3 bg-slate-700"></div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-400">{stats.sent}</span>
              </div>
              <div className="w-px h-3 bg-slate-700"></div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-400">{stats.rejected}</span>
              </div>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={fetchRequests}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl hover:border-amber-500/50 transition-all duration-300 group"
            >
              <FiRefreshCw size={14} className="text-gray-400 group-hover:text-amber-400 transition-colors group-hover:rotate-180 duration-500" />
              <span className="text-sm text-gray-300 group-hover:text-white">Refresh</span>
            </button>
          </div>
        </div>
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard label="Total" value={stats.total} color="blue" />
        <StatCard label="Pending" value={stats.pending} color="amber" />
        <StatCard label="Sent" value={stats.sent} color="blue" />
        <StatCard label="Accepted" value={stats.accepted} color="green" />
        <StatCard label="Rejected" value={stats.rejected} color="red" />
      </div>

      {/* Filters - Mobile Dropdown */}
      <div className="sm:hidden">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 rounded-xl border border-slate-700"
        >
          <span className="text-white text-sm">
            Filter: {filterStatus === 'all' ? 'All' : filterStatus.replace('_', ' ')}
          </span>
          {mobileFiltersOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
        </button>
        
        {mobileFiltersOpen && (
          <div className="mt-2 bg-slate-800 rounded-xl border border-slate-700 p-2 space-y-1">
            {['all', 'PENDING_ADMIN', 'SENT_TO_USER', 'ACCEPTED', 'REJECTED'].map(status => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setMobileFiltersOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  filterStatus === status
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                {status === 'all' ? 'All Requests' : status.replace('_', ' ')}
                {status !== 'all' && (
                  <span className="float-right text-xs text-gray-500">
                    {requests.filter(r => r.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters - Desktop */}
      <div className="hidden sm:block bg-slate-800/50 rounded-xl border border-slate-700 p-2">
        <div className="flex gap-2 flex-wrap">
          {['all', 'PENDING_ADMIN', 'SENT_TO_USER', 'ACCEPTED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm transition whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
              {status !== 'all' && (
                <span className="ml-2 px-1.5 py-0.5 bg-slate-700 rounded-full text-xs">
                  {requests.filter(r => r.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-12 text-center">
          <FiMail className="text-4xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const statusBadge = getStatusBadge(request.status);
            const StatusIcon = statusBadge.icon;
            const isExpanded = expandedRequest === request._id;
            
            return (
              <div key={request._id} className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden hover:border-amber-500/30 transition">
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      {/* Sender & Receiver */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {request.senderName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{request.senderName}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <FiUser size={12} />
                              {request.senderId?.age} yrs • {request.senderId?.city}
                            </p>
                          </div>
                        </div>
                        
                        <FiMail className="text-gray-600" size={16} />
                        
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {request.receiverName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{request.receiverName}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <FiUser size={12} />
                              {request.receiverId?.age} yrs • {request.receiverId?.city}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Message */}
                      <div className="bg-slate-700/30 rounded-xl p-3 mb-3">
                        <p className="text-sm text-gray-300">
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
                      {request.status === 'PENDING_ADMIN' && (
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
                      )}
                      <button
                        onClick={() => {
                          setRequestToDelete(request._id);
                          setShowDeleteConfirm(true);
                        }}
                        className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition"
                        title="Delete Request"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      <button
                        onClick={() => setExpandedRequest(isExpanded ? null : request._id)}
                        className="p-2 bg-slate-700/50 text-gray-400 rounded-lg hover:bg-slate-700 transition"
                      >
                        {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-700/30 rounded-xl p-3">
                          <p className="text-gray-400 text-xs mb-1">Sender Details</p>
                          <p className="text-white text-sm">{request.senderName}</p>
                          <p className="text-gray-400 text-xs">{request.senderId?.age} years</p>
                          <p className="text-gray-400 text-xs">{request.senderId?.city}</p>
                        </div>
                        <div className="bg-slate-700/30 rounded-xl p-3">
                          <p className="text-gray-400 text-xs mb-1">Receiver Details</p>
                          <p className="text-white text-sm">{request.receiverName}</p>
                          <p className="text-gray-400 text-xs">{request.receiverId?.age} years</p>
                          <p className="text-gray-400 text-xs">{request.receiverId?.city}</p>
                        </div>
                      </div>
                      
                      {request.adminNote && (
                        <div className="mt-3 bg-amber-500/10 rounded-xl p-3 border-l-2 border-amber-500">
                          <p className="text-gray-400 text-xs mb-1">Admin Note</p>
                          <p className="text-amber-300 text-sm">{request.adminNote}</p>
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
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Review Request</h3>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <p className="text-gray-400 text-xs">Sender</p>
                    <p className="text-white font-medium">{selectedRequest.senderName}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <p className="text-gray-400 text-xs">Receiver</p>
                    <p className="text-white font-medium">{selectedRequest.receiverName}</p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-3">
                  <p className="text-gray-400 text-xs">Message</p>
                  <p className="text-white">{selectedRequest.message}</p>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Admin Note *</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                    placeholder="Add your notes..."
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500"
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
                  className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-sm w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="text-red-400 text-2xl" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Delete Request</h3>
              <p className="text-gray-400 text-center text-sm mb-6">
                Are you sure you want to delete this rista request?<br />
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => requestToDelete && handleDeleteRequest(requestToDelete)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setRequestToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
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

function StatCard({ label, value, color }: any) {
  const colors: any = {
    blue: 'text-blue-400',
    amber: 'text-amber-400',
    green: 'text-green-400',
    red: 'text-red-400'
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3 sm:p-4">
      <p className="text-gray-400 text-xs sm:text-sm">{label}</p>
      <p className={`text-xl sm:text-2xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}