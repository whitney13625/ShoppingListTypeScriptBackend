import 'dotenv/config';
import express, { Request, Response } from 'express';
import shoppingRoutes from './routes/shoppingRoutes';
import categoryRoutes from './routes/categoryRoutes'; 

const app = express();
const PORT = process.env.PORT || 3000;

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


// Ping route
app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong' });
});


// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '歡迎使用購物清單 API',
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
app.use('/api/shopping', shoppingRoutes);
app.use('/api/categories', categoryRoutes);

// 404 error processing
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Path not found',
  });
});

// Run server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📋 API docs: http://localhost:${PORT}/`);
});