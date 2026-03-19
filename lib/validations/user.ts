// lib/validations/user.ts
import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.enum(['MALE', 'FEMALE']),
  age: z.number().min(18, 'Must be at least 18 years old').max(100),
  caste: z.string().min(1, 'Caste is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number (10 digits required)'),
  bio: z.string().max(500).optional(),
  profession: z.string().optional(),
  education: z.string().optional(),
});

export const ristaRequestSchema = z.object({
  receiverId: z.string().length(24, 'Invalid user ID'),
  senderMessage: z.string().max(200).optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type RistaRequestInput = z.infer<typeof ristaRequestSchema>;