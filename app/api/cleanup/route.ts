// app/api/cleanup/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';

export async function DELETE() {
  try {
    await connectDB();
    
    // Delete all users
    const result = await User.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} users`
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to delete users'
    }, { status: 500 });
  }
}