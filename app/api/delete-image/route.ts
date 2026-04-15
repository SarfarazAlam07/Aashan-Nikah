import { NextResponse } from 'next/server';
import { deleteCloudinaryImage } from '@/lib/cloudinary';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(authHeader.substring(7));
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ success: false, error: 'Image URL required' }, { status: 400 });
    }

    const success = await deleteCloudinaryImage(imageUrl);
    
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error in delete-image API:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}