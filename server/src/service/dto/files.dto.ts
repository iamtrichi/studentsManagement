/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * A FilesDTO object.
 */
export class FilesDTO extends BaseDTO {
    @ApiModelProperty({ description: 'url field', required: false })
    url: any;

    urlContentType: string;
    @ApiModelProperty({ description: 'description field', required: false })
    description: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
