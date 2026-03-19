// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    console.log('🔐 Login attempt for:', email);

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    console.log('User found:', !!user);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if password exists
    if (!user.password) {
      console.log('No password stored for user');
      return NextResponse.json(
        { success: false, error: 'Password not set for this account' },
        { status: 400 }
      );
    }

    // Compare password using bcrypt directly
    const isValid = await bcrypt.compare(password, user.password);
    
    console.log('Password valid:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Return user without password
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      city: user.city
    };

    return NextResponse.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}