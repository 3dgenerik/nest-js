import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { TasksBodyDto } from './dto/tasks-body.dto';
import { TasksFilterDto } from './dto/tasks-filter.dto';
import { Tasks } from './tasks.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks) private tasksRepository: TasksRepository,
  ) {}

  //get task by ID
  async getTaskById(id: string): Promise<Tasks> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  async taskExist(tasksBodyDto: TasksBodyDto): Promise<boolean> {
    const found = await this.tasksRepository.findOne({
      where: { title: tasksBodyDto.title },
    });

    if (found) return true;
    return false;
  }

  //create new task
  async createTask(tasksBodyDto: TasksBodyDto, res: Response): Promise<Tasks> {
    const { title, description, status } = tasksBodyDto;
    let task = this.tasksRepository.create({ title, description, status });
    task = { ...task, title, description, status };

    if (await this.taskExist(tasksBodyDto))
      res
        .status(HttpStatus.OK)
        .json({ message: `Task with title ${title} already exists.` });
    else {
      await this.tasksRepository.save(task);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Task has been created successfully', task });
    }
    return task;
  }

  async updateTask(id: string, tasksBodyDto: TasksBodyDto): Promise<Tasks> {
    const { title, description, status } = tasksBodyDto;
    let task = await this.getTaskById(id);

    task = { ...task, title, description, status };
    await this.tasksRepository.save(task);
    return task;
  }

  async filterTask(tasksFilterDto: TasksFilterDto): Promise<Tasks[]> {
    const { search, status } = tasksFilterDto;

    const query = this.tasksRepository.createQueryBuilder('tasks');

    if (search) {
      query.where('LOWER(tasks.title) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    if (status) {
      query.where('tasks.status LIKE :status', { status });
    }

    const tasks = query.getMany();
    return tasks;
  }
}
