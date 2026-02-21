import express from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { userRouter } from '../modules/user/user.routes';

const router = express.Router();

// Mount route modules

// Auth Routes
router.use('/auth', authRouter);

// User Routes
router.use('/admin/users', userRouter);

export default router;
