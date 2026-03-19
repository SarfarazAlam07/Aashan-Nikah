// app/api/test-login/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'User or password not found' },
        { status: 404 }
      );
    }

    // Test password with bcrypt directly
    const isValid = await bcrypt.compare(password, user.password);

    // Also test with user method
    const isValidMethod = await user.comparePassword(password);

    return NextResponse.json({
      email: user.email,
      passwordExists: true,
      bcryptCompare: isValid,
      userMethodCompare: isValidMethod,
      passwordHash: user.password.substring(0, 30) + '...'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    );
  }
}