import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/error.middleware.js';
import {
  CreateTaskInput,
  TaskQueryFilter,
  UpdateTaskInput,
} from '../validations/task.validation.js';

export class TaskService {
  static async getTasks(filter: TaskQueryFilter) {
    const where: any = {};

    if (filter.projectId) {
      where.projectId = filter.projectId;
    }

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.priority) {
      where.priority = filter.priority;
    }

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search } },
        { description: { contains: filter.search } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        [filter.sortBy]: filter.order,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return tasks;
  }

  static async getTaskById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return task;
  }

  static async createTask(data: CreateTaskInput) {
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new AppError(`Project with ID '${data.projectId}' does not exist`, 404);
    }

    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        status: data.status as any,
        priority: data.priority as any,
        projectId: data.projectId,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  static async updateTask(id: string, data: UpdateTaskInput) {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Task not found', 404);
    }

    if (data.projectId && data.projectId !== existing.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: data.projectId },
      });
      if (!project) {
        throw new AppError(`Project with ID '${data.projectId}' does not exist`, 404);
      }
    }

    return prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status as any }),
        ...(data.priority !== undefined && { priority: data.priority as any }),
        ...(data.projectId !== undefined && { projectId: data.projectId }),
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  static async deleteTask(id: string) {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Task not found', 404);
    }

    await prisma.task.delete({ where: { id } });
    return { id, message: 'Task deleted successfully' };
  }
}
