// app/api/debug-password/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { email } = await request.json();

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password?.length,
      passwordHash: user.password?.substring(0, 20) + '...', // Sirf first 20 chars
      role: user.role
    });

  } catch (error) {
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 });
  }
}