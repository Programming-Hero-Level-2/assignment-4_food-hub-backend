import bcrypt from 'bcryptjs';
import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../config/prisma';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../../constants';
import { ApiError } from '../../utils/ApiError';
import { CreateUserType } from './user.schema';
import { GetUsersParams, Pagination, User } from './user.types';

/**
 * Finds a user by their email address
 *
 * @param {string} email - The email address to search for
 * @returns {Promise<User | null>} The user object if found, null otherwise
 *
 * @example
 * const user = await findUserByEmail('john.doe@example.com');
 * if (user) {
 *   console.log('User found:', user.name);
 * }
 */
const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user ? user : null;
};

/**
 * Checks if a user exists in the database by email
 *
 * @param {string} email - The email address to check
 * @returns {Promise<boolean>} True if user exists, false otherwise
 *
 * @example
 * const exists = await userExist('john.doe@example.com');
 * if (exists) {
 *   throw new Error('User already registered');
 * }
 */
const userExist = async (email: string): Promise<boolean> => {
  const user = await findUserByEmail(email);
  return !!user;
};

/**
 * Creates a new user and associated credentials in a single transaction.
 *
 * @param payload - User input payload including password.
 * @returns The created user profile.
 * @throws ApiError when user already exists or creation fails.
 */
const createUser = async (payload: CreateUserType): Promise<User> => {
  const existingUser = await userExist(payload.email);

  if (existingUser) {
    throw new ApiError(409, 'User already registered');
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  
  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        role: payload.role || 'CUSTOMER',
        status: payload.status || 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await tx.account.create({
      data: {
        providerId: 'credentials',
        password: hashedPassword,
        accountId: createdUser.id,
        userId: createdUser.id,
      },
    });

    return createdUser;
  });

  if (!user) {
    throw new ApiError(500, 'Failed to create user');
  }
  return user;
};

/**
 * Retrieves a paginated list of users with optional filters.
 *
 * @param params - Pagination, sorting, and filter parameters.
 * @returns Users list and pagination metadata.
 */
const getAllUsers = async (
  params: GetUsersParams
): Promise<{
  data: User[];
  pagination: Pagination;
}> => {
  const {
    searchQuery,
    role,
    status,
    sortBy = 'createdAt',
    sortType = 'desc',
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = params;

  const sanitizedPageSize = Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE);
  const skipAmount = (page - 1) * sanitizedPageSize;

  const whereClause: Prisma.UserWhereInput = {
    ...(searchQuery && {
      name: {
        mode: 'insensitive',
        contains: searchQuery,
      },
    }),
    ...(role && { role: { in: [role] } }),
    ...(status && { status: { in: [status] } }),
  };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where: whereClause,
      orderBy: {
        [sortBy ?? 'createdAt']: sortType,
      },
      take: pageSize,
      skip: skipAmount,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.floor(skipAmount / pageSize) + 1;

  return {
    data: users,
    pagination: {
      totalItems: total,
      totalPages,
      currentPage,
      next: currentPage < totalPages ? currentPage + 1 : null,
      prev: currentPage > 1 ? currentPage - 1 : null,
    },
  };
};

/**
 * Finds a user by their unique identifier
 *
 * @param {string} id - The unique user ID to search for
 * @returns {Promise<User | null>} The user object if found, null otherwise
 *
 * @example
 * const user = await findUserById('clx7y9z0a0000abc123def456');
 * if (user) {
 *   console.log('User found:', user.email);
 * }
 */
const findUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user ? user : null;
};

/**
 * Updates an existing user by ID.
 *
 * @param id - The user ID to update.
 * @param payload - Partial user fields to update.
 * @returns The updated user.
 * @throws ApiError when the user does not exist.
 */
const updateUserById = async (
  id: string,
  payload: Partial<User>
): Promise<User | null> => {
  const isUserExist = await findUserById(id);
  console.log('[UPDATE] payload', payload);
  if (!isUserExist) {
    throw new ApiError(404, 'User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!updatedUser) {
    throw new ApiError(404, 'User not found');
  }

  return updatedUser;
};

/**
 * Deletes a user by ID.
 *
 * @param id - The user ID to delete.
 * @returns The deleted user.
 * @throws ApiError when the user does not exist.
 */
const deleteUserById = async (id: string): Promise<User> => {
  const isUserExist = await findUserById(id);

  if (!isUserExist) {
    throw new ApiError(404, 'User not found');
  }

  return await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const userService = {
  findUserByEmail,
  findUserById,
  userExist,
  createUser,
  getAllUsers,
  updateUserById,
  deleteUserById,
};
