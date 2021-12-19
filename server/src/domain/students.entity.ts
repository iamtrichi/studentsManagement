/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Students.
 */
@Entity('students')
export class Students extends BaseEntity {
    @Column({ name: 'student_identifier' })
    identifier: string;

    @Column({ name: 'studentIdentifier', unique: true })
    studentIdentifier: string;

    @Column({ name: 'studentFirstName' })
    studentFirstName: string;

    @Column({ name: 'studentLastName' })
    studentLastName: string;

    @Column({ type: 'date', name: 'dateOfBirth', nullable: true })
    dateOfBirth: any;

    @Column({ name: 'schoolYear', nullable: true })
    schoolYear: string;

    @Column({ name: 'className', nullable: true })
    className: string;

    @Column({ name: 'studentName', nullable: true })
    studentName: string;

    @Column({ type: 'blob', name: 'image', nullable: true })
    image: any;

    @Column({ name: 'imageContentType', nullable: true })
    imageContentType: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
