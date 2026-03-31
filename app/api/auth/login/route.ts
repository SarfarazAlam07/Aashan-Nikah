// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    if (email === process.env.SUPER_ADMIN_EMAIL) {
      if (password === process.env.SUPER_ADMIN_PASSWORD) {
        const payload = {
          id: 'super-admin', name: process.env.SUPER_ADMIN_NAME || 'Super Admin',
          email: process.env.SUPER_ADMIN_EMAIL!, role: 'SUPER_ADMIN'
        };
        const token = generateToken(payload);
        return NextResponse.json({ success: true, token, user: payload });
      } else {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const isValid = await user.comparePassword(password);
    if (!isValid) return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });

    const payload = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    const token = generateToken(payload);

    return NextResponse.json({
      success: true, token,
      user: {
        id: user._id.toString(), name: user.name, email: user.email,
        role: user.role, gender: user.gender, city: user.city, imageUrl: user.imageUrl
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}