import express, { NextFunction, Request, Response } from 'express';
import { applyMiddleware } from './middleware';
import { globalErrorHandler } from '../utils/globalErrorHandler';
import { ApiError } from '../utils/ApiError';

const app = express();

applyMiddleware(app);

app.use('/api/v1', (await import('./routes')).default);

app.use((_req: Request, _res: Response, next: NextFunction) =>
  next(new ApiError(404, 'Route not found'))
);

app.use(globalErrorHandler);

export { app };
