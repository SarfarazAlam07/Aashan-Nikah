// app/api/user/stats/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import RistaRequest from '@/models/RistaRequest';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const userId = payload.id;

    // 1. Kitne request user ne bheje hain
    const sentRequests = await RistaRequest.countDocuments({ senderId: userId });
    
    // 2. Kitne request user ko mile hain (Jo Mufti ne approve kar diye hain)
    const receivedRequests = await RistaRequest.countDocuments({ 
        receiverId: userId, 
        status: 'SENT_TO_USER' 
    });
    
    // 3. Kitne Riste pakke hue (Matches)
    const matches = await RistaRequest.countDocuments({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: 'ACCEPTED'
    });

    // 4. Opposite gender ke kitne verified profiles available hain (Potential Matches)
    const currentUser = await User.findById(userId);
    const oppositeGender = currentUser?.gender === 'male' ? 'female' : 'male';
    const potentialMatches = await User.countDocuments({ 
        role: 'USER', 
        gender: oppositeGender, 
        isVerified: true 
    });

    return NextResponse.json({
      success: true,
      stats: {
        sentRequests,
        receivedRequests,
        matches,
        potentialMatches
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}