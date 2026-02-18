import z from 'zod';

export const loginSchema = z.object({
  email: z.email().describe('Email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.email().describe('Email address'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .refine((val) => val.trim() !== '', 'Name cannot be empty or just spaces'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CUSTOMER', 'PROVIDER', 'ADMIN']).default('CUSTOMER'),
});
