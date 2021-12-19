/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * A CourseDTO object.
 */
export class CourseDTO extends BaseDTO {
    @ApiModelProperty({ description: 'title field', required: false })
    title: string;

    @ApiModelProperty({ description: 'urls field', required: false })
    urls: any;

    urlsContentType: string;
    @ApiModelProperty({ description: 'ctype field', required: false })
    ctype: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
