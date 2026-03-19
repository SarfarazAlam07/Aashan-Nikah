// app/api/requests/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import RistaRequest from '@/models/RistaRequest';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'sent' or 'received'

    let query = {};
    if (type === 'sent') {
      query = { senderId: userId };
    } else if (type === 'received') {
      query = { receiverId: userId };
    }

    const requests = await RistaRequest.find(query)
      .populate('senderId', 'name age city')
      .populate('receiverId', 'name age city')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      requests
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { senderId, receiverId, message } = await request.json();

    // Get sender and receiver names
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

    // Create request
    const request_data = await RistaRequest.create({
      senderId,
      receiverId,
      senderName: sender.name,
      receiverName: receiver.name,
      message,
      status: 'PENDING_ADMIN'
    });

    return NextResponse.json({
      success: true,
      request: request_data
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');
    const { status, adminNote, reviewedBy } = await request.json();

    const updatedRequest = await RistaRequest.findByIdAndUpdate(
      requestId,
      {
        status,
        adminNote,
        reviewedBy,
        reviewedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      request: updatedRequest
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update request' },
      { status: 500 }
    );
  }
}