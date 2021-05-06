import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { AppModule } from '@rest/app.module';
import { ProfessionalsController } from '@rest/professionals/professionals.controller';
import { ProfessionalAvailabilitiesController } from '@/rest/professional-availabilities/professional-availabilities.controller';
import { BookingsController } from '@/rest/bookings/bookings.controller';

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

    it('should return 404 error on PUT /professionals/:id - professional with specified ID not found', async () => {
        const { body: createdProfessional } = await request(app.getHttpServer()).post('/professionals').send({ name: 'Renne', title: 'IT Guy' });

        const updateResponse = await request(app.getHttpServer()).put(`/professionals/0`).send({ name: 'Jaskonis' });

        // console.log(updateResponse.status, updateResponse.body.message);

        expect(updateResponse.status).toBe(404);
    });

    test('DELETE /professionals/:id', async () => {
        const { body: createdProfessional } = await request(app.getHttpServer()).post('/professionals').send({ name: 'Renne', title: 'IT Guy' });

        const deleteResponse = await request(app.getHttpServer()).delete(`/professionals/${createdProfessional.id}`);

        console.log(deleteResponse.text);

        expect(deleteResponse.status).toBe(204);
    });

    test('GET /professionals/slots', async () => {
        await populateData();

        const response = await request(app.getHttpServer()).get('/professionals/slots');
        // const response = await request(app.getHttpServer()).get('/professionals/slots').query({ fromDate: '2021-05-01', toDate: '2021-05-07' });

        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body.constructor).toBe(Array);
        // return request(app.getHttpServer()).get('/professionals').expect(200);
    });

    afterAll((done) => {
        app.close();
        done();
    });

    async function populateData() {
        const professionalsController = app.get<ProfessionalsController>(ProfessionalsController);
        const professionalAvailabilitiesController = app.get<ProfessionalAvailabilitiesController>(ProfessionalAvailabilitiesController);
        const bookingsController = app.get<BookingsController>(BookingsController);

        const professional1 = await professionalsController.addProfessional({ name: 'Renne Jaskonis', title: 'IT Guy' });
        const professional2 = await professionalsController.addProfessional({ name: 'Some other guy 1', title: 'Psychologist' });
        const professional3 = await professionalsController.addProfessional({ name: 'Some other guy 2', title: 'Psychologist' });

        await professionalAvailabilitiesController.addAvailability({
            professional: professional1.id,
            weekday: 1,
            fromTime: '08:00',
            toTime: '12:00',
        });
        await professionalAvailabilitiesController.addAvailability({
            professional: professional1.id,
            weekday: 2,
            fromTime: '08:00',
            toTime: '12:00',
        });
        await professionalAvailabilitiesController.addAvailability({
            professional: professional2.id,
            weekday: 3,
            fromTime: '07:00',
            toTime: '13:00',
        });

        await professionalAvailabilitiesController.addAvailability({
            professional: professional2.id,
            weekday: 4,
            fromTime: '07:00',
            toTime: '13:00',
        });
        await professionalAvailabilitiesController.addAvailability({
            professional: professional3.id,
            weekday: 2,
            fromTime: '10:00',
            toTime: '18:00',
        });
        await professionalAvailabilitiesController.addAvailability({
            professional: professional3.id,
            weekday: 5,
            fromTime: '14:00',
            toTime: '20:00',
        });

        await bookingsController.addBooking({ professional: professional1.id, customerName: 'Hugh Laurie', datetime: '2021-05-03 11:00' });
        await bookingsController.addBooking({ professional: professional1.id, customerName: 'Tom Jones', datetime: '2021-05-03 09:00' });
        await bookingsController.addBooking({ professional: professional2.id, customerName: 'Tina Turner', datetime: '2021-05-05 11:00' });
        await bookingsController.addBooking({ professional: professional2.id, customerName: 'Chris Redfield', datetime: '2021-05-06 07:00' });
        await bookingsController.addBooking({ professional: professional3.id, customerName: 'Mary Jane', datetime: '2021-05-04 13:00' });
        await bookingsController.addBooking({ professional: professional3.id, customerName: 'Amelia Earhart', datetime: '2021-05-07 18:00' });
    }

    async function clearTableData() {
        const connection: Connection = await createConnection({
            name: 'test',
            type: 'sqlite',
            database: './my.db',
            synchronize: true,
            logging: false,
            entities: ['src/**/*.entity.ts'],
        });

        await connection.manager.query('DELETE FROM bookings');
        await connection.manager.query('DELETE FROM professional_availabilities');
        await connection.manager.query('DELETE FROM professionals');

        await connection.close();
    }
});
