import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Notification from '@/models/Notification';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ success: false }, { status: 401 });

    const payload = verifyToken(authHeader.substring(7));
    if (!payload) return NextResponse.json({ success: false }, { status: 401 });

    const notifications = await Notification.find({ userId: payload.id })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ success: false }, { status: 401 });

    const payload = verifyToken(authHeader.substring(7));
    if (!payload) return NextResponse.json({ success: false }, { status: 401 });

    const { action } = await request.json();

    if (action === 'mark_read') {
      await Notification.updateMany({ userId: payload.id, isRead: false }, { isRead: true });
    } else if (action === 'clear_all') {
      await Notification.deleteMany({ userId: payload.id });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}