import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { AppModule } from '@rest/app.module';
import { ProfessionalsController } from '@rest/professional/professionals.controller';
import { ProfessionalAvailabilitiesController } from '@rest/professional-availability/professional-availabilities.controller';
import { Professional } from '@/rest/professional/professional.entity';

describe('ProfessionalAvailabilitiesController (e2e)', () => {
    let app: INestApplication;
    let professional: Professional;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        await clearProfessionals();

        const professionalsController = app.get<ProfessionalsController>(ProfessionalsController);

        professional = await professionalsController.addProfessional({ name: 'Renne Jaskonis', title: 'IT Guy' });
    });

    beforeEach(async () => {
        await clearAvailabilities();
    });

    // test('GET /professional-availabilities', async () => {
    //     const professionalAvailabilitiesController = app.get<ProfessionalAvailabilitiesController>(ProfessionalAvailabilitiesController);

    //     await professionalAvailabilitiesController.addAvailability({
    //         professional: professional.id,
    //         weekday: 1,
    //         fromTime: '08:00',
    //         toTime: '12:00',
    //     });

    //     const response = await request(app.getHttpServer()).get('/professional-availabilities');

    //     console.log(response.body);

    //     expect(response.status).toBe(200);
    //     expect(response.body.constructor).toBe(Array);
    //     // return request(app.getHttpServer()).get('/professional-availabilities').expect(200);
    // });

    // test('POST /professional-availabilities', async () => {
    //     const response = await request(app.getHttpServer())
    //         .post('/professional-availabilities')
    //         .send({ professional: professional.id, weekday: 1, fromTime: '08:00', toTime: '12:00' });

    //     console.log(response.body);

    //     expect(response.status).toBe(201);
    // });

    // it("should return > 400 error on POST /professional-availabilities - validation testing on invalid time format for 'fromTime'", async () => {
    //     const response = await request(app.getHttpServer())
    //         .post('/professional-availabilities')
    //         .send({ professional: professional.id, weekday: 1, fromTime: '0800', toTime: '12:00' });

    //     console.log(response.body);

    //     expect(response.status).toBeGreaterThanOrEqual(400);
    // });

    // it("should return > 400 error on POST /professional-availabilities - validation testing on invalid time format for 'toTime'", async () => {
    //     const response = await request(app.getHttpServer())
    //         .post('/professional-availabilities')
    //         .send({ professional: professional.id, weekday: 1, fromTime: '08:00', toTime: '1200' });

    //     console.log(response.body);

    //     expect(response.status).toBeGreaterThanOrEqual(400);
    // });

    test('PUT /professional-availabilities/:id', async () => {
        const { body: createdAvailability } = await request(app.getHttpServer())
            .post('/professional-availabilities')
            .send({ professional: professional.id, weekday: 1, fromTime: '07:00', toTime: '10:00' });

        const updateResponse = await request(app.getHttpServer())
            .put(`/professional-availabilities/${createdAvailability.id}`)
            .send({ weekday: 3, fromTime: '07:30' });

        console.log(updateResponse.text);

        expect(updateResponse.status).toBe(200);
    });

    it("should return 400 error on PUT /professional-availabilities/:id - availability with incorrect 'toTime' format", async () => {
        const { body: createdAvailability } = await request(app.getHttpServer())
            .post('/professional-availabilities')
            .send({ professional: professional.id, weekday: 1, fromTime: '07:00', toTime: '10:00' });

        const updateResponse = await request(app.getHttpServer())
            .put(`/professional-availabilities/${createdAvailability.id}`)
            .send({ toTime: '1700' });

        console.log(updateResponse.text);

        expect(updateResponse.status).toBe(400);
    });

    afterAll((done) => {
        app.close();
        done();
    });

    async function clearProfessionals() {
        const connection: Connection = await createConnection({
            name: 'c1',
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

    async function clearAvailabilities() {
        const connection: Connection = await createConnection({
            name: 'c2',
            type: 'sqlite',
            database: './my.db',
            synchronize: true,
            logging: false,
            entities: ['rc/**/*.entity.ts'],
        });

        await connection.manager.query('DELETE FROM professional_availabilities');

        await connection.close();
    }
});
