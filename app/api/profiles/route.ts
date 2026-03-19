// app/api/profiles/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    
    // Filters
    const gender = searchParams.get('gender');
    const city = searchParams.get('city');
    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');
    const caste = searchParams.get('caste');
    const search = searchParams.get('search');
    
    // Build query
    const query: any = {
      role: 'user', // Sirf users show karo, admin nahi
      isVerified: true // Sirf verified profiles
    };
    
    // Apply filters
    if (gender && gender !== 'all') {
      query.gender = gender;
    }
    
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    
    if (caste) {
      query.caste = { $regex: caste, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { caste: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Age filter
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = parseInt(minAge);
      if (maxAge) query.age.$lte = parseInt(maxAge);
    }
    
    console.log('🔍 Profiles query:', JSON.stringify(query));
    
    // Get profiles (exclude sensitive info)
    const profiles = await User.find(query)
      .select('name age gender city district caste profession education bio imageUrl createdAt')
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json({
      success: true,
      count: profiles.length,
      profiles
    });
    
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch profiles'
    }, { status: 500 });
  }
}