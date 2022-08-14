import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IdeaDTO } from '../service/dto/idea.dto';
import { IdeaMapper } from '../service/mapper/idea.mapper';
import { IdeaRepository } from '../repository/idea.repository';

const relationshipNames = [];

@Injectable()
export class IdeaService {
    logger = new Logger('IdeaService');

    constructor(@InjectRepository(IdeaRepository) private ideaRepository: IdeaRepository) {}

    async findById(id: string): Promise<IdeaDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.ideaRepository.findOne(id, options);
        return IdeaMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<IdeaDTO>): Promise<IdeaDTO | undefined> {
        const result = await this.ideaRepository.findOne(options);
        return IdeaMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<IdeaDTO>): Promise<[IdeaDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.ideaRepository.findAndCount(options);
        const ideaDTO: IdeaDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((idea) => ideaDTO.push(IdeaMapper.fromEntityToDTO(idea)));
            resultList[0] = ideaDTO;
        }
        return resultList;
    }

    async save(ideaDTO: IdeaDTO, creator?: string): Promise<IdeaDTO | undefined> {
        const entity = IdeaMapper.fromDTOtoEntity(ideaDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.ideaRepository.save(entity);
        return IdeaMapper.fromEntityToDTO(result);
    }

    async update(ideaDTO: IdeaDTO, updater?: string): Promise<IdeaDTO | undefined> {
        const entity = IdeaMapper.fromDTOtoEntity(ideaDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        await this.ideaRepository.update(entity.id, entity);
        return ideaDTO;
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.ideaRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
