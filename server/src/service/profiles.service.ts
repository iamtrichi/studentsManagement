import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ProfilesDTO } from '../service/dto/profiles.dto';
import { ProfilesMapper } from '../service/mapper/profiles.mapper';
import { ProfilesRepository } from '../repository/profiles.repository';

const relationshipNames = [];

@Injectable()
export class ProfilesService {
    logger = new Logger('ProfilesService');

    constructor(@InjectRepository(ProfilesRepository) private profilesRepository: ProfilesRepository) {}

    async findById(id: string): Promise<ProfilesDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.profilesRepository.findOne(id, options);
        return ProfilesMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<ProfilesDTO>): Promise<ProfilesDTO | undefined> {
        const result = await this.profilesRepository.findOne(options);
        return ProfilesMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<ProfilesDTO>): Promise<[ProfilesDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.profilesRepository.findAndCount(options);
        const profilesDTO: ProfilesDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(profiles => profilesDTO.push(ProfilesMapper.fromEntityToDTO(profiles)));
            resultList[0] = profilesDTO;
        }
        return resultList;
    }

    async save(profilesDTO: ProfilesDTO, creator?: string): Promise<ProfilesDTO | undefined> {
        const entity = ProfilesMapper.fromDTOtoEntity(profilesDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.profilesRepository.save(entity);
        return ProfilesMapper.fromEntityToDTO(result);
    }

    async update(profilesDTO: ProfilesDTO, updater?: string): Promise<ProfilesDTO | undefined> {
        const entity = ProfilesMapper.fromDTOtoEntity(profilesDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        await this.profilesRepository.update(entity.id, entity);
        return profilesDTO;
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.profilesRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
