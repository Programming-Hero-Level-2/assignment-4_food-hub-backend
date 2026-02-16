import express from 'express';
import { applyMiddleware } from './middleware';

const app = express();

applyMiddleware(app);
app.use('/api/v1', (await import('./routes')).default);
// app.use(globalErrorHandler);

export { app };
