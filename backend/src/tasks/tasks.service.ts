import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new Task
   */
  async create(dto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || 'TODO',
        priority: dto.priority || 'MEDIUM',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        labels: dto.labels || [],
        projectId: dto.projectId || null,
        reporterId: userId,
        members: {
          connect: { id: userId },
        },
      },
      include: {
        reporter: { select: { id: true, name: true, email: true, avatar: true } },
        members: { select: { id: true, name: true, email: true, avatar: true } },
        subtasks: true,
        comments: true,
      },
    });
  }

  /**
   * Get all tasks (with optional search and query filters)
   */
  async findAll(filterDto: FilterTaskDto) {
    const { search, status, priority, projectId } = filterDto;

    const where: Prisma.TaskWhereInput = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (projectId) where.projectId = projectId;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { labels: { hasSome: [search] } },
      ];
    }

    return this.prisma.task.findMany({
      where,
      include: {
        reporter: { select: { id: true, name: true, email: true, avatar: true } },
        members: { select: { id: true, name: true, email: true, avatar: true } },
        subtasks: true,
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single task by ID
   */
  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        reporter: { select: { id: true, name: true, email: true, avatar: true } },
        members: { select: { id: true, name: true, email: true, avatar: true } },
        subtasks: true,
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  /**
   * Update task by ID
   */
  async update(id: string, dto: UpdateTaskDto) {
    // Check if task exists
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && { status: dto.status }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
        ...(dto.labels && { labels: dto.labels }),
        ...(dto.projectId !== undefined && { projectId: dto.projectId }),
      },
      include: {
        reporter: { select: { id: true, name: true, email: true, avatar: true } },
        members: { select: { id: true, name: true, email: true, avatar: true } },
        subtasks: true,
        comments: true,
      },
    });
  }

  /**
   * Delete task by ID
   */
  async remove(id: string) {
    // Check if task exists
    await this.findOne(id);

    await this.prisma.task.delete({
      where: { id },
    });

    return { message: `Task with ID "${id}" successfully deleted` };
  }
}
