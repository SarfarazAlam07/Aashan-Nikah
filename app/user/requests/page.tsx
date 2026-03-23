// app/user/requests/page.tsx
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
  const [sentRequests, setSentRequests] = useState<Request[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Request[]>([]);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    const token = localStorage.getItem('token');
    
    try {
      const [receivedRes, sentRes] = await Promise.all([
        fetch(`/api/requests?userId=${parsedUser.id}&type=received`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/requests?userId=${parsedUser.id}&type=sent`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const receivedData = await receivedRes.json();
      const sentData = await sentRes.json();
      
      if (receivedData.success) setReceivedRequests(receivedData.requests);
      if (sentData.success) setSentRequests(sentData.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

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
        fetchRequests();
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
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: FiClock, label: 'Pending Admin' };
      case 'SENT_TO_USER':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: FiSend, label: 'Sent to User' };
      case 'ACCEPTED':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: FiCheckCircle, label: 'Accepted' };
      case 'REJECTED':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: FiXCircle, label: 'Rejected' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: FiAlertCircle, label: status };
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Requests</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('received')}
            className={`pb-4 px-1 font-medium text-sm border-b-2 transition ${
              activeTab === 'received'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Received ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`pb-4 px-1 font-medium text-sm border-b-2 transition ${
              activeTab === 'sent'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
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
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No received requests
            </div>
          ) : (
            receivedRequests.map((req) => {
              const status = getStatusConfig(req.status);
              const StatusIcon = status.icon;
              
              return (
                <div key={req._id} className="bg-white rounded-lg shadow p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">
                          {req.senderName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{req.senderName}</h3>
                          <p className="text-xs text-gray-500">
                            {req.senderId?.age || '?'} yrs • {req.senderId?.city || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{req.message}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.bg} ${status.text}`}>
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(req.createdAt)}</span>
                      </div>
                    </div>
                    
                    {/* ✅ Actions: View + Accept/Reject */}
                    <div className="flex gap-2">
                      <Link
                        href={`/user/profile/${req.senderId?._id || req.senderId}`}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                        title="View Profile"
                      >
                        <FiEye size={18} />
                      </Link>
                      
                      {req.status === 'SENT_TO_USER' && (
                        <>
                          <button
                            onClick={() => handleRespond(req._id, 'ACCEPTED')}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                            title="Accept"
                          >
                            <FiCheck size={18} />
                          </button>
                          <button
                            onClick={() => handleRespond(req._id, 'REJECTED')}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                            title="Reject"
                          >
                            <FiX size={18} />
                          </button>
                        </>
                      )}
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
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No sent requests
            </div>
          ) : (
            sentRequests.map((req) => {
              const status = getStatusConfig(req.status);
              const StatusIcon = status.icon;
              
              return (
                <div key={req._id} className="bg-white rounded-lg shadow p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">
                          {req.receiverName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{req.receiverName}</h3>
                          <p className="text-xs text-gray-500">
                            {req.receiverId?.age || '?'} yrs • {req.receiverId?.city || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{req.message}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.bg} ${status.text}`}>
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(req.createdAt)}</span>
                      </div>
                    </div>
                    
                    {/* ✅ View button for sent requests as well */}
                    <div className="flex gap-2">
                      <Link
                        href={`/user/profile/${req.receiverId?._id || req.receiverId}`}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                        title="View Profile"
                      >
                        <FiEye size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}