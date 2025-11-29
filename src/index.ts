import 'dotenv/config';
import express, { Request, Response } from 'express';
import shoppingRoutes from './routes/shoppingRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // This handles JSON format (raw + JSON in Postman)
app.use(express.urlencoded({ extended: true })); // This handles form-urlencoded format (x-www-form-urlencoded in Postman)

// CORS 設定（如果需要前端連接）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


// 測試路由
app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong' });
});


// 根路由
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '歡迎使用購物清單 API',
    endpoints: {
      'Get all items': 'GET /api/shopping',
      'Get single item': 'GET /api/shopping/:id',
      'Create item': 'POST /api/shopping',
      'Update item': 'PUT /api/shopping/:id',
      'Delete item': 'DELETE /api/shopping/:id',
    },
  });
});

// API 路由
app.use('/api/shopping', shoppingRoutes);

// 404 處理
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Path not found',
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📋 API docs: http://localhost:${PORT}/`);
});