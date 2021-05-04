import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProfessionalAvailability } from '@rest/professional-availabilities/professional-availability.entity';

@Entity({ name: 'professionals' })
export class Professional {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @OneToMany(() => ProfessionalAvailability, (availability) => availability.professional, { cascade: true })
    availabilities: ProfessionalAvailability[];
}
