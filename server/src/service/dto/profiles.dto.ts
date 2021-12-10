/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A ProfilesDTO object.
 */
export class ProfilesDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'profileIdentifier field' })
    profileIdentifier: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
