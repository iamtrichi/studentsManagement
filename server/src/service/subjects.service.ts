import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { SubjectsDTO } from '../service/dto/subjects.dto';
import { SubjectsMapper } from '../service/mapper/subjects.mapper';
import { SubjectsRepository } from '../repository/subjects.repository';

const relationshipNames = [];

@Injectable()
export class SubjectsService {
    logger = new Logger('SubjectsService');

    constructor(@InjectRepository(SubjectsRepository) private subjectsRepository: SubjectsRepository) {}

    async findById(id: string): Promise<SubjectsDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.subjectsRepository.findOne(id, options);
        return SubjectsMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<SubjectsDTO>): Promise<SubjectsDTO | undefined> {
        const result = await this.subjectsRepository.findOne(options);
        return SubjectsMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<SubjectsDTO>): Promise<[SubjectsDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.subjectsRepository.findAndCount(options);
        const subjectsDTO: SubjectsDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(subjects => subjectsDTO.push(SubjectsMapper.fromEntityToDTO(subjects)));
            resultList[0] = subjectsDTO;
        }
        return resultList;
    }

    async save(subjectsDTO: SubjectsDTO, creator?: string): Promise<SubjectsDTO | undefined> {
        const entity = SubjectsMapper.fromDTOtoEntity(subjectsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.subjectsRepository.save(entity);
        return SubjectsMapper.fromEntityToDTO(result);
    }

    async update(subjectsDTO: SubjectsDTO, updater?: string): Promise<SubjectsDTO | undefined> {
        const entity = SubjectsMapper.fromDTOtoEntity(subjectsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        await this.subjectsRepository.update(entity.id, entity);
        return subjectsDTO;
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.subjectsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
