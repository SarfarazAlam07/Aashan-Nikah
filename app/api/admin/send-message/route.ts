// app/api/admin/send-message/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Notification from '@/models/Notification';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(authHeader.substring(7));
    if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'MUFTI')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId, message } = await request.json();

    await Notification.create({
      userId,
      title: 'Admin Message 📢',
      message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}