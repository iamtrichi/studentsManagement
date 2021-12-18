import { Files } from '../../domain/files.entity';
import { FilesDTO } from '../dto/files.dto';

/**
 * A Files mapper object.
 */
export class FilesMapper {
    static fromDTOtoEntity(entityDTO: FilesDTO): Files {
        if (!entityDTO) {
            return;
        }
        let entity = new Files();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Files): FilesDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new FilesDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
