// actions/userActions.ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import RistaRequest from '@/models/RistaRequest';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { userProfileSchema, ristaRequestSchema } from '@/lib/validations/user';
import { redirect } from 'next/navigation';

// Complete profile after Google signup
export async function completeProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { error: 'Not authenticated' };
  }

  try {
    const data = {
      name: formData.get('name') as string,
      gender: formData.get('gender') as 'MALE' | 'FEMALE',
      age: parseInt(formData.get('age') as string),
      caste: formData.get('caste') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      district: formData.get('district') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      bio: formData.get('bio') as string,
      profession: formData.get('profession') as string,
      education: formData.get('education') as string,
    };

    const validated = userProfileSchema.parse(data);

    await connectDB();

    const existingUser = await User.findOne({ email: session.user.email });
    
    if (existingUser) {
      // Update existing user
      await User.updateOne(
        { email: session.user.email },
        { $set: { ...validated, isVerified: true } }
      );
    } else {
      // Create new user
      await User.create({
        email: session.user.email,
        imageUrl: session.user.image,
        ...validated,
        isVerified: true,
      });
    }

    revalidatePath('/user/dashboard');
    redirect('/user/dashboard');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: 'Failed to complete profile' };
  }
}

// Send Rista Request (goes to admin first)
export async function sendRistaRequest(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  try {
    const data = {
      receiverId: formData.get('receiverId') as string,
      senderMessage: formData.get('senderMessage') as string,
    };

    const validated = ristaRequestSchema.parse(data);

    await connectDB();

    // Check if receiver exists
    const receiver = await User.findById(validated.receiverId);
    if (!receiver) {
      return { error: 'User not found' };
    }

    // Check if request already exists
    const existingRequest = await RistaRequest.findOne({
      senderId: session.user.id,
      receiverId: validated.receiverId,
    });

    if (existingRequest) {
      return { error: 'Request already sent to this user' };
    }

    // Create request with PENDING_ADMIN status
    await RistaRequest.create({
      senderId: session.user.id,
      receiverId: validated.receiverId,
      senderMessage: validated.senderMessage,
      status: 'PENDING_ADMIN',
    });

    revalidatePath('/user/requests');
    return { success: 'Rista request sent to admin for review' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: 'Failed to send request' };
  }
}

// Get user's received requests
export async function getReceivedRequests() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return [];
  }

  await connectDB();

  const requests = await RistaRequest.find({
    receiverId: session.user.id,
    status: 'SENT_TO_USER', // Only show admin-approved requests
  })
    .populate('senderId', 'name age city district profession education imageUrl')
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(requests));
}

// Get user's sent requests
export async function getSentRequests() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return [];
  }

  await connectDB();

  const requests = await RistaRequest.find({
    senderId: session.user.id,
  })
    .populate('receiverId', 'name age city district profession education imageUrl')
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(requests));
}

// Accept/Reject received request
export async function respondToRequest(requestId: string, action: 'ACCEPTED' | 'REJECTED') {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  await connectDB();

  const request = await RistaRequest.findById(requestId);
  
  if (!request || request.receiverId.toString() !== session.user.id) {
    return { error: 'Request not found' };
  }

  if (request.status !== 'SENT_TO_USER') {
    return { error: 'Cannot respond to this request' };
  }

  request.status = action;
  await request.save();

  revalidatePath('/user/requests');
  return { success: `Request ${action.toLowerCase()}` };
}

// Get visible profiles (exclude own, opposite gender by default)
export async function getProfiles(filters?: { gender?: string; city?: string; minAge?: number; maxAge?: number }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return [];
  }

  await connectDB();

  const currentUser = await User.findById(session.user.id);
  
  // Build query
  const query: any = {
    _id: { $ne: session.user.id },
    role: 'USER',
    isVerified: true,
  };

  // By default show opposite gender
  if (!filters?.gender) {
    query.gender = currentUser?.gender === 'MALE' ? 'FEMALE' : 'MALE';
  } else {
    query.gender = filters.gender;
  }

  if (filters?.city) {
    query.city = new RegExp(filters.city, 'i');
  }

  if (filters?.minAge || filters?.maxAge) {
    query.age = {};
    if (filters.minAge) query.age.$gte = filters.minAge;
    if (filters.maxAge) query.age.$lte = filters.maxAge;
  }

  const users = await User.find(query)
    .select('-phoneNumber -email -role') // Exclude sensitive info
    .limit(50)
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(users));
}