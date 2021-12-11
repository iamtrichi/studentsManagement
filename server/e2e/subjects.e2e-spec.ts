import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { SubjectsDTO } from '../src/service/dto/subjects.dto';
import { SubjectsService } from '../src/service/subjects.service';

describe('Subjects Controller', () => {
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
            .overrideProvider(SubjectsService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all subjects ', async () => {
        const getEntities: SubjectsDTO[] = (await request(app.getHttpServer()).get('/api/subjects').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET subjects by id', async () => {
        const getEntity: SubjectsDTO = (
            await request(app.getHttpServer())
                .get('/api/subjects/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create subjects', async () => {
        const createdEntity: SubjectsDTO = (
            await request(app.getHttpServer()).post('/api/subjects').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update subjects', async () => {
        const updatedEntity: SubjectsDTO = (
            await request(app.getHttpServer()).put('/api/subjects').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update subjects from id', async () => {
        const updatedEntity: SubjectsDTO = (
            await request(app.getHttpServer())
                .put('/api/subjects/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE subjects', async () => {
        const deletedEntity: SubjectsDTO = (
            await request(app.getHttpServer())
                .delete('/api/subjects/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
