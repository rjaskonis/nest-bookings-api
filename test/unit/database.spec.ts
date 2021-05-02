import { ProfessionalAvailability } from '@/rest/professional-availability/professional-availability.entity';
import { Professional } from '@/rest/professional/professional.entity';
import { Connection, createConnection, Repository } from 'typeorm';

describe('Testing database operations', () => {
    let connection: Connection;

    beforeAll(async () => {
        connection = await createConnection();

        // await connection.createQueryRunner().dropSchema('default');
        // await connection.manager.clear(ProfessionalAvailability);
        // await connection.manager.clear(Professional);
    });

    beforeEach(async () => {
        await connection.manager.clear(ProfessionalAvailability);
        await connection.manager.clear(Professional);
    });

    it('should be connected to database', async () => {
        expect(connection.isConnected).toBe(true);
    });

    it('should create a professional', async () => {
        const professionalRepository: Repository<Professional> = connection.manager.getRepository(Professional);

        const professional: Professional = new Professional();

        professional.name = 'Renne Jaskonis';
        professional.title = 'IT Guy';

        await professionalRepository.save(professional);

        expect(professional).toBeDefined();
        expect(professional.id).toBeGreaterThan(0);
    });

    it('should create professional availabilities', async () => {
        const professionalRepository: Repository<Professional> = connection.manager.getRepository(Professional);
        const availabilityRepository: Repository<ProfessionalAvailability> = connection.manager.getRepository(ProfessionalAvailability);

        const professional: Professional = new Professional();
        const availability1 = new ProfessionalAvailability();
        const availability2 = new ProfessionalAvailability();

        availability1.weekday = 1;
        availability1.fromTime = '08:00';
        availability1.toTime = '12:00';

        availability2.weekday = 1;
        availability2.fromTime = '14:00';
        availability2.toTime = '18:00';

        professional.name = 'Renne Jaskonis';
        professional.title = 'IT Guy';
        professional.availabilities = [availability1, availability2];

        await professionalRepository.save(professional);

        const availabilities = await availabilityRepository.find();

        expect(professional).toBeDefined();
        expect(professional.id).toBeGreaterThan(0);
        expect(availabilities.length).toBe(2);
    });

    afterAll((done) => {
        connection.close();
        done();
    });
});
