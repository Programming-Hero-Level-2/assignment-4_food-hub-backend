import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { loginSchema, registerSchema } from './auth.schema';
import { authService } from './auth.service';

export const register = asyncHandler(async (req, res) => {
  const validatedSchema = registerSchema.parse(req.body);

  const { email, name, password } = validatedSchema;

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
  const validatedSchema = loginSchema.parse(req.body);

  const { email, password } = validatedSchema;
  const user = await authService.loginUser(email, password);

  const responsePayload = {
    id: user.user.id,
    access_token: user.token,
  };

  res
    .status(200)
    .json(new ApiResponse(200, 'Login successful', responsePayload));
});

export const authController = {
  register,
  login,
};
