import { urlencoded } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  CreateUserSchema,
  IDSchema,
  UpdateUserSchema,
  UserQueryParamsSchema,
} from './user.schema';
import { userService } from './user.services';
import { generatePageLink } from '../../utils/generatePageLink';
import { ApiError } from '../../utils/ApiError';

const createNewUser = asyncHandler(async (req, res, _next) => {
  const data = CreateUserSchema.parse(req.body);

  const user = await userService.createUser(data);

  res.status(201).json(new ApiResponse(201, 'User created successfully', user));
});

const getAllUsers = asyncHandler(async (req, res, _next) => {
  const queryParams = UserQueryParamsSchema.parse(req.query);

  const { data, pagination } = await userService.getAllUsers(queryParams);

  res.status(200).json(
    new ApiResponse(200, 'Users retrieved successfully', {
      user: data,
      pagination,
      links: {
        self: req.originalUrl,
        next: generatePageLink(req.originalUrl, pagination.next),
        prev: generatePageLink(req.originalUrl, pagination.prev),
      },
    })
  );
});

const getUser = asyncHandler(async (req, res, _next) => {
  const id = IDSchema.parse(req.params.id);

  const user = await userService.findUserById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'User retrieved successfully', user));
});

const updateUser = asyncHandler(async (req, res, _next) => {
  const id = IDSchema.parse(req.params.id);
  const data = UpdateUserSchema.partial().parse(req.body);

  const updatedUser = await userService.updateUserById(id, data);

  if (!updatedUser) {
    throw new ApiError(404, 'User not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'User updated successfully', updatedUser));
});

const deleteUser = asyncHandler(async (req, res, _next) => {
  const id = IDSchema.parse(req.params.id);

  await userService.deleteUserById(id);

  res.status(200).json(new ApiResponse(200, 'User deleted successfully', null));
});

export const userController = {
  createNewUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
