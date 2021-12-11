import { EntityRepository, Repository } from 'typeorm';
import { Profiles } from '../domain/profiles.entity';

@EntityRepository(Profiles)
export class ProfilesRepository extends Repository<Profiles> {}
