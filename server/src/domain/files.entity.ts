/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Files.
 */
@Entity('files')
export class Files extends BaseEntity {
    @Column({ type: 'blob', name: 'url', nullable: true })
    url: any;

    @Column({ name: 'url_content_type', nullable: true })
    urlContentType: string;
    @Column({ name: 'description', nullable: true })
    description: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
