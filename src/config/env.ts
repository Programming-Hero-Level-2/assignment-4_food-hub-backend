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
} as const;
