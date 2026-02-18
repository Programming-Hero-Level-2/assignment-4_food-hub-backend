import express, { NextFunction, Request, Response } from 'express';
import { applyMiddleware } from './middleware';
import { globalErrorHandler } from '../utils/globalErrorHandler';
import { ApiError } from '../utils/ApiError';
import routes from './routes';

const app = express();

applyMiddleware(app);

app.use('/api/v1', routes);

app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.use((_req: Request, _res: Response, next: NextFunction) =>
  next(new ApiError(404, 'Route not found'))
);

app.use(globalErrorHandler);

export { app };
