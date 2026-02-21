import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  CORS_ORIGIN: z.string(),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 chars'),
  BETTER_AUTH_URL: z.string().url('BETTER_AUTH_URL must be a valid URL'),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string().min(1, 'EMAIL_PASSWORD is required'),
  ADMIN_EMAIL: z.email('ADMIN_EMAIL must be a valid email'),
  ADMIN_PASSWORD: z.string().min(6, 'ADMIN_PASSWORD must be at least 6 chars'),
  ADMIN_NAME: z.string().min(1, 'ADMIN_NAME is required'),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables', env.error.format());
  process.exit(1);
}

export const ENV = {
  NODE_ENV: env.data.NODE_ENV,
  PORT: Number(env.data.PORT),
  DATABASE_URL: env.data.DATABASE_URL,
  JWT_SECRET: env.data.JWT_SECRET,
  CORS_ORIGIN: env.data.CORS_ORIGIN,
  BETTER_AUTH_SECRET: env.data.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: env.data.BETTER_AUTH_URL,
  EMAIL_USER: env.data.EMAIL_USER,
  EMAIL_PASSWORD: env.data.EMAIL_PASSWORD,
  ADMIN_EMAIL: env.data.ADMIN_EMAIL,
  ADMIN_PASSWORD: env.data.ADMIN_PASSWORD,
  ADMIN_NAME: env.data.ADMIN_NAME,
} as const;
