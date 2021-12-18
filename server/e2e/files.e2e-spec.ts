import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { FilesDTO } from '../src/service/dto/files.dto';
import { FilesService } from '../src/service/files.service';

describe('Files Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(FilesService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all files ', async () => {
        const getEntities: FilesDTO[] = (await request(app.getHttpServer()).get('/api/files').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET files by id', async () => {
        const getEntity: FilesDTO = (
            await request(app.getHttpServer())
                .get('/api/files/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create files', async () => {
        const createdEntity: FilesDTO = (
            await request(app.getHttpServer()).post('/api/files').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update files', async () => {
        const updatedEntity: FilesDTO = (
            await request(app.getHttpServer()).put('/api/files').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update files from id', async () => {
        const updatedEntity: FilesDTO = (
            await request(app.getHttpServer())
                .put('/api/files/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE files', async () => {
        const deletedEntity: FilesDTO = (
            await request(app.getHttpServer())
                .delete('/api/files/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
