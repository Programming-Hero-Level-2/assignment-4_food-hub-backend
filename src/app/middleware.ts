import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import OpenApiValidator from 'express-openapi-validator';
import path from 'path';

const applyMiddleware = (app: Express) => {
  const docsPath = path.join(process.cwd(), 'docs');
  const swaggerSpecPath = path.join(docsPath, 'swagger.yaml');

  app.use(cors());
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ limit: '16kb', extended: true }));
  app.use(morgan('dev'));

  // Serve raw spec files so Swagger UI can resolve external $refs.
  app.use('/api/docs/spec', express.static(docsPath));
  app.use(
    '/api/docs',
    swaggerUI.serve,
    swaggerUI.setup(undefined, {
      swaggerOptions: { url: '/api/docs/spec/swagger.yaml' },
    })
  );
  app.use(
    OpenApiValidator.middleware({
      apiSpec: swaggerSpecPath,
    })
  );
};

export { applyMiddleware };
