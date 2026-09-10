import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import {
  validateBody,
  validateParams,
} from '../middleware/validate.middleware.js';
import {
  createProjectSchema,
  projectIdParamSchema,
  updateProjectSchema,
} from '../validations/project.validation.js';

export const projectRouter = Router();

projectRouter.get('/', ProjectController.getAll);

projectRouter.get(
  '/:id',
  validateParams(projectIdParamSchema),
  ProjectController.getById
);

projectRouter.post(
  '/',
  validateBody(createProjectSchema),
  ProjectController.create
);

projectRouter.patch(
  '/:id',
  validateParams(projectIdParamSchema),
  validateBody(updateProjectSchema),
  ProjectController.update
);

projectRouter.delete(
  '/:id',
  validateParams(projectIdParamSchema),
  ProjectController.delete
);
