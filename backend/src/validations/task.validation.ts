import { z } from 'zod';

export const TaskStatusEnum = z.enum(['todo', 'in_progress', 'done'], {
  errorMap: () => ({ message: "Status harus bernilai 'todo', 'in_progress', atau 'done'" }),
});

export const TaskPriorityEnum = z.enum(['low', 'medium', 'high'], {
  errorMap: () => ({ message: "Prioritas harus bernilai 'low', 'medium', atau 'high'" }),
});

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Judul task wajib diisi' })
    .trim()
    .min(1, 'Judul task tidak boleh kosong')
    .max(200, 'Judul task tidak boleh melebihi 200 karakter'),
  description: z
    .string()
    .trim()
    .max(2000, 'Deskripsi tidak boleh melebihi 2000 karakter')
    .optional()
    .nullable(),
  status: TaskStatusEnum.default('todo'),
  priority: TaskPriorityEnum.default('medium'),
  projectId: z
    .string({ required_error: 'projectId wajib diisi' })
    .trim()
    .min(1, 'ID Project tidak boleh kosong'),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Judul task tidak boleh kosong')
    .max(200, 'Judul task tidak boleh melebihi 200 karakter')
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, 'Deskripsi tidak boleh melebihi 2000 karakter')
    .optional()
    .nullable(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  projectId: z.string().trim().min(1).optional(),
});

export const taskIdParamSchema = z.object({
  id: z.string().trim().min(1, 'ID Task wajib diisi'),
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
