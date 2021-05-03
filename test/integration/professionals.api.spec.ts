import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { AppModule } from '@rest/app.module';
import { ProfessionalsController } from '@rest/professional/professionals.controller';

describe('ProfessionalsController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    beforeEach(async () => {
        await clearTableData();
    });

    test('GET /professionals', async () => {
        const professionalsController = app.get<ProfessionalsController>(ProfessionalsController);

        await professionalsController.addProfessional({ name: 'Renne Jaskonis', title: 'IT Guy' });

        const response = await request(app.getHttpServer()).get('/professionals');

        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body.constructor).toBe(Array);
        // return request(app.getHttpServer()).get('/professionals').expect(200);
    });

    test('POST /professionals', async () => {
        const response = await request(app.getHttpServer()).post('/professionals').send({ name: 'Renne Jaskonis', title: 'IT Guy' });

        console.log(response.body);

        expect(response.status).toBe(201);
    });

    it('should return > 400 error on POST /professionals - validation testing', async () => {
        const response = await request(app.getHttpServer()).post('/professionals').send({ name: 'Only Renne without title' });

        console.log(response.body);

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test('PUT /professionals/:id', async () => {
        const { body: createdProfessional } = await request(app.getHttpServer()).post('/professionals').send({ name: 'Renne', title: 'IT Guy' });

        const updateResponse = await request(app.getHttpServer())
            .put(`/professionals/${createdProfessional.id}`)
            .send({ name: 'Renne Jaskonis (updated)' });

        console.log(updateResponse.text);

        expect(updateResponse.status).toBe(200);
    });

    it('should return 400 error on PUT /professionals/:id - professional with specified ID not found', async () => {
        const { body: createdProfessional } = await request(app.getHttpServer()).post('/professionals').send({ name: 'Renne', title: 'IT Guy' });

        const updateResponse = await request(app.getHttpServer()).put(`/professionals/0`).send({ name: 'Jaskonis' });

        // console.log(updateResponse.status, updateResponse.body.message);

        expect(updateResponse.status).toBe(400);
    });

    afterAll((done) => {
        app.close();
        done();
    });

    async function clearTableData() {
        const connection: Connection = await createConnection({
            name: 'test',
            type: 'sqlite',
            database: './my.db',
            synchronize: true,
            logging: false,
            entities: ['rc/**/*.entity.ts'],
        });

        await connection.manager.query('DELETE FROM professional_availabilities');
        await connection.manager.query('DELETE FROM professionals');

        await connection.close();
    }
});
