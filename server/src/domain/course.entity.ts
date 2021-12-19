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
    @Column({ name: 'ctype', nullable: true })
    ctype: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
