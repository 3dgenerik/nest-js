import { Repository } from 'typeorm';
import { Tasks } from './tasks.entity';

export class TasksRepository extends Repository<Tasks> {}
