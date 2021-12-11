import { EntityRepository, Repository } from 'typeorm';
import { Students } from '../domain/students.entity';

@EntityRepository(Students)
export class StudentsRepository extends Repository<Students> {}
