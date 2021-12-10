/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Appreciations.
 */
@Entity('appreciations')
export class Appreciations extends BaseEntity {
    @Column({ name: 'appreciationIdentifier', unique: true })
    appreciationIdentifier: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
