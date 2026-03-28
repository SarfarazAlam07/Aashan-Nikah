// app/api/test-compare/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    console.log('🔍 Testing password comparison for:', email);
    
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    console.log('✅ User found:', user.name);
    console.log('📝 Role:', user.role);
    console.log('📝 Password hash exists:', !!user.password);
    
    // Method 1: Direct bcrypt compare
    const directCompare = await bcrypt.compare(password, user.password);
    console.log('🔐 Direct bcrypt.compare:', directCompare);
    
    // Method 2: Using model method
    let modelCompare = false;
    if (user.comparePassword) {
      modelCompare = await user.comparePassword(password);
      console.log('🔐 Model comparePassword:', modelCompare);
    } else {
      console.log('❌ comparePassword method not found on user object');
    }
    
    // Method 3: Try with fresh bcrypt hash of same password
    const salt = await bcrypt.genSalt(10);
    const freshHash = await bcrypt.hash(password, salt);
    const compareWithFresh = await bcrypt.compare(password, freshHash);
    console.log('🔐 Compare with fresh hash (control):', compareWithFresh);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      results: {
        directBcryptCompare: directCompare,
        modelComparePassword: modelCompare,
        controlComparison: compareWithFresh
      },
      passwordHashPreview: user.password?.substring(0, 30) + '...'
    });
    
  } catch (error) {
    console.error('Error in test-compare:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Test failed' 
    }, { status: 500 });
  }
}