import { Router } from 'express';
import { projectRouter } from './project.routes.js';
import { taskRouter } from './task.routes.js';

export const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Task Management API',
  });
});

apiRouter.use('/projects', projectRouter);
apiRouter.use('/tasks', taskRouter);
