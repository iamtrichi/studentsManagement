import { EntityRepository, Repository } from 'typeorm';
import { Appreciations } from '../domain/appreciations.entity';

@EntityRepository(Appreciations)
export class AppreciationsRepository extends Repository<Appreciations> {}
