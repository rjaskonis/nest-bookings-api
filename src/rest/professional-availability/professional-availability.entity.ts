import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Professional } from '../professional/professional.entity';

@Entity({ name: 'professional_availabilities' })
export class ProfessionalAvailability {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Professional, (professional: Professional) => professional.availabilities)
    professional: Professional;

    @Column({ type: 'int' })
    weekday: number;

    @Column({ name: 'fromtime', length: 5 })
    fromTime: string;

    @Column({ name: 'totime', length: 5 })
    toTime: string;
}
