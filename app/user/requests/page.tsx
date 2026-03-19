// app/user/requests/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiMail, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiUser, 
  FiMessageCircle,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiSend
} from 'react-icons/fi';
import { DUMMY_REQUESTS, RistaRequest } from '@/models/RistaRequest';

export default function RequestsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sentRequests, setSentRequests] = useState<RistaRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<RistaRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [selectedRequest, setSelectedRequest] = useState<RistaRequest | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/signin');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Filter requests based on current user
    const sent = DUMMY_REQUESTS.filter(r => r.senderId === parsedUser.id);
    const received = DUMMY_REQUESTS.filter(r => r.receiverId === parsedUser.id);
    
    setSentRequests(sent);
    setReceivedRequests(received);
  }, [router]);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'PENDING_ADMIN':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          icon: FiClock,
          label: 'Pending Admin'
        };
      case 'SENT_TO_USER':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          icon: FiSend,
          label: 'Sent to User'
        };
      case 'ACCEPTED':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          icon: FiCheckCircle,
          label: 'Accepted'
        };
      case 'REJECTED':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          icon: FiXCircle,
          label: 'Rejected'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          icon: FiAlertCircle,
          label: status
        };
    }
  };

  const handleRespond = (requestId: string, action: 'ACCEPTED' | 'REJECTED') => {
    // TODO: API call
    alert(`Request ${action.toLowerCase()}! (Demo)`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your rista requests
        </p>
      </div>

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

      {/* Requests List */}
      <div className="space-y-4">
        {activeTab === 'received' && (
          <>
            {receivedRequests.length === 0 ? (
              <EmptyState 
                icon={FiMail}
                title="No received requests"
                message="When someone sends you a rista request, it will appear here"
              />
            ) : (
              receivedRequests.map((request) => {
                const status = getStatusConfig(request.status);
                const StatusIcon = status.icon;
                
                return (
                  <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-xl">
                            👤
                          </div>
                          
                          {/* Content */}
                          <div>
                            <h3 className="font-semibold text-gray-900">{request.senderName}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {request.message}
                            </p>
                            
                            {/* Meta Info */}
                            <div className="flex items-center space-x-4 mt-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                                <StatusIcon className="mr-1" size={12} />
                                {status.label}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDate(request.createdAt)}
                              </span>
                            </div>

                            {/* Admin Note (if any) */}
                            {request.adminNote && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                                <span className="font-medium">Admin Note:</span> {request.adminNote}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions - Only show for SENT_TO_USER status */}
                        {request.status === 'SENT_TO_USER' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRespond(request.id, 'ACCEPTED')}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                              title="Accept"
                            >
                              <FiCheck size={20} />
                            </button>
                            <button
                              onClick={() => handleRespond(request.id, 'REJECTED')}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                              title="Reject"
                            >
                              <FiX size={20} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {activeTab === 'sent' && (
          <>
            {sentRequests.length === 0 ? (
              <EmptyState 
                icon={FiSend}
                title="No sent requests"
                message="When you send a rista request, it will appear here"
                actionLabel="Browse Profiles"
                actionHref="/user/profiles"
              />
            ) : (
              sentRequests.map((request) => {
                const status = getStatusConfig(request.status);
                const StatusIcon = status.icon;
                
                return (
                  <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-xl">
                          👤
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{request.receiverName}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                              <StatusIcon className="mr-1" size={12} />
                              {status.label}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-2">
                            {request.message}
                          </p>
                          
                          {/* Meta Info */}
                          <div className="flex items-center space-x-4 mt-3">
                            <span className="text-xs text-gray-400">
                              Sent {formatDate(request.createdAt)}
                            </span>
                          </div>

                          {/* Admin Note (if any) */}
                          {request.adminNote && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                              <span className="font-medium">Admin Note:</span> {request.adminNote}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && selectedRequest && (
        <MessageModal
          request={selectedRequest}
          onClose={() => setShowMessageModal(false)}
          onSend={(message) => {
            // TODO: Send message
            setShowMessageModal(false);
          }}
        />
      )}
    </div>
  );
}

// Empty State Component
function EmptyState({ icon: Icon, title, message, actionLabel, actionHref }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="text-3xl text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{message}</p>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
}

// Message Modal Component
function MessageModal({ request, onClose, onSend }: any) {
  const [message, setMessage] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Send Message to {request.receiverName}
          </h3>
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onSend(message)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}