// lib/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Generate JWT Token
export function generateToken(payload: JWTPayload): string {
  console.log('🔐 Generating token for:', payload.email);
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

// Verify JWT Token
export function verifyToken(token: string): JWTPayload | null {
  try {
    console.log('🔍 Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log('✅ Token verified for:', decoded.email);
    return decoded;
  } catch (error) {
    console.error('❌ JWT verification failed:', error);
    return null;
  }
}

// Decode token without verification
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}