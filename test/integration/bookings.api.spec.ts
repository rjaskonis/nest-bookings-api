import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { AppModule } from '@rest/app.module';
import { BookingsController } from '@rest/bookings/bookings.controller';
import { ProfessionalsController } from '@rest/professionals/professionals.controller';
import { Professional } from '@rest/professionals/professional.entity';
import { ProfessionalAvailabilitiesController } from '@rest/professional-availabilities/professional-availabilities.controller';

describe('BookingsController (e2e)', () => {
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
        const professionalAvailabilitiesController = app.get<ProfessionalAvailabilitiesController>(ProfessionalAvailabilitiesController);

        professional = await professionalsController.addProfessional({ name: 'Renne Jaskonis', title: 'IT Guy' });

        await professionalAvailabilitiesController.addAvailability({
            professional: professional.id,
            weekday: 1,
            fromTime: '08:00',
            toTime: '12:00',
        });
    });

    beforeEach(async () => {
        await clearBookings();
    });

    test('GET /bookings', async () => {
        const bookingsController = app.get<BookingsController>(BookingsController);

        await bookingsController.addBooking({ professional: professional.id, customerName: 'Super patient', datetime: '2021-05-03 11:00' });

        const response = await request(app.getHttpServer()).get('/bookings');

        console.log(response.body);

        // const [booking] = response.body;
        // console.log(new Date(booking.datetime).toLocaleTimeString()); // 11:20:00 AM

        expect(response.status).toBe(200);
        expect(response.body.constructor).toBe(Array);
        // return request(app.getHttpServer()).get('/bookings').expect(200);
    });

    test('POST /bookings', async () => {
        const response = await request(app.getHttpServer())
            .post('/bookings')
            .send({ professional: professional.id, customerName: 'Super patient', datetime: '2021-05-03 11:00' });

        console.log(response.body);

        expect(response.status).toBe(201);
    });

    it("should return > 400 error on POST /bookings - validation testing on invalid time format for 'time'", async () => {
        const response = await request(app.getHttpServer())
            .post('/bookings')
            .send({ professional: professional.id, customerName: 'Super patient', datetime: '2021-05-03 1120' });

        console.log(response.body);

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should return > 400 error on POST /bookings - validation testing on invalid time', async () => {
        const response = await request(app.getHttpServer())
            .post('/bookings')
            .send({ professional: professional.id, customerName: 'Super patient', datetime: '2021-05-03 11:15' });

        console.log(response.body);

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should return > 400 error on POST /bookings - time slot not available', async () => {
        const bookingsController = app.get<BookingsController>(BookingsController);

        await bookingsController.addBooking({ professional: professional.id, customerName: 'Super patient', datetime: '2021-05-03 11:00' });

        const response = await request(app.getHttpServer())
            .post('/bookings')
            .send({ professional: professional.id, customerName: 'Super patient', datetime: '2021-05-03 10:30' });

        console.log(response.body);

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test('PUT /bookings/:id', async () => {
        const { body: createdBooking } = await request(app.getHttpServer())
            .post('/bookings')
            .send({ professional: professional.id, customerName: 'Super patient', datetime: '2021-05-03 11:00' });

        console.log(`/bookings/${createdBooking.id}`);

        const updateResponse = await request(app.getHttpServer())
            .put(`/bookings/${createdBooking.id}`)
            .send({ customerName: 'Renne Jaskonis (updated)' });

        console.log(updateResponse.text);

        expect(updateResponse.status).toBe(200);
    });

    it('should return 404 error on PUT /bookings/:id - booking with specified ID not found', async () => {
        const { body: createdBooking } = await request(app.getHttpServer())
            .post('/bookings')
            .send({ professional: professional.id, customerName: 'Super patient', datetime: '2021-05-03 11:00' });

        const updateResponse = await request(app.getHttpServer()).put(`/bookings/0`).send({ name: 'Jaskonis' });

        // console.log(updateResponse.status, updateResponse.body.message);

        expect(updateResponse.status).toBe(404);
    });

    it('should return 400 error on PUT /bookings/:id - booking slot not available', async () => {
        const { body: createdBooking } = await request(app.getHttpServer())
            .post('/bookings')
            .send({ professional: professional.id, customerName: 'Super patient', datetime: '2021-05-03 11:00' });

        await request(app.getHttpServer())
            .post('/bookings')
            .send({ professional: professional.id, customerName: 'Super patient', datetime: '2021-05-03 10:00' });

        const updateResponse = await request(app.getHttpServer()).put(`/bookings/${createdBooking.id}`).send({ datetime: '2021-05-03 09:30' });

        console.log(updateResponse.status, updateResponse.body.message);

        expect(updateResponse.status).toBe(400);
    });

    test('DELETE /bookings/:id', async () => {
        const { body: createdBooking } = await request(app.getHttpServer())
            .post('/bookings')
            .send({ professional: professional.id, customerName: 'Super patient', datetime: '2021-05-03 11:00' });

        const deleteResponse = await request(app.getHttpServer()).delete(`/bookings/${createdBooking.id}`);

        console.log(deleteResponse.text);

        expect(deleteResponse.status).toBe(204);
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
            entities: ['src/**/*.entity.ts'],
        });

        await connection.manager.query('DELETE FROM bookings');
        await connection.manager.query('DELETE FROM professional_availabilities');
        await connection.manager.query('DELETE FROM professionals');

        await connection.close();
    }

    async function clearBookings() {
        const connection: Connection = await createConnection({
            name: 'c2',
            type: 'sqlite',
            database: './my.db',
            synchronize: true,
            logging: false,
            entities: ['src/**/*.entity.ts'],
        });

        await connection.manager.query('DELETE FROM bookings');

        await connection.close();
    }
});
