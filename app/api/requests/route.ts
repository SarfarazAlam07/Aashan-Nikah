// app/api/requests/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import RistaRequest from '@/models/RistaRequest';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    console.log('🔐 Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No token' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    
    console.log('🔍 Fetching requests:', { userId, type });
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }
    
    let query: any = {};
    if (type === 'sent') {
      query = { senderId: userId };
    } else if (type === 'received') {
      query = { receiverId: userId };
    } else {
      // Default: show received requests
      query = { receiverId: userId };
    }
    
    const requests = await RistaRequest.find(query)
      .populate('senderId', 'name age city gender')
      .populate('receiverId', 'name age city gender')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`✅ Found ${requests.length} requests`);
    
    return NextResponse.json({
      success: true,
      requests: requests || []
    });
    
  } catch (error) {
    console.error('❌ Error fetching requests:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch requests',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const { senderId, receiverId, message } = await request.json();
    
    if (!senderId || !receiverId) {
      return NextResponse.json(
        { success: false, error: 'Sender and receiver required' },
        { status: 400 }
      );
    }
    
    // Check if sender matches token
    if (senderId !== payload.id) {
      return NextResponse.json(
        { success: false, error: 'Sender mismatch' },
        { status: 403 }
      );
    }
    
    // Import User model dynamically to avoid circular dependency
    const User = (await import('@/models/User')).default;
    
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ]);
    
    if (!sender || !receiver) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check for existing request
    const existing = await RistaRequest.findOne({ senderId, receiverId });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Request already sent' },
        { status: 400 }
      );
    }
    
    const newRequest = await RistaRequest.create({
      senderId,
      receiverId,
      senderName: sender.name,
      receiverName: receiver.name,
      message: message || 'I am interested in your profile.',
      status: 'PENDING_ADMIN'
    });
    
    return NextResponse.json({
      success: true,
      message: 'Request sent to admin',
      request: newRequest
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Error creating request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create request' },
      { status: 500 }
    );
  }
}