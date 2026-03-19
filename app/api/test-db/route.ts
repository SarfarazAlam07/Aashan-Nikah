// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';

// GET - Test connection, show stats, and list users
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // If action is 'users', return all users
    if (action === 'users') {
      const users = await User.find({}).select('-__v').limit(10);
      return NextResponse.json({
        success: true,
        count: users.length,
        users
      });
    }
    
    // Default: return database stats
    const stats = await mongoose.connection.db.stats();
    const collections = await mongoose.connection.db.listCollections().toArray();
    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: '✅ MongoDB connected successfully!',
      database: {
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        readyState: mongoose.connection.readyState
      },
      stats: {
        collections: collections.length,
        users: userCount,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize
      }
    });
    
  } catch (error) {
    console.error('MongoDB error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to connect to MongoDB',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Create new user with password
export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    console.log('📝 Creating user with data:', {
      name: body.name,
      email: body.email,
      hasPassword: !!body.password,
      provider: body.provider,
      gender: body.gender
    });
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json({
        success: false,
        error: 'Name and email are required'
      }, { status: 400 });
    }

    // Gender validation - sirf Male/Female
    if (body.gender && !['male', 'female'].includes(body.gender)) {
      return NextResponse.json({
        success: false,
        error: 'Gender must be either male or female'
      }, { status: 400 });
    }

    // Password validation for email provider
    if (body.provider === 'email' && !body.password) {
      return NextResponse.json({
        success: false,
        error: 'Password is required'
      }, { status: 400 });
    }

    if (body.provider === 'email' && body.password.length < 6) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 6 characters'
      }, { status: 400 });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User already exists with this email'
      }, { status: 400 });
    }
    
    // Create new user with password
    const userData: any = {
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      age: body.age || null,
      gender: body.gender || '', // Sirf male/female aayega
      city: body.city || '',
      district: body.district || 'Saran',
      caste: body.caste || '',
      profession: body.profession || '',
      education: body.education || '',
      bio: body.bio || '',
      provider: body.provider || 'email',
      role: body.email === 'admin@nikah.com' ? 'admin' : 'user',
      isVerified: false
    };

    // Add password only for email provider
    if (body.provider === 'email' && body.password) {
      userData.password = body.password;
    }
    
    console.log('💾 Saving user to database...');
    const user = await User.create(userData);
    console.log('✅ User saved with ID:', user._id);
    
    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
      gender: user.gender,
      city: user.city,
      createdAt: user.createdAt
    };
    
    return NextResponse.json({
      success: true,
      message: '✅ User created successfully',
      user: userResponse
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Error creating user:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT - Update user
export async function PUT(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Gender validation for update
    if (body.gender && !['male', 'female'].includes(body.gender)) {
      return NextResponse.json({
        success: false,
        error: 'Gender must be either male or female'
      }, { status: 400 });
    }
    
    const user = await User.findOneAndUpdate(
      { email },
      { ...body },
      { new: true }
    ).select('-__v');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: '✅ User updated successfully',
      user
    });
    
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update user'
    }, { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }
    
    const user = await User.findOneAndDelete({ email });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: '✅ User deleted successfully',
      deletedUser: {
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete user'
    }, { status: 500 });
  }
}