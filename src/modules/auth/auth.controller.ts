import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { loginSchema, registerSchema } from './auth.schema';
import { authService } from './auth.service';

export const register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);

  const { email, name, password } = data;

  const user = await authService.registerUser({
    email,
    name,
    password,
  });
  res
    .status(201)
    .json(new ApiResponse(201, 'User registered successfully', user));
});

const login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);

  const user = await authService.loginUser(data.email, data.password);

  res.cookie('authToken', user.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json(new ApiResponse(200, 'Login successful', user));
});

export const authController = {
  register,
  login,
};
