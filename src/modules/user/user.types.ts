export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'SUSPENDED';

export type User = {
  id: string;
  email: string;
  name: string;
  // emailVerified: boolean;
  // emailVerificationAt: Date | null;
  role: UserRole;
  status: UserStatus;
  // address: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Pagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  next: number | null;
  prev: number | null;
};

export type GetUsersParams = {
  searchQuery?: string;
  role?: UserRole;
  status?: UserStatus;
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'email';
  sortType?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
};
