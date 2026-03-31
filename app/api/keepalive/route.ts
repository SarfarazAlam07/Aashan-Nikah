// app/api/keepalive/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';

export async function GET() {
  try {
    // Ye DB se connection banayega taaki database bhi sleep mode me na jaye
    await connectDB();
    
    console.log('⏰ Keep-Alive Ping Received:', new Date().toISOString());
    
    return NextResponse.json({ 
      success: true, 
      message: 'App is awake and Database is connected!',
      time: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Keep-Alive Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to wake up' }, { status: 500 });
  }
}