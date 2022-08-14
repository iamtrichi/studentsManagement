/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Idea.
 */
@Entity('idea')
export class Idea extends BaseEntity {
    @Column({ name: 'idee', nullable: true })
    idee: string;

    @Column({ name: 'theme', nullable: true })
    theme: string;

    @Column({ name: 'piste', nullable: true })
    piste: string;

    @Column({ name: 'niveau', nullable: true })
    niveau: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
