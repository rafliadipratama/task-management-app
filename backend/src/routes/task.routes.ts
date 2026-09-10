import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validate.middleware.js';
import {
  createTaskSchema,
  taskIdParamSchema,
  taskQueryFilterSchema,
  updateTaskSchema,
} from '../validations/task.validation.js';

export const taskRouter = Router();

taskRouter.get(
  '/',
  validateQuery(taskQueryFilterSchema),
  TaskController.getAll
);

taskRouter.get(
  '/:id',
  validateParams(taskIdParamSchema),
  TaskController.getById
);

taskRouter.post(
  '/',
  validateBody(createTaskSchema),
  TaskController.create
);

taskRouter.patch(
  '/:id',
  validateParams(taskIdParamSchema),
  validateBody(updateTaskSchema),
  TaskController.update
);

taskRouter.delete(
  '/:id',
  validateParams(taskIdParamSchema),
  TaskController.delete
);
