// actions/adminActions.ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import RistaRequest from '@/models/RistaRequest';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ObjectId } from 'mongoose';

// Admin check helper
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN';
}

// Get all users (admin only)
export async function getAllUsers() {
  if (!await isAdmin()) {
    throw new Error('Unauthorized');
  }

  await connectDB();
  
  const users = await User.find({})
    .select('+phoneNumber +email') // Include sensitive data for admin
    .sort({ createdAt: -1 });
  
  return JSON.parse(JSON.stringify(users));
}

// Delete user (admin only)
export async function deleteUser(userId: string) {
  if (!await isAdmin()) {
    return { error: 'Unauthorized' };
  }

  try {
    await connectDB();
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    // Delete all related rista requests
    await RistaRequest.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }]
    });

    revalidatePath('/admin/users');
    revalidatePath('/admin/requests');
    return { success: 'User deleted successfully' };
  } catch (error) {
    return { error: 'Failed to delete user' };
  }
}

// Verify user (admin only)
export async function verifyUser(userId: string) {
  if (!await isAdmin()) {
    return { error: 'Unauthorized' };
  }

  try {
    await connectDB();
    
    await User.findByIdAndUpdate(userId, { isVerified: true });

    revalidatePath('/admin/users');
    return { success: 'User verified successfully' };
  } catch (error) {
    return { error: 'Failed to verify user' };
  }
}

// Get pending requests (admin only)
export async function getPendingRequests() {
  if (!await isAdmin()) {
    return [];
  }

  await connectDB();
  
  const requests = await RistaRequest.find({ status: 'PENDING_ADMIN' })
    .populate('senderId', 'name email phoneNumber age city district')
    .populate('receiverId', 'name email phoneNumber age city district')
    .sort({ createdAt: 1 });

  return JSON.parse(JSON.stringify(requests));
}

// Approve request (admin only)
export async function approveRequest(requestId: string, adminNote?: string) {
  if (!await isAdmin()) {
    return { error: 'Unauthorized' };
  }

  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    
    await RistaRequest.findByIdAndUpdate(requestId, {
      status: 'SENT_TO_USER',
      adminNote: adminNote || 'Approved by admin',
      reviewedBy: session?.user?.id,
      reviewedAt: new Date(),
    });

    revalidatePath('/admin/requests');
    return { success: 'Request approved and sent to user' };
  } catch (error) {
    return { error: 'Failed to approve request' };
  }
}

// Reject request (admin only)
export async function rejectRequest(requestId: string, adminNote: string) {
  if (!await isAdmin()) {
    return { error: 'Unauthorized' };
  }

  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    
    await RistaRequest.findByIdAndUpdate(requestId, {
      status: 'REJECTED',
      adminNote,
      reviewedBy: session?.user?.id,
      reviewedAt: new Date(),
    });

    revalidatePath('/admin/requests');
    return { success: 'Request rejected' };
  } catch (error) {
    return { error: 'Failed to reject request' };
  }
}

// Get dashboard stats (admin only)
export async function getAdminStats() {
  if (!await isAdmin()) {
    return {};
  }

  await connectDB();
  
  const totalUsers = await User.countDocuments();
  const verifiedUsers = await User.countDocuments({ isVerified: true });
  const maleUsers = await User.countDocuments({ gender: 'MALE' });
  const femaleUsers = await User.countDocuments({ gender: 'FEMALE' });
  const pendingRequests = await RistaRequest.countDocuments({ status: 'PENDING_ADMIN' });
  const totalRequests = await RistaRequest.countDocuments();

  return {
    totalUsers,
    verifiedUsers,
    maleUsers,
    femaleUsers,
    pendingRequests,
    totalRequests,
  };
}