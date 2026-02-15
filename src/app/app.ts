import express from 'express';
import { applyMiddleware } from './middleware';

const app = express();

applyMiddleware(app);

export { app };
