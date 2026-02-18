export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type User = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  emailVerificationAt: Date | null;
  role: UserRole;
  status: UserStatus;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
};
