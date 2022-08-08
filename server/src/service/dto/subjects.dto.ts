/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { Course } from 'src/domain/course.entity';
import { BaseDTO } from './base.dto';
import { CourseDTO } from './course.dto';

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

    @ApiModelProperty({
        isArray: true,
        description: 'Array of courses',
        required: false,
    })
    courses: Course[];

    @ApiModelProperty({
        description: 'niveau field',
        required: false,
    })
    niveau: string;
}
