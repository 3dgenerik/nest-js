import { ETasksStatus } from '../tasks.enum';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class TasksBodyDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ETasksStatus)
  @IsNotEmpty()
  @IsOptional()
  status?: ETasksStatus;
}
