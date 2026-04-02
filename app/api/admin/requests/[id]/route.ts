// app/api/requests/[id]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import RistaRequest from '@/models/RistaRequest';
import Notification from '@/models/Notification';
import { verifyToken } from '@/lib/jwt';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized - No token' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
    
    // Handle params whether it's a Promise or standard object
    const resolvedParams = await params;
    const requestId = resolvedParams.id;  
    
    const { status } = await request.json();
    
    // Find the request
    const requestData = await RistaRequest.findById(requestId);
    
    if (!requestData) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }
    
    // Check if user is the receiver
    if (requestData.receiverId.toString() !== payload.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
    // Check if request is in correct status
    if (requestData.status !== 'SENT_TO_USER') {
      return NextResponse.json({ success: false, error: 'Cannot respond to this request' }, { status: 400 });
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

    // 🔥 NOTIFICATION LOGIC 🔥
    if (status === 'ACCEPTED') {
      await Notification.create({
        userId: requestData.senderId,
        title: 'Rista Accepted! 🎉',
        message: `${requestData.receiverName} has accepted your rista request. You can now view their contact details.`
      });
    } else if (status === 'REJECTED') {
      await Notification.create({
        userId: requestData.senderId,
        title: 'Rista Declined',
        message: `${requestData.receiverName} has respectfully declined your request.`
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `Request ${status.toLowerCase()} successfully`,
      request: updatedRequest
    });
    
  } catch (error) {
    console.error('❌ Error updating request:', error);
    return NextResponse.json({ success: false, error: 'Failed to update request' }, { status: 500 });
  }
}