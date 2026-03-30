// app/api/admin/requests/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import RistaRequest from '@/models/RistaRequest';
import Notification from '@/models/Notification';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'MUFTI')) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    
    const requests = await RistaRequest.find({})
      .populate('senderId', 'name age city gender profession')
      .populate('receiverId', 'name age city gender profession')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'MUFTI')) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');
    if (!requestId) return NextResponse.json({ success: false, error: 'Request ID required' }, { status: 400 });
    
    const { status, adminNote } = await request.json();
    
    const updatedRequest = await RistaRequest.findByIdAndUpdate(
      requestId,
      { status: status, adminNote: adminNote, reviewedAt: new Date() },
      { new: true }
    );
    
    if (!updatedRequest) return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });

    // 🔥 NOTIFICATION LOGIC 🔥
    if (status === 'SENT_TO_USER') {
      await Notification.create({
        userId: updatedRequest.receiverId,
        title: 'New Rista Request 💌',
        message: `You have received a new verified request from ${updatedRequest.senderName}.`
      });
    } else if (status === 'REJECTED') {
      await Notification.create({
        userId: updatedRequest.senderId,
        title: 'Request Not Approved 🛑',
        message: `Your request to ${updatedRequest.receiverName} was declined by Admin. Reason: ${adminNote || 'Not specified'}`
      });
    }
    
    return NextResponse.json({ success: true, message: `Request updated successfully`, request: updatedRequest });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update request' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'MUFTI')) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    
    const url = new URL(request.url);
    const requestId = url.searchParams.get('requestId') || request.url.split('/').pop();
    if (!requestId) return NextResponse.json({ success: false, error: 'Request ID required' }, { status: 400 });
    
    const deletedRequest = await RistaRequest.findByIdAndDelete(requestId);
    if (!deletedRequest) return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete request' }, { status: 500 });
  }
}