// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const resolvedParams = await params; 
    const userId = resolvedParams.id;
    console.log('🔍 Fetching user:', userId);
    
    // Special case for super admin
    if (userId === 'super-admin') {
      return NextResponse.json({
        success: true,
        user: {
          id: 'super-admin',
          name: process.env.SUPER_ADMIN_NAME || 'Super Admin',
          email: process.env.SUPER_ADMIN_EMAIL,
          role: 'SUPER_ADMIN'
        }
      });
    }
    
    // Get token from header (optional - allow public viewing)
    const authHeader = request.headers.get('authorization');
    let token = null;
    let payload = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      payload = verifyToken(token);
    }
    
    // ✅ Allow viewing ANY profile - no restriction
    // Just log who is viewing
    if (payload) {
      console.log(`👤 User ${payload.id} viewing profile ${userId}`);
    } else {
      console.log(`👤 Guest viewing profile ${userId}`);
    }
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found:', userId);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ User found:', user.name);
    
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        phone: user.phone,
        gender: user.gender,
        city: user.city,
        district: user.district,
        caste: user.caste,
        profession: user.profession,
        education: user.education,
        bio: user.bio,
        imageUrl: user.imageUrl,
        motherTongue: user.motherTongue,
        maritalStatus: user.maritalStatus,
        height: user.height,
        postedBy: user.postedBy,
        familyDetails: user.familyDetails,
        partnerPreferences: user.partnerPreferences,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
   const resolvedParams = await params; 
   const userId = resolvedParams.id;
    
    // Get token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Only allow user to update their own profile
    if (payload.id !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Cannot edit another user\'s profile' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Remove fields that shouldn't be updated
    delete body._id;
    delete body.email;
    delete body.password;
    delete body.role;
    delete body.createdAt;
    delete body.updatedAt;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: body },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}