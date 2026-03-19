// app/admin/requests/page.tsx
'use client';

import { useState } from 'react';
import { 
  FiMail, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock,
  FiEye,
  FiMessageCircle,
  FiUser,
  FiFilter
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// Dummy requests data
const DUMMY_REQUESTS = [
  {
    id: 1,
    sender: {
      name: 'Mohammad Ali',
      age: 27,
      city: 'Patna',
      caste: 'Syed'
    },
    receiver: {
      name: 'Fatima Khan',
      age: 24,
      city: 'Chhapra',
      caste: 'Sheikh'
    },
    message: 'Assalamu Alaikum, I am interested in your profile. Would like to get to know you better.',
    status: 'pending',
    createdAt: '2024-03-10T10:30:00',
  },
  {
    id: 2,
    sender: {
      name: 'Omar Farooq',
      age: 29,
      city: 'Gopalganj',
      caste: 'Pathan'
    },
    receiver: {
      name: 'Aisha Begum',
      age: 22,
      city: 'Siwan',
      caste: 'Ansari'
    },
    message: 'We seem to have similar interests. Would you be interested in talking?',
    status: 'pending',
    createdAt: '2024-03-09T15:45:00',
  },
  {
    id: 3,
    sender: {
      name: 'Hasan Raza',
      age: 31,
      city: 'Patna',
      caste: 'Sheikh'
    },
    receiver: {
      name: 'Zainab Ansari',
      age: 26,
      city: 'Muzaffarpur',
      caste: 'Ansari'
    },
    message: 'I liked your profile. Hope we can connect.',
    status: 'approved',
    createdAt: '2024-03-08T09:15:00',
    reviewedAt: '2024-03-08T11:20:00',
    adminNote: 'Profile verified, request approved'
  },
  {
    id: 4,
    sender: {
      name: 'Fatima Khan',
      age: 24,
      city: 'Chhapra',
      caste: 'Sheikh'
    },
    receiver: {
      name: 'Aisha Begum',
      age: 22,
      city: 'Siwan',
      caste: 'Ansari'
    },
    message: 'Interested in your profile.',
    status: 'rejected',
    createdAt: '2024-03-07T14:20:00',
    reviewedAt: '2024-03-07T16:30:00',
    adminNote: 'Profile information incomplete'
  },
];

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState(DUMMY_REQUESTS);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  const filteredRequests = requests.filter(r => 
    filterStatus === 'all' ? true : r.status === filterStatus
  );

  const handleApprove = (requestId: number) => {
    if (!adminNote.trim()) {
      toast.error('Please add an admin note');
      return;
    }

    toast.loading('Approving request...', { id: 'approve' });

    setTimeout(() => {
      setRequests(requests.map(req =>
        req.id === requestId
          ? { 
              ...req, 
              status: 'approved', 
              reviewedAt: new Date().toISOString(),
              adminNote 
            }
          : req
      ));
      setShowRequestModal(false);
      setAdminNote('');
      toast.success('Request approved successfully!', { id: 'approve' });
    }, 1000);
  };

  const handleReject = (requestId: number) => {
    if (!adminNote.trim()) {
      toast.error('Please add a reason for rejection');
      return;
    }

    toast.loading('Rejecting request...', { id: 'reject' });

    setTimeout(() => {
      setRequests(requests.map(req =>
        req.id === requestId
          ? { 
              ...req, 
              status: 'rejected', 
              reviewedAt: new Date().toISOString(),
              adminNote 
            }
          : req
      ));
      setShowRequestModal(false);
      setAdminNote('');
      toast.success('Request rejected', { id: 'reject' });
    }, 1000);
  };

  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    total: requests.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Rista Requests</h1>
        <p className="text-gray-400 mt-1">Review and manage rista requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={stats.total} color="blue" />
        <StatCard label="Pending" value={stats.pending} color="yellow" />
        <StatCard label="Approved" value={stats.approved} color="green" />
        <StatCard label="Rejected" value={stats.rejected} color="red" />
      </div>

      {/* Filter Tabs */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'pending' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'approved' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Approved ({stats.approved})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'rejected' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Rejected ({stats.rejected})
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All ({stats.total})
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <FiMail className="text-4xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No requests found</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    {/* Sender */}
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                        {request.sender.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{request.sender.name}</p>
                        <p className="text-xs text-gray-400">{request.sender.age} yrs • {request.sender.city}</p>
                      </div>
                    </div>

                    <FiMail className="text-gray-600" />

                    {/* Receiver */}
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white text-sm">
                        {request.receiver.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{request.receiver.name}</p>
                        <p className="text-xs text-gray-400">{request.receiver.age} yrs • {request.receiver.city}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mt-3 line-clamp-2">{request.message}</p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      request.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowRequestModal(true);
                      setAdminNote(request.adminNote || '');
                    }}
                    className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
                    title="View Details"
                  >
                    <FiEye size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Request Details Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Request Details</h3>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setAdminNote('');
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Request Info */}
              <div className="space-y-6">
                {/* Sender & Receiver */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-2">Sender</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedRequest.sender.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedRequest.sender.name}</p>
                        <p className="text-xs text-gray-400">{selectedRequest.sender.age} years</p>
                        <p className="text-xs text-gray-400">{selectedRequest.sender.city}</p>
                        <p className="text-xs text-gray-400">{selectedRequest.sender.caste}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-2">Receiver</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedRequest.receiver.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedRequest.receiver.name}</p>
                        <p className="text-xs text-gray-400">{selectedRequest.receiver.age} years</p>
                        <p className="text-xs text-gray-400">{selectedRequest.receiver.city}</p>
                        <p className="text-xs text-gray-400">{selectedRequest.receiver.caste}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2">Message</p>
                  <p className="text-white">{selectedRequest.message}</p>
                </div>

                {/* Admin Note */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2">Admin Note</p>
                  {selectedRequest.status === 'pending' ? (
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Add your notes here..."
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <p className="text-white">{selectedRequest.adminNote || 'No notes'}</p>
                  )}
                </div>

                {/* Status and Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Status</p>
                    <p className={`font-medium ${
                      selectedRequest.status === 'pending' ? 'text-yellow-400' :
                      selectedRequest.status === 'approved' ? 'text-green-400' :
                      'text-red-400'
                    }`}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Submitted</p>
                    <p className="text-white">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedRequest.reviewedAt && (
                    <div>
                      <p className="text-xs text-gray-400">Reviewed</p>
                      <p className="text-white">{new Date(selectedRequest.reviewedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                  >
                    <FiCheckCircle />
                    <span>Approve Request</span>
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
                  >
                    <FiXCircle />
                    <span>Reject Request</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: any) {
  const colors: any = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${colors[color].split(' ')[1]}`}>{value}</p>
    </div>
  );
}