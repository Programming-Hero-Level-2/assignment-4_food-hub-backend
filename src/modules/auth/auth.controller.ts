import auth from '../../libs/auth';
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

  if (user.headers.get('Set-Cookie')) {
    res.setHeader('Set-Cookie', user.headers.get('Set-Cookie') || '');
  }

  const response = await user.json();

  res.status(200).json(
    new ApiResponse(200, 'Login successful', {
      id: response.user.id,
      token: response.token,
    })
  );
});

export const authController = {
  register,
  login,
};
