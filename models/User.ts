// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female';
  city?: string;
  district: string;
  caste?: string;
  profession?: string;
  education?: string;
  bio?: string;
  imageUrl?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  provider: 'email' | 'google';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    phone: { type: String, trim: true },
    age: { type: Number, min: 18, max: 100 },
    gender: { type: String, enum: ['male', 'female'] },
    city: { type: String, trim: true },
    district: { type: String, default: 'Saran' },
    caste: { type: String },
    profession: { type: String },
    education: { type: String },
    bio: { type: String, maxlength: 500 },
    imageUrl: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    provider: { type: String, enum: ['email', 'google'], default: 'email' },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('✅ Password hashed successfully');
    next();
  } catch (error: any) {
    console.error('❌ Error hashing password:', error);
    next(error);
  }
});

// Compare password method - SIRF EK BAAR
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    console.log('🔍 Comparing passwords...');
    console.log('Stored hash exists:', !!this.password);
    
    if (!this.password) {
      console.log('❌ No password stored');
      return false;
    }
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('✅ Password match:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('❌ Password comparison error:', error);
    return false;
  }
};

// Create indexes
UserSchema.index({ email: 1 });
UserSchema.index({ city: 1, district: 1 });
UserSchema.index({ age: 1, gender: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);