import { Subjects } from '../../domain/subjects.entity';
import { SubjectsDTO } from '../dto/subjects.dto';

/**
 * A Subjects mapper object.
 */
export class SubjectsMapper {
    static fromDTOtoEntity(entityDTO: SubjectsDTO): Subjects {
        if (!entityDTO) {
            return;
        }
        const entity = new Subjects();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        console.log('entity', entity)
        return entity;
    }

    static fromEntityToDTO(entity: Subjects): SubjectsDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new SubjectsDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });
        console.log('entityDTO', entityDTO)
        return entityDTO;
    }
}
