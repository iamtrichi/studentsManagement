import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { AppreciationsDTO } from '../service/dto/appreciations.dto';
import { AppreciationsMapper } from '../service/mapper/appreciations.mapper';
import { AppreciationsRepository } from '../repository/appreciations.repository';

const relationshipNames = [];

@Injectable()
export class AppreciationsService {
    logger = new Logger('AppreciationsService');

    constructor(@InjectRepository(AppreciationsRepository) private appreciationsRepository: AppreciationsRepository) {}

    async findById(id: string): Promise<AppreciationsDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.appreciationsRepository.findOne(id, options);
        return AppreciationsMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<AppreciationsDTO>): Promise<AppreciationsDTO | undefined> {
        const result = await this.appreciationsRepository.findOne(options);
        return AppreciationsMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<AppreciationsDTO>): Promise<[AppreciationsDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.appreciationsRepository.findAndCount(options);
        const appreciationsDTO: AppreciationsDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(appreciations =>
                appreciationsDTO.push(AppreciationsMapper.fromEntityToDTO(appreciations)),
            );
            resultList[0] = appreciationsDTO;
        }
        return resultList;
    }

    async save(appreciationsDTO: AppreciationsDTO, creator?: string): Promise<AppreciationsDTO | undefined> {
        const entity = AppreciationsMapper.fromDTOtoEntity(appreciationsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.appreciationsRepository.save(entity);
        return AppreciationsMapper.fromEntityToDTO(result);
    }

    async update(appreciationsDTO: AppreciationsDTO, updater?: string): Promise<AppreciationsDTO | undefined> {
        const entity = AppreciationsMapper.fromDTOtoEntity(appreciationsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        await this.appreciationsRepository.update(entity.id, entity);
        return appreciationsDTO;
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.appreciationsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
