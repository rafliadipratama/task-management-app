import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      // or from any localhost port for flexible local testing
      if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev mode
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Root greeting
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Task Management REST API',
    endpoints: {
      health: '/api/health',
      projects: '/api/projects',
      tasks: '/api/tasks',
    },
  });
});

// API routes
app.use('/api', apiRouter);

// Catch 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
});

// Central error handler
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Task Management API server listening on http://localhost:${env.PORT}`);
  console.log(`📡 Health check available at http://localhost:${env.PORT}/api/health`);
});

const gracefulShutdown = () => {
  console.log('Stopping server gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;
