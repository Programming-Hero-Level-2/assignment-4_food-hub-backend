import express from 'express';
import { authRouter } from '../modules/auth/auth.routes';

const router = express.Router();

// Mount route modules

// Auth Routes
router.use('/auth', authRouter);

export default router;
