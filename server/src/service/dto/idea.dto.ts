/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * A IdeaDTO object.
 */
export class IdeaDTO extends BaseDTO {
    @ApiModelProperty({ description: 'idee field', required: false })
    idee: string;

    @ApiModelProperty({ description: 'theme field', required: false })
    theme: string;

    @ApiModelProperty({ description: 'piste field', required: false })
    piste: string;

    @ApiModelProperty({ description: 'niveau field', required: false })
    niveau: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
