// app/api/admin/requests/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import RistaRequest from '@/models/RistaRequest';
import { verifyToken } from '@/lib/jwt';

// GET - Fetch all requests
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

// PUT - Update request (Approve/Reject)
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
    
    const updatedRequest = await RistaRequest.findByIdAndUpdate(
      requestId,
      {
        status: status,
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
    
    return NextResponse.json({
      success: true,
      message: `Request updated successfully`,
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

// ✅ DELETE - Delete request
// app/api/admin/requests/[id]/route.ts


export async function DELETE(
  request: Request,
  context: any
) {
  try {
    console.log('=' .repeat(50));
    console.log('🗑️ DELETE REQUEST RECEIVED');
    console.log('=' .repeat(50));
    
    // Log everything
    console.log('📝 Context type:', typeof context);
    console.log('📝 Context:', JSON.stringify(context, null, 2));
    console.log('📝 Request URL:', request.url);
    
    // Try to get params in different ways
    let requestId = null;
    
    // Method 1: Check context.params
    if (context.params) {
      console.log('📝 context.params exists');
      if (typeof context.params === 'object') {
        console.log('📝 context.params keys:', Object.keys(context.params));
        requestId = context.params.id;
        console.log('📝 requestId from context.params.id:', requestId);
      }
    }
    
    // Method 2: If params is a Promise (Next.js 15)
    if (!requestId && context.params && typeof context.params.then === 'function') {
      console.log('📝 context.params is a Promise, awaiting...');
      const resolvedParams = await context.params;
      console.log('📝 Resolved params:', resolvedParams);
      requestId = resolvedParams.id;
    }
    
    // Method 3: Try to extract from URL path
    if (!requestId) {
      const urlParts = request.url.split('/');
      console.log('📝 URL parts:', urlParts);
      // URL pattern: .../api/admin/requests/[id]
      requestId = urlParts[urlParts.length - 1];
      console.log('📝 Extracted from URL:', requestId);
    }
    
    console.log('🎯 Final requestId:', requestId);
    
    if (!requestId) {
      console.log('❌ No requestId found');
      return NextResponse.json(
        { success: false, error: 'Request ID required' },
        { status: 400 }
      );
    }
    
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
    console.error('❌ Error details:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}