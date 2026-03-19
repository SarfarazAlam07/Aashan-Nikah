// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import RistaRequest from '@/models/RistaRequest';

export async function GET() {
  try {
    await connectDB();

    const [
      totalUsers,
      verifiedUsers,
      maleUsers,
      femaleUsers,
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', isVerified: true }),
      User.countDocuments({ role: 'user', gender: 'male' }),
      User.countDocuments({ role: 'user', gender: 'female' }),
      RistaRequest.countDocuments(),
      RistaRequest.countDocuments({ status: 'PENDING_ADMIN' }),
      RistaRequest.countDocuments({ status: 'ACCEPTED' }),
      RistaRequest.countDocuments({ status: 'REJECTED' })
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        pendingUsers: totalUsers - verifiedUsers,
        maleUsers,
        femaleUsers,
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}