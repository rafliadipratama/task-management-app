import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z
    .string({ required_error: 'Judul project wajib diisi' })
    .trim()
    .min(1, 'Judul project tidak boleh kosong')
    .max(150, 'Judul project tidak boleh melebihi 150 karakter'),
  description: z
    .string()
    .trim()
    .max(1000, 'Deskripsi tidak boleh melebihi 1000 karakter')
    .optional()
    .nullable(),
});

export const updateProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Judul project tidak boleh kosong')
    .max(150, 'Judul project tidak boleh melebihi 150 karakter')
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, 'Deskripsi tidak boleh melebihi 1000 karakter')
    .optional()
    .nullable(),
});

export const projectIdParamSchema = z.object({
  id: z.string().trim().min(1, 'ID Project wajib diisi'),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
