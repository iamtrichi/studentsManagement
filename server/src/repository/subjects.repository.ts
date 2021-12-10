import { EntityRepository, Repository } from 'typeorm';
import { Subjects } from '../domain/subjects.entity';

@EntityRepository(Subjects)
export class SubjectsRepository extends Repository<Subjects> {}
