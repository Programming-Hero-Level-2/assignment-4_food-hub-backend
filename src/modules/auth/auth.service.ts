import auth from '../../libs/auth';
import { ApiError } from '../../utils/ApiError';
import { userExist } from '../user/user.services';
import { RegisterUser } from './auth.types';

/**
 * Register a new user using better-auth's signUpEmail method.
 * It first checks if a user with the provided email already exists. If so, it throws a 409 error.
 * Otherwise, it creates the user with the given email, name, and password, and assigns
 * a default role of 'CUSTOMER' and status of 'ACTIVE'.
 * @param param0 - An object containing the email, name, and password for the new user.
 * @returns The created user payload from better-auth.
 */
const registerUser = async ({ email, name, password }: RegisterUser) => {
  const existingUser = await userExist(email);

  if (existingUser) {
    throw new ApiError(409, 'User already registered');
  }

  const user = await auth.api.signUpEmail({
    body: {
      email,
      name,
      password,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      // callbackURL: `/`,
    },
  });

  return user;
};

/**
 * Log in an existing user using better-auth's signInEmail method.
 * It first checks if a user with the provided email exists. If not, it throws a 404 error.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns The authenticated user payload from better-auth.
 */
const loginUser = async (email: string = '', password: string = '') => {
  const existingUser = await userExist(email);

  if (!existingUser) {
    throw new ApiError(404, 'User not registered, please sign up first');
  }

  const user = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  return user;
};

export const authService = {
  registerUser,
  loginUser,
};
