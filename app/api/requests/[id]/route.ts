// app/api/requests/[id]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import RistaRequest from '@/models/RistaRequest';
import { verifyToken } from '@/lib/jwt';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    const requestId = params.id;
    const { status } = await request.json();
    
    console.log('📝 User responding to request:', requestId);
    console.log('📝 User ID:', payload.id);
    console.log('📝 New status:', status);
    
    // Find the request
    const requestData = await RistaRequest.findById(requestId);
    
    if (!requestData) {
      console.log('❌ Request not found');
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the receiver
    if (requestData.receiverId.toString() !== payload.id) {
      console.log('❌ Unauthorized - User is not receiver');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Check if request is in correct status
    if (requestData.status !== 'SENT_TO_USER') {
      console.log('❌ Cannot respond - Status is:', requestData.status);
      return NextResponse.json(
        { success: false, error: 'Cannot respond to this request' },
        { status: 400 }
      );
    }
    
    // Update request
    const updatedRequest = await RistaRequest.findByIdAndUpdate(
      requestId,
      {
        status: status,
        reviewedAt: new Date()
      },
      { new: true }
    );
    
    console.log('✅ Request updated to:', status);
    
    return NextResponse.json({
      success: true,
      message: `Request ${status.toLowerCase()} successfully`,
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