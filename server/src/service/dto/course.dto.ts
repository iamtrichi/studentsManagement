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

    @ApiModelProperty({ description: 'urls1 field', required: false })
    urls1: any;

    urls1ContentType: string;
    @ApiModelProperty({ description: 'ctype field', required: false })
    ctype: string;

    @ApiModelProperty({ description: 'note field', required: false })
    note: number;

    @ApiModelProperty({ description: 'remarque field', required: false })
    remarque: string;

    @ApiModelProperty({ description: 'activity date field', required: false })
    dateActivity: string;
    

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
