import express, { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { globalErrorHandler } from '../utils/globalErrorHandler';
import { applyMiddleware } from './middleware';
import routes from './routes';
import { userRouter } from '../modules/user/user.routes';

const app = express();

applyMiddleware(app);

// health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api/v1', routes);

// app.post('/api/v1/users', userRouter);

// Handle 404 for undefined routes
app.use((_req: Request, _res: Response, next: NextFunction) =>
  next(new ApiError(404, 'Route not found'))
);

app.use(globalErrorHandler);

export { app };
