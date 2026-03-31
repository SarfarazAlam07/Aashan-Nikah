// app/api/auth/google/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { access_token } = await request.json();

    if (!access_token) {
      return NextResponse.json({ success: false, error: 'No token provided' }, { status: 400 });
    }

    // 🔥 1. Fetch User Info from Google securely using the access_token 🔥
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    if (!googleRes.ok) {
      return NextResponse.json({ success: false, error: 'Failed to verify Google token' }, { status: 400 });
    }

    const payload = await googleRes.json();
    const { email, name, picture } = payload;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email not provided by Google' }, { status: 400 });
    }

    // 2. Check if user already exists
    let user = await User.findOne({ email });

    // 3. If user does not exist, create a new one
    if (!user) {
      user = await User.create({
        name: name,
        email: email,
        imageUrl: picture, // Google profile picture
        provider: 'google',
        role: 'USER',
        isVerified: false,
        // Default values for required database fields
        district: 'Saran', 
        gender: 'male', 
      });
    }

    // 4. Generate our Custom JWT Token
    const jwtPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    const token = generateToken(jwtPayload);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        imageUrl: user.imageUrl
      }
    });

  } catch (error: any) {
    console.error('🔥 GOOGLE AUTH CRASH DETAILS:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Google authentication failed',
      details: error.message 
    }, { status: 500 });
  }
}