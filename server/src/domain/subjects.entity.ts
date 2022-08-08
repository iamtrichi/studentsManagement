/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Course } from './course.entity';

/**
 * A Subjects.
 */
@Entity('subjects')
export class Subjects extends BaseEntity {
    @Column({ name: 'subject', unique: true })
    subject: string;

    @Column({ name: 'keywords' })
    keywords: string;

    @Column({ name: 'niveau', nullable: true })
    niveau: string;

    @Column()
    courses: Course[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
