import express from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { userRouter } from '../modules/user/user.routes';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

// Mount route modules

// Auth Routes
router.use('/auth', authRouter);

// User Routes
router.use('/admin/users', authenticate, userRouter);

export default router;
