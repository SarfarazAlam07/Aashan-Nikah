// app/admin/requests/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  FiMail, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiEye, 
  FiRefreshCw
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
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);

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
    
    console.log('📤 Sending approve request for:', requestId);
    
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
    
    console.log('📥 Response status:', response.status);
    
    // Get response text first for debugging
    const responseText = await response.text();
    console.log('📥 Response text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      throw new Error('Invalid response from server');
    }
    
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
    
    const responseText = await response.text();
    console.log('📥 Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error('Invalid response');
    }
    
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-white">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Rista Requests</h1>
          <p className="text-gray-400 mt-1">Review and manage rista requests</p>
        </div>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
        >
          <FiRefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total" value={stats.total} color="blue" />
        <StatCard label="Pending" value={stats.pending} color="yellow" />
        <StatCard label="Sent" value={stats.sent} color="blue" />
        <StatCard label="Accepted" value={stats.accepted} color="green" />
        <StatCard label="Rejected" value={stats.rejected} color="red" />
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'PENDING_ADMIN', 'SENT_TO_USER', 'ACCEPTED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                filterStatus === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
              {status !== 'all' && (
                <span className="ml-2 px-1.5 py-0.5 bg-gray-800 rounded-full text-xs">
                  {requests.filter(r => r.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <FiMail className="text-4xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request._id} className="bg-gray-800 rounded-lg p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                        {request.senderName.charAt(0)}
                      </div>
                      <span className="text-white font-medium">{request.senderName}</span>
                    </div>
                    <FiMail className="text-gray-600" size={14} />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white text-sm">
                        {request.receiverName.charAt(0)}
                      </div>
                      <span className="text-white font-medium">{request.receiverName}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-2">💬 "{request.message}"</p>
                  
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      request.status === 'PENDING_ADMIN' ? 'bg-yellow-500/20 text-yellow-400' :
                      request.status === 'SENT_TO_USER' ? 'bg-green-500/20 text-green-400' :
                      request.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {request.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {request.status === 'PENDING_ADMIN' && (
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowModal(true);
                      setAdminNote('');
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm"
                  >
                    Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Review Request</h3>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Sender</p>
                    <p className="text-white font-medium">{selectedRequest.senderName}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Receiver</p>
                    <p className="text-white font-medium">{selectedRequest.receiverName}</p>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-3">
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
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(selectedRequest._id)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedRequest._id)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
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
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    red: 'text-red-400'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}