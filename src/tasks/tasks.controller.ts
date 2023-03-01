import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Res,
  Query,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { TasksBodyDto } from './dto/tasks-body.dto';
import { TasksFilterDto } from './dto/tasks-filter.dto';
import { Tasks } from './tasks.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(
    @Inject(TasksService)
    private tasksService: TasksService,
  ) {}

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Tasks> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(
    @Body() tasksBodyDto: TasksBodyDto,
    @Res() res: Response,
  ): Promise<Tasks> {
    return this.tasksService.createTask(tasksBodyDto, res);
  }

  @Patch('/:id')
  updateTask(
    @Param('id') id: string,
    @Body() tasksBodyDto: TasksBodyDto,
  ): Promise<Tasks> {
    return this.tasksService.updateTask(id, tasksBodyDto);
  }

  @Get()
  filterTask(@Query() tasksFilterDto: TasksFilterDto): Promise<Tasks[]> {
    return this.tasksService.filterTask(tasksFilterDto);
  }
}
