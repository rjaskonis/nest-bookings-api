import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Professional } from '../professionals/professional.entity';

@Entity({ name: 'bookings' })
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Professional, (professional: Professional) => professional.availabilities)
    professional: Professional;

    @Column({ type: 'varchar', length: 150 })
    customerName: string;

    @Column({ type: 'int' })
    weekday: number;

    @Column({ name: 'time', length: 5 })
    time: string;
}
