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
  qualification?: string;
  experience?: string;
  bio?: string;
  imageUrl?: string;
  role: 'SUPER_ADMIN' | 'MUFTI' | 'USER';
  isVerified: boolean;
  provider: 'email' | 'google';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,  // ✅ This creates index automatically
      lowercase: true, 
      trim: true 
    },
    password: { type: String, select: false },
    phone: { type: String, trim: true },
    age: { type: Number, min: 18, max: 100 },
    gender: { type: String, enum: ['male', 'female'] },
    city: { type: String, trim: true },
    district: { type: String, default: 'Saran' },
    caste: { type: String },
    profession: { type: String },
    education: { type: String },
    qualification: { type: String },
    experience: { type: String },
    bio: { type: String, maxlength: 500 },
    imageUrl: { type: String },
    role: { 
      type: String, 
      enum: ['SUPER_ADMIN', 'MUFTI', 'USER'], 
      default: 'USER'
    },
    isVerified: { type: Boolean, default: false },
    provider: { type: String, enum: ['email', 'google'], default: 'email' },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// ✅ Create indexes - Remove email index from here (already unique: true)
// Only create additional indexes for other fields
UserSchema.index({ city: 1, district: 1 });
UserSchema.index({ age: 1, gender: 1 });
UserSchema.index({ role: 1 });

// ✅ Check if model exists before creating
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;