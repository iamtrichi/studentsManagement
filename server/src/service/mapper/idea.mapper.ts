import { Idea } from '../../domain/idea.entity';
import { IdeaDTO } from '../dto/idea.dto';

/**
 * A Idea mapper object.
 */
export class IdeaMapper {
    static fromDTOtoEntity(entityDTO: IdeaDTO): Idea {
        if (!entityDTO) {
            return;
        }
        let entity = new Idea();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Idea): IdeaDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new IdeaDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
