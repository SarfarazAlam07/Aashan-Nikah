// app/api/admin/create/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { secretKey, name, email, password } = await request.json();

    // Secret key check 
    const ADMIN_SECRET = process.env.ADMIN_CREATION_SECRET;
if (secretKey !== ADMIN_SECRET) {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}
    

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    const admin = await User.create({
      name,
      email,
      password: password, 
      role: 'SUPER_ADMIN',
      isVerified: true,
      provider: 'email'
    });

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create admin' },
      { status: 500 }
    );
  }
}