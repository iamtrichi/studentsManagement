import { EntityRepository, Repository } from 'typeorm';
import { Idea } from '../domain/idea.entity';

@EntityRepository(Idea)
export class IdeaRepository extends Repository<Idea> {}
