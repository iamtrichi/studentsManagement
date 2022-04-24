import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { FilesDTO } from '../service/dto/files.dto';
import { FilesMapper } from '../service/mapper/files.mapper';
import { FilesRepository } from '../repository/files.repository';

const relationshipNames = [];

@Injectable()
export class FilesService {
    logger = new Logger('FilesService');

    constructor(@InjectRepository(FilesRepository) private filesRepository: FilesRepository) {}

    async findById(id: string): Promise<FilesDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.filesRepository.findOne(id, options);
        return FilesMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<FilesDTO>): Promise<FilesDTO | undefined> {
        const result = await this.filesRepository.findOne(options);
        return FilesMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<FilesDTO>): Promise<[FilesDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.filesRepository.findAndCount(options);
        const filesDTO: FilesDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(files => filesDTO.push(FilesMapper.fromEntityToDTO(files)));
            resultList[0] = filesDTO;
        }
        return resultList;
    }

    async save(filesDTO: FilesDTO, creator?: string): Promise<FilesDTO | undefined> {
        const entity = FilesMapper.fromDTOtoEntity(filesDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.filesRepository.save(entity);
        return FilesMapper.fromEntityToDTO(result);
    }

    async update(filesDTO: FilesDTO, updater?: string): Promise<FilesDTO | undefined> {
        const entity = FilesMapper.fromDTOtoEntity(filesDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        await this.filesRepository.update(entity.id, entity);
        return filesDTO;
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.filesRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
