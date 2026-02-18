import { prisma } from '../../config/prisma';
import { User } from './user.types';

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
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user ? user : null;
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
export const findUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
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
export const userExist = async (email: string): Promise<boolean> => {
  const user = await findUserByEmail(email);
  return !!user;
};
