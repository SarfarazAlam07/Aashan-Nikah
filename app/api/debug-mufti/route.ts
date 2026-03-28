// app/api/debug-mufti/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'test@gmail.com';
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Test password directly
    const testPassword = 'test123';
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    return NextResponse.json({
      email: user.email,
      name: user.name,
      role: user.role,
      passwordExists: !!user.password,
      passwordLength: user.password?.length,
      passwordHash: user.password?.substring(0, 30) + '...',
      testPasswordValid: isValid,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 });
  }
}