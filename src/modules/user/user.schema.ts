import z from 'zod';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../../constants';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN',
}

export type UserRoles = `${UserRole}` | UserRole;

export enum Status {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export const IDSchema = z.uuid({
  message: 'Invalid user ID format. Expected a UUID string.',
});

export type UserStatus = typeof Status;

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  emailVerified: z.boolean(),
  emailVerificationAt: z.date().nullable(),
  role: z.enum(UserRole),
  status: z.enum(Status),
  address: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = UserSchema.pick({
  name: true,
  email: true,
  role: true,
  status: true,
}).extend({
  password: z.string().min(6),
});

export const UpdateUserSchema = CreateUserSchema.partial()

export const UserQueryParamsSchema = z
  .object({
    searchQuery: z.string(),
    role: z.enum(UserRole),
    status: z.enum(Status),
    sortType: z.enum(['asc', 'desc']).default('desc'),
    sortBy: z
      .enum(['createdAt', 'updatedAt', 'name', 'email'])
      .default('createdAt'),
    pageSize: z
      .number()
      .int()
      .positive()
      .max(MAX_PAGE_SIZE)
      .default(DEFAULT_PAGE_SIZE),
    page: z.number().int().positive().default(1),
  })
  .partial();

export type User = z.infer<typeof UserSchema>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;

export type UserQueryParams = z.infer<typeof UserQueryParamsSchema>;
