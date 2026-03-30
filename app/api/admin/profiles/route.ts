// app/api/admin/profiles/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload || (payload.role !== 'SUPER_ADMIN' && payload.role !== 'MUFTI')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    
    const gender = searchParams.get('gender');
    const city = searchParams.get('city');
    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');
    const caste = searchParams.get('caste');
    const search = searchParams.get('search');
    const verified = searchParams.get('verified');
    
    // ✅ Build query - show ALL users with role USER
    const query: any = {
      role: { $in: ['USER', 'user'] }  // Both cases
    };
    
    // Exclude current user
    if (payload.id !== 'super-admin') {
      query._id = { $ne: payload.id };
    }
    
    if (gender && gender !== 'all' && gender !== '') {
      query.gender = gender;
    }
    if (city && city !== '') {
      query.city = { $regex: city, $options: 'i' };
    }
    if (caste && caste !== '') {
      query.caste = { $regex: caste, $options: 'i' };
    }
    if (verified === 'true') {
      query.isVerified = true;
    } else if (verified === 'false') {
      query.isVerified = false;
    }
    
    if (search && search !== '') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { profession: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minAge && minAge !== '') {
      query.age = { $gte: parseInt(minAge) };
    }
    if (maxAge && maxAge !== '') {
      query.age = { ...query.age, $lte: parseInt(maxAge) };
    }
    
    console.log('🔍 Admin profiles query:', JSON.stringify(query));
    
    const profiles = await User.find(query)
      .select('name email phone age gender city district caste profession education bio imageUrl isVerified createdAt')
      .sort({ createdAt: -1 })
      .limit(100);
    
    console.log(`✅ Found ${profiles.length} profiles`);
    
    // Log each profile found
    profiles.forEach(p => {
      console.log(`   - ${p.name} (${p.role}) - Verified: ${p.isVerified}`);
    });
    
    return NextResponse.json({
      success: true,
      profiles
    });
    
  } catch (error) {
    console.error('Error fetching admin profiles:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch profiles' }, { status: 500 });
  }
}