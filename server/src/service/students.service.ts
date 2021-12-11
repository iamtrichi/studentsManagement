import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { StudentsDTO } from '../service/dto/students.dto';
import { StudentsMapper } from '../service/mapper/students.mapper';
import { StudentsRepository } from '../repository/students.repository';

const relationshipNames = [];

@Injectable()
export class StudentsService {
    logger = new Logger('StudentsService');

    constructor(@InjectRepository(StudentsRepository) private studentsRepository: StudentsRepository) {}

    async findById(id: string): Promise<StudentsDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.studentsRepository.findOne(id, options);
        return StudentsMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<StudentsDTO>): Promise<StudentsDTO | undefined> {
        const result = await this.studentsRepository.findOne(options);
        return StudentsMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<StudentsDTO>): Promise<[StudentsDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.studentsRepository.findAndCount(options);
        const studentsDTO: StudentsDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(students => studentsDTO.push(StudentsMapper.fromEntityToDTO(students)));
            resultList[0] = studentsDTO;
        }
        return resultList;
    }

    async save(studentsDTO: StudentsDTO, creator?: string): Promise<StudentsDTO | undefined> {
        const entity = StudentsMapper.fromDTOtoEntity(studentsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.studentsRepository.save(entity);
        return StudentsMapper.fromEntityToDTO(result);
    }

    async update(studentsDTO: StudentsDTO, updater?: string): Promise<StudentsDTO | undefined> {
        const entity = StudentsMapper.fromDTOtoEntity(studentsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        await this.studentsRepository.update(entity.id, entity);
        return studentsDTO;
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.studentsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
