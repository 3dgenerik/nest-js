import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ETasksStatus } from '../tasks.enum';

export class TasksFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ETasksStatus)
  status?: ETasksStatus;
}
