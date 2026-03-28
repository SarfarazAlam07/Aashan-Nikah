// app/api/fix-mufti-password-final/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { email, newPassword, secretKey } = await request.json();
    
    if (secretKey !== 'FIX_MUFTI_2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Find the mufti
    const mufti = await User.findOne({ email });
    
    if (!mufti) {
      return NextResponse.json({ error: 'Mufti not found' }, { status: 404 });
    }
    
    console.log('Before fix - password hash:', mufti.password?.substring(0, 30));
    
    // Set plain password - pre-save hook will hash it correctly
    mufti.password = newPassword;
    
    // Save will trigger pre-save hook
    await mufti.save();
    
    // Fetch fresh to verify
    const freshMufti = await User.findOne({ email }).select('+password');
    
    console.log('After fix - new hash:', freshMufti.password?.substring(0, 30));
    
    // Test the password
    const bcrypt = require('bcryptjs');
    const isValid = await bcrypt.compare(newPassword, freshMufti.password);
    
    return NextResponse.json({
      success: true,
      verified: isValid,
      message: isValid ? 'Mufti password fixed successfully!' : 'Password fix failed',
      user: {
        id: freshMufti._id,
        name: freshMufti.name,
        email: freshMufti.email,
        role: freshMufti.role
      }
    });
    
  } catch (error) {
    console.error('Error fixing mufti:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fix mufti'
    }, { status: 500 });
  }
}