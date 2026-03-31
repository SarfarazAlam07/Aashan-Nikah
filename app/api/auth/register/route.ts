// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, password, phone, district, city, gender } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
    }

    const user = await User.create({
      name, email, password, phone: phone || '', city: city || '', district: district || 'Saran',
      gender: gender || '', provider: 'email',
      role: email === 'admin@nikah.com' ? 'SUPER_ADMIN' : 'USER',
      isVerified: false
    });

    // Generate token so user gets logged in immediately
    const payload = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    const token = generateToken(payload);

    return NextResponse.json({
      success: true,
      token,
      user: payload
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}