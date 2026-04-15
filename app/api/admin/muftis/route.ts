// app/api/admin/muftis/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { deleteCloudinaryImage } from '@/lib/cloudinary';
import bcrypt from 'bcryptjs';

// GET - Fetch all muftis
// app/api/admin/muftis/route.ts - GET method
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // ✅ Select all fields including qualification and experience
    const muftis = await User.find({ role: 'MUFTI' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    // Calculate approved requests count for each mufti
    const RistaRequest = (await import('@/models/RistaRequest')).default;
    const muftisWithStats = await Promise.all(muftis.map(async (mufti) => {
      const approvedCount = await RistaRequest.countDocuments({ 
        reviewedBy: mufti._id,
        status: 'ACCEPTED'
      });
      
      // ✅ Return all fields including qualification and experience
      return {
        _id: mufti._id,
        name: mufti.name,
        email: mufti.email,
        phone: mufti.phone || '',
        city: mufti.city || '',
        qualification: mufti.qualification || '',
        experience: mufti.experience || '',
        role: mufti.role,
        isVerified: mufti.isVerified,
        createdAt: mufti.createdAt,
        updatedAt: mufti.updatedAt,
        approvedRequests: approvedCount
      };
    }));
    
    return NextResponse.json({
      success: true,
      muftis: muftisWithStats
    });
    
  } catch (error) {
    console.error('Error fetching muftis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch muftis' },
      { status: 500 }
    );
  }
}
// POST - Create new mufti
export async function POST(request: Request) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { name, email, password, phone, city, qualification, experience } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email and password are required' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }
    
    // ✅ Create mufti WITHOUT manually hashing password
    // The pre-save hook in User model will hash it automatically
    const mufti = await User.create({
      name,
      email,
      password: password, // Send plain password, model will hash it
      phone: phone || '',
      city: city || '',
      qualification: qualification || '',
      experience: experience || '',
      role: 'MUFTI',
      isVerified: true,
      provider: 'email'
    });
    
    return NextResponse.json({
      success: true,
      message: 'Mufti created successfully',
      mufti: {
        id: mufti._id,
        name: mufti.name,
        email: mufti.email,
        role: mufti.role
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating mufti:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create mufti' },
      { status: 500 }
    );
  }
}

// PUT - Update mufti
export async function PUT(request: Request) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const muftiId = searchParams.get('muftiId');
    
    if (!muftiId) {
      return NextResponse.json(
        { success: false, error: 'Mufti ID required' },
        { status: 400 }
      );
    }
    
    const { name, email, phone, city, qualification, experience } = await request.json();
    
    const updatedMufti = await User.findByIdAndUpdate(
      muftiId,
      {
        name,
        email,
        phone,
        city,
        qualification,
        experience
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedMufti) {
      return NextResponse.json(
        { success: false, error: 'Mufti not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Mufti updated successfully',
      mufti: updatedMufti
    });
    
  } catch (error) {
    console.error('Error updating mufti:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update mufti' },
      { status: 500 }
    );
  }
}

// DELETE - Delete mufti
export async function DELETE(request: Request) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const muftiId = searchParams.get('muftiId');
    
    if (!muftiId) {
      return NextResponse.json(
        { success: false, error: 'Mufti ID required' },
        { status: 400 }
      );
    }
    const muftiToDelete = await User.findById(muftiId);
    if (muftiToDelete && muftiToDelete.imageUrl) {
      await deleteCloudinaryImage(muftiToDelete.imageUrl);
    }
    
    const deletedMufti = await User.findByIdAndDelete(muftiId);
    
    if (!deletedMufti) {
      return NextResponse.json(
        { success: false, error: 'Mufti not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Mufti deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting mufti:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete mufti' },
      { status: 500 }
    );
  }
}