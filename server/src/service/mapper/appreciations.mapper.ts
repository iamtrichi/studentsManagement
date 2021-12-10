import { Appreciations } from '../../domain/appreciations.entity';
import { AppreciationsDTO } from '../dto/appreciations.dto';

/**
 * A Appreciations mapper object.
 */
export class AppreciationsMapper {
    static fromDTOtoEntity(entityDTO: AppreciationsDTO): Appreciations {
        if (!entityDTO) {
            return;
        }
        const entity = new Appreciations();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Appreciations): AppreciationsDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new AppreciationsDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
