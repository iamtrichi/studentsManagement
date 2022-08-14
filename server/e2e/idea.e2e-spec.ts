import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { IdeaDTO } from '../src/service/dto/idea.dto';
import { IdeaService } from '../src/service/idea.service';

describe('Idea Controller', () => {
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
            .overrideProvider(IdeaService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all ideas ', async () => {
        const getEntities: IdeaDTO[] = (await request(app.getHttpServer()).get('/api/ideas').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET ideas by id', async () => {
        const getEntity: IdeaDTO = (
            await request(app.getHttpServer())
                .get('/api/ideas/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create ideas', async () => {
        const createdEntity: IdeaDTO = (
            await request(app.getHttpServer()).post('/api/ideas').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update ideas', async () => {
        const updatedEntity: IdeaDTO = (
            await request(app.getHttpServer()).put('/api/ideas').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update ideas from id', async () => {
        const updatedEntity: IdeaDTO = (
            await request(app.getHttpServer())
                .put('/api/ideas/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE ideas', async () => {
        const deletedEntity: IdeaDTO = (
            await request(app.getHttpServer())
                .delete('/api/ideas/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
