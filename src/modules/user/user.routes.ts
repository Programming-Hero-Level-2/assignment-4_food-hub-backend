import express from 'express';
import { userController } from './user.controllers';

const router = express.Router();

router
  .post('/', userController.createNewUser)
  .get('/', userController.getAllUsers)
  .get('/:id', userController.getUser)
  .patch('/:id', userController.updateUser)
  .delete('/:id', userController.deleteUser); 

export { router as userRouter };
