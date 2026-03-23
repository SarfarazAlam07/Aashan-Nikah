// app/api/admin/requests/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import RistaRequest from '@/models/RistaRequest';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
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
    
    if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'MUFTI')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const requests = await RistaRequest.find({})
      .populate('senderId', 'name age city gender profession')
      .populate('receiverId', 'name age city gender profession')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      requests
    });
    
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

// app/api/admin/requests/route.ts
export async function PUT(request: Request) {
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
    
    if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'MUFTI')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');
    
    if (!requestId) {
      return NextResponse.json(
        { success: false, error: 'Request ID required' },
        { status: 400 }
      );
    }
    
    const { status, adminNote } = await request.json();
    
    console.log('📝 Admin updating request:', requestId);
    console.log('📝 New status:', status);
    
    // ✅ IMPORTANT: Update status to SENT_TO_USER
    const updatedRequest = await RistaRequest.findByIdAndUpdate(
      requestId,
      {
        status: 'SENT_TO_USER',  // Make sure this is set correctly
        adminNote: adminNote,
        reviewedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedRequest) {
      console.log('❌ Request not found');
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Request updated. New status:', updatedRequest.status);
    console.log('✅ Receiver ID:', updatedRequest.receiverId);
    
    return NextResponse.json({
      success: true,
      message: `Request approved and sent to user`,
      request: updatedRequest
    });
    
  } catch (error) {
    console.error('❌ Error updating request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update request' },
      { status: 500 }
    );
  }
}