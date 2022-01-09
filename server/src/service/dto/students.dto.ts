/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A StudentsDTO object.
 */
export class StudentsDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'studentIdentifier field' })
    studentIdentifier: string;

    @ApiModelProperty({ description: 'studentIdentifier field' })
    identifier: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'studentFirstName field' })
    studentFirstName: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'studentLastName field' })
    studentLastName: string;

    @ApiModelProperty({ description: 'dateOfBirth field', required: false })
    dateOfBirth: any;

    @ApiModelProperty({ description: 'schoolYear field', required: false })
    schoolYear: string;

    @ApiModelProperty({ description: 'className field', required: false })
    className: string;

    @ApiModelProperty({ description: 'full student name field', required: false })
    studentName: string;

    @ApiModelProperty({ description: 'image field', required: false })
    image: any;

    imageContentType: string;

    @ApiModelProperty({ description: 'subjects field', required: false })
    subjects: any[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
