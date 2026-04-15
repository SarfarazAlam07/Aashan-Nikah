// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { deleteCloudinaryImage } from '@/lib/cloudinary';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    let query = {};
    if (role === 'user') {
      query = { role: 'user' };
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    // 1. Verify User Logic
    if (action === 'verify') {
      const user = await User.findByIdAndUpdate(
        userId,
        { isVerified: true },
        { new: true }
      ).select('-password');

      return NextResponse.json({ success: true, user });
    }

    // 🔥 2. Reset Password Logic (NEW) 🔥
    if (action === 'reset_password') {
      const body = await request.json();
      const newPassword = body.newPassword;

      if (!newPassword) {
        return NextResponse.json({ success: false, error: 'New password required' }, { status: 400 });
      }

      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.findByIdAndUpdate(userId, { password: hashedPassword });
      
      return NextResponse.json({ success: true, message: 'Password reset successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('User PUT API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }
    const userToDelete = await User.findById(userId);
    
    if (!userToDelete) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Agar image hai, toh usey cloud se delete kar do
    if (userToDelete.imageUrl) {
      await deleteCloudinaryImage(userToDelete.imageUrl);
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}