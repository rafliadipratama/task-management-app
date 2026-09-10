import { z } from 'zod';

export const TaskStatusEnum = z.enum(['todo', 'in_progress', 'done'], {
  errorMap: () => ({ message: "Status must be 'todo', 'in_progress', or 'done'" }),
});

export const TaskPriorityEnum = z.enum(['low', 'medium', 'high'], {
  errorMap: () => ({ message: "Priority must be 'low', 'medium', or 'high'" }),
});

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .trim()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional()
    .nullable(),
  status: TaskStatusEnum.default('todo'),
  priority: TaskPriorityEnum.default('medium'),
  projectId: z
    .string({ required_error: 'projectId is required' })
    .trim()
    .min(1, 'Project ID cannot be empty'),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional()
    .nullable(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  projectId: z.string().trim().min(1).optional(),
});

export const taskIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Task ID is required'),
});

export const taskQueryFilterSchema = z.object({
  projectId: z.string().trim().optional(),
  search: z.string().trim().optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'priority', 'status']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryFilter = z.infer<typeof taskQueryFilterSchema>;
