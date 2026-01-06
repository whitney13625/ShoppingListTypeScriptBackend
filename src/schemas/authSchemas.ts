
import '../lib/zodSetup';
import { z } from 'zod';

const passwordSchema = z.string()
                        .min(8, 'Password must be at least 8 characters long')
                        .max(30, 'Password must be at most 30 characters long')
                        .regex(/[a-z]/, 'at least contain one lowercase letter')
                        .regex(/[A-Z]/, 'at least contain one uppercase letter')
                        .regex(/[0-9]/, 'at least contain one number')
                        .regex(/[@$!%*?&#]/, 'at least contain one special character');

// Category schema
export const RegisterSchema = z.object({
  email: z.email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: passwordSchema
}).openapi({ description: 'Register Data Object' });

export const LoginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
}).openapi({ description: 'Login Data Object' });

export const AuthResponseSchema = z.object({
  token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
}).openapi({ description: 'Authentication Response Object' });

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).openapi({ description: 'User Object' });

export type User = z.infer<typeof UserSchema>;