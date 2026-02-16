import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import OpenApiValidator from 'express-openapi-validator';
import YAML from 'yamljs';
import { ENV } from '../config/env';
const swaggerDoc = YAML.load('./docs/swagger.yaml');

const applyMiddleware = (app: Express) => {
  app.use(
    cors({
      credentials: true,
      origin: ENV.CORS_ORIGIN,
    })
  );
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ limit: '16kb', extended: true }));
  app.use(morgan('dev'));

  app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
  app.use(
    OpenApiValidator.middleware({
      apiSpec: './docs/swagger.yaml',
    })
  );
};

export { applyMiddleware };
