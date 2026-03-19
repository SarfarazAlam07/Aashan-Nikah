// models/RistaRequest.ts
export interface RistaRequest {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  senderImage?: string;
  receiverImage?: string;
  message?: string;
  status: 'PENDING_ADMIN' | 'SENT_TO_USER' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

// Dummy data export
export const DUMMY_REQUESTS: RistaRequest[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    senderName: 'Mohammad Ali',
    receiverName: 'Fatima Khan',
    status: 'PENDING_ADMIN',
    message: 'Assalamu Alaikum, I am interested in your profile.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '3',
    senderName: 'Fatima Khan',
    receiverName: 'Aisha Begum',
    status: 'SENT_TO_USER',
    message: 'Would like to get to know you better.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    senderId: '4',
    receiverId: '1',
    senderName: 'Omar Farooq',
    receiverName: 'Fatima Khan',
    status: 'ACCEPTED',
    message: 'I liked your profile.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    senderId: '5',
    receiverId: '2',
    senderName: 'Hasan Raza',
    receiverName: 'Mohammad Ali',
    status: 'REJECTED',
    message: 'Interested in your profile.',
    adminNote: 'Profile not suitable',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];