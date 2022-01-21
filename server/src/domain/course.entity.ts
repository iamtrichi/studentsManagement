/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Course.
 */
@Entity('course')
export class Course extends BaseEntity {
    @Column({ name: 'title', nullable: true })
    title: string;

    @Column({ type: 'blob', name: 'urls', nullable: true })
    urls: any;

    @Column({ name: 'urls_content_type', nullable: true })
    urlsContentType: string;

    @Column({ type: 'blob', name: 'urls1', nullable: true })
    urls1: any;

    @Column({ name: 'urls1_content_type', nullable: true })
    urls1ContentType: string;

    @Column({ name: 'note', nullable: true })
    note: number;

    @Column({ name: 'remarque', nullable: true })
    remarque: string;
    
    @Column({ name: 'ctype', nullable: true })
    ctype: string;

    @Column({ type: 'date', name: 'dateActivity', nullable: true })
    dateActivity: any;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
