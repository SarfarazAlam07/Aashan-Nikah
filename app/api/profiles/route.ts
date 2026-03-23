// app/api/profiles/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Get current user from token
    const authHeader = request.headers.get('authorization');
    let currentUserId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyToken(token);
      if (payload) {
        currentUserId = payload.id;
      }
    }
    
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
      role: 'user', // Sirf users show karo
      isVerified: true // Sirf verified profiles
    };
    
    // Exclude current user
    if (currentUserId && currentUserId !== 'super-admin') {
      query._id = { $ne: currentUserId };
    }
    
    // Apply filters - REMOVE OPPOSITE GENDER FILTER
    if (gender && gender !== 'all' && gender !== '') {
      query.gender = gender;
    }
    // If no gender filter, show all genders (don't filter by opposite)
    
    if (city && city !== '') {
      query.city = { $regex: city, $options: 'i' };
    }
    
    if (caste && caste !== '') {
      query.caste = { $regex: caste, $options: 'i' };
    }
    
    if (search && search !== '') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { caste: { $regex: search, $options: 'i' } },
        { profession: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Age filter
    if (minAge && minAge !== '') {
      query.age = { ...query.age, $gte: parseInt(minAge) };
    }
    if (maxAge && maxAge !== '') {
      query.age = { ...query.age, $lte: parseInt(maxAge) };
    }
    
    console.log('🔍 Profiles query:', JSON.stringify(query, null, 2));
    
    // Get profiles (exclude sensitive info)
    const profiles = await User.find(query)
      .select('name age gender city district caste profession education bio imageUrl isVerified createdAt')
      .sort({ createdAt: -1 })
      .limit(100);
    
    console.log(`✅ Found ${profiles.length} profiles`);
    
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