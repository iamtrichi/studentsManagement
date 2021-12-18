import { EntityRepository, Repository } from 'typeorm';
import { Files } from '../domain/files.entity';

@EntityRepository(Files)
export class FilesRepository extends Repository<Files> {}
