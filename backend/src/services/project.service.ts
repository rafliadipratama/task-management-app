import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/error.middleware.js';
import { CreateProjectInput, UpdateProjectInput } from '../validations/project.validation.js';

export class ProjectService {
  static async getAllProjects() {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    return projects.map((p) => {
      const totalTasks = p.tasks.length;
      const todoCount = p.tasks.filter((t) => t.status === 'todo').length;
      const inProgressCount = p.tasks.filter((t) => t.status === 'in_progress').length;
      const doneCount = p.tasks.filter((t) => t.status === 'done').length;
      const progressPercentage = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

      const { tasks, ...rest } = p;
      return {
        ...rest,
        taskStats: {
          total: totalTasks,
          todo: todoCount,
          inProgress: inProgressCount,
          done: doneCount,
          progressPercentage,
        },
      };
    });
  }

  static async getProjectById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const totalTasks = project.tasks.length;
    const todoCount = project.tasks.filter((t) => t.status === 'todo').length;
    const inProgressCount = project.tasks.filter((t) => t.status === 'in_progress').length;
    const doneCount = project.tasks.filter((t) => t.status === 'done').length;
    const progressPercentage = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

    return {
      ...project,
      taskStats: {
        total: totalTasks,
        todo: todoCount,
        inProgress: inProgressCount,
        done: doneCount,
        progressPercentage,
      },
    };
  }

  static async createProject(data: CreateProjectInput) {
    return prisma.project.create({
      data: {
        title: data.title,
        description: data.description ?? null,
      },
    });
  }

  static async updateProject(id: string, data: UpdateProjectInput) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Project not found', 404);
    }

    return prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
  }

  static async deleteProject(id: string) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Project not found', 404);
    }

    await prisma.project.delete({ where: { id } });
    return { id, message: 'Project deleted successfully' };
  }
}
