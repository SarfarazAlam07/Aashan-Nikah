// app/api/mufti/requests/route.ts
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
    
    // Check if user is MUFTI
    if (!payload || payload.role !== 'MUFTI') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Mufti role required.' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query: any = {};
    if (status === 'PENDING_ADMIN') {
      query.status = 'PENDING_ADMIN';
    }
    
    const requests = await RistaRequest.find(query)
      .populate('senderId', 'name age city gender profession')
      .populate('receiverId', 'name age city gender profession')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      requests
    });
    
  } catch (error) {
    console.error('Error fetching mufti requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

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
    
    if (!payload || payload.role !== 'MUFTI') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Mufti role required.' },
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
    
    const updatedRequest = await RistaRequest.findByIdAndUpdate(
      requestId,
      {
        status: status,
        adminNote: adminNote,
        reviewedBy: payload.id,
        reviewedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Request ${status.toLowerCase()} successfully`,
      request: updatedRequest
    });
    
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update request' },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
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
    
    if (!payload || payload.role !== 'MUFTI') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Mufti role required.' },
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
    
    const deletedRequest = await RistaRequest.findByIdAndDelete(requestId);
    
    if (!deletedRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Request deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete request' },
      { status: 500 }
    );
  }
}