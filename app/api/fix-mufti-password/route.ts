// app/api/fix-mufti-password/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { email, newPassword, confirmPassword } = await request.json();
    
    if (!email || !newPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password required' 
      });
    }
    
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'Passwords do not match' 
      });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    // Manually hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    // Verify the new password works
    const verify = await bcrypt.compare(newPassword, user.password);
    
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      verified: verify,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Fix password error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to reset password' 
    });
  }
}