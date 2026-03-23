// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { name, email, password, phone, district, city, gender } = await request.json();

    console.log('📝 Registration attempt:', { name, email, district, city });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // ✅ Create new user with correct role format
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      city: city || '',
      district: district || 'Saran',
      gender: gender || '',
      provider: 'email',
      role: email === 'admin@nikah.com' ? 'SUPER_ADMIN' : 'USER',  // ✅ Uppercase
      isVerified: false
    });

    console.log('✅ User created:', user._id);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}