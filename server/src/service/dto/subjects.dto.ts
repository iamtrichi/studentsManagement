/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A SubjectsDTO object.
 */
export class SubjectsDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'subject field' })
    subject: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'keywords field' })
    keywords: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
