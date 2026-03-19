// app/api/test-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    mongodb_uri: process.env.MONGODB_URI ? '✅ Set' : '❌ Not set',
    nextauth_secret: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not set',
    nextauth_url: process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Not set',
    node_env: process.env.NODE_ENV,
    cwd: process.cwd(),
  });
}