import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { AppreciationsDTO } from '../src/service/dto/appreciations.dto';
import { AppreciationsService } from '../src/service/appreciations.service';

describe('Appreciations Controller', () => {
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
            .overrideProvider(AppreciationsService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all appreciations ', async () => {
        const getEntities: AppreciationsDTO[] = (
            await request(app.getHttpServer()).get('/api/appreciations').expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET appreciations by id', async () => {
        const getEntity: AppreciationsDTO = (
            await request(app.getHttpServer())
                .get('/api/appreciations/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create appreciations', async () => {
        const createdEntity: AppreciationsDTO = (
            await request(app.getHttpServer()).post('/api/appreciations').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update appreciations', async () => {
        const updatedEntity: AppreciationsDTO = (
            await request(app.getHttpServer()).put('/api/appreciations').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update appreciations from id', async () => {
        const updatedEntity: AppreciationsDTO = (
            await request(app.getHttpServer())
                .put('/api/appreciations/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE appreciations', async () => {
        const deletedEntity: AppreciationsDTO = (
            await request(app.getHttpServer())
                .delete('/api/appreciations/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
