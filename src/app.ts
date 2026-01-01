
import express, { Request, Response } from 'express';
import shoppingRoutes from './routes/shoppingRoutes';
import categoryRoutes from './routes/categoryRoutes'; 
import swaggerUi from 'swagger-ui-express';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './lib/openApiRegistry';

import { errorHandler } from './middleware/errorHandler';
import { ApiError } from './errors/ApiError';

const app = express();

// Middleware
app.use(express.json()); // This handles JSON format (raw + JSON in Postman)
app.use(express.urlencoded({ extended: true })); // This handles form-urlencoded format (x-www-form-urlencoded in Postman)

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


// --- Generate OpenAPI Document --- This should be called first, before the route (which also registers swagger)
//  as it calls extendZodWithOpenApi(z)
const generator = new OpenApiGeneratorV3(registry.definitions);

// Ping route
app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong' });
});


// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to shopping list API',
    endpoints: {
      shopping: {
        'Get all items': 'GET /api/shopping',
        'Get single item': 'GET /api/shopping/:id',
        'Create item': 'POST /api/shopping',
        'Update item': 'PUT /api/shopping/:id',
        'Delete item': 'DELETE /api/shopping/:id',
      },
      categories: {
        'Get all categories': 'GET /api/categories',
        'Get single category': 'GET /api/categories/:id',
        'Create category': 'POST /api/categories',
        'Update category': 'PUT /api/categories/:id',
        'Delete category': 'DELETE /api/categories/:id',
      },
    },
  });
});

// API routes
app.use('/', shoppingRoutes);
app.use('/', categoryRoutes);

const openApiDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Shopping List API',
    description: 'API documentation generated automatically from Zod schemas',
  },
  servers: [{ url: 'http://localhost:3000' }],
});

// --- Serve Documentation ---
// 1. Serve the UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// 2. (Optional) Serve the raw JSON for other tools to consume
app.get('/api-docs.json', (req, res) => {
  res.json(openApiDocument);
});

// 404 error processing
app.use((req: Request, res: Response, next) => {
  next(new ApiError(404, 'Path not found'));
});

// Global error handler
app.use(errorHandler);

export { app };