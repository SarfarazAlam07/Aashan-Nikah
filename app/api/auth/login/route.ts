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
    
    console.log('🔐 Login attempt for:', email);

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      );
    }

    // ✅ STEP 1: Check for SUPER ADMIN from .env
    if (email === process.env.SUPER_ADMIN_EMAIL) {
      console.log('🔍 Checking SUPER ADMIN credentials...');
      
      if (password === process.env.SUPER_ADMIN_PASSWORD) {
        console.log('✅ SUPER ADMIN login successful');
        
        const payload = {
          id: 'super-admin',
          name: process.env.SUPER_ADMIN_NAME || 'Super Admin',
          email: process.env.SUPER_ADMIN_EMAIL!,
          role: 'SUPER_ADMIN'
        };
        
        const token = generateToken(payload);
        console.log('📝 JWT generated for SUPER ADMIN');
        
        return NextResponse.json({
          success: true,
          token,
          user: payload
        });
      } else {
        console.log('❌ SUPER ADMIN password incorrect');
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }

    // ✅ STEP 2: Check for MUFTI or USER from database
    console.log('🔍 Checking database for user...');
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found in database');
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ User found, verifying password...');
    const isValid = await user.comparePassword(password);
    
    if (!isValid) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    console.log('✅ Login successful for:', user.role);

    const payload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    const token = generateToken(payload);
    console.log('📝 JWT generated for user');

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        city: user.city
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
