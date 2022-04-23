import { Students } from '../../domain/students.entity';
import { StudentsDTO } from '../dto/students.dto';

/**
 * A Students mapper object.
 */
export class StudentsMapper {
    static fromDTOtoEntity(entityDTO: StudentsDTO): Students {
        if (!entityDTO) {
            return;
        }
        const entity = new Students();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        // delete entity.studentIdentifier;
        entity.identifier = entityDTO.studentIdentifier;
        // entity.studentIdentifier = entityDTO.studentIdentifier;
        return entity;
    }

    static fromEntityToDTO(entity: Students): StudentsDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new StudentsDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });
        /* entityDTO.id = entity.id;
		entityDTO.studentIdentifier = entity.identifier;
		entityDTO.identifier = entity.identifier;
		entityDTO.studentFirstName = entity.studentFirstName;
		entityDTO.studentLastName = entity.studentLastName;
		entityDTO.dateOfBirth = entity.dateOfBirth;
		entityDTO.schoolYear = entity.schoolYear;
		entityDTO.className = entity.className;
		entityDTO.studentName = entity.studentName;
*/
        return entityDTO;
    }
}
