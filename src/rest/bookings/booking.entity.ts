import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Professional } from '../professionals/professional.entity';

@Entity({ name: 'bookings' })
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Professional, (professional: Professional) => professional.availabilities)
    professional: Professional;

    @Column({ type: 'varchar', length: 150 })
    customerName: string;

    @Column({ type: 'datetime' })
    datetime: Date;
}
