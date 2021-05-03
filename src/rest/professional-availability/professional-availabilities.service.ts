import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalAvailability } from './professional-availability.entity';
import { CreateProfessionalAvailabilityDto } from './dto/create-professional-availability.dto';
import { UpdateProfessionalAvailabilityDto } from './dto/update-professional-availability.dto';
import { Professional } from '@rest/professional/professional.entity';

@Injectable()
export class ProfessionalAvailabilitiesService {
    constructor(
        @InjectRepository(Professional) private readonly professionalRepository: Repository<Professional>,
        @InjectRepository(ProfessionalAvailability) private readonly availabilityRepository: Repository<ProfessionalAvailability>,
    ) {}

    async getAvailabilities(): Promise<ProfessionalAvailability[]> {
        return this.availabilityRepository.find();
    }

    async addAvailability(createProfessionalAvailabilityDto: CreateProfessionalAvailabilityDto) {
        const professional = await this.professionalRepository.findOne(createProfessionalAvailabilityDto.professional);

        if (!professional) throw new BadRequestException('Professional not found');

        const availability = new ProfessionalAvailability();

        availability.professional = professional;
        availability.weekday = createProfessionalAvailabilityDto.weekday;
        availability.fromTime = createProfessionalAvailabilityDto.fromTime;
        availability.toTime = createProfessionalAvailabilityDto.toTime;

        return this.availabilityRepository.save(availability);
    }

    async updateAvailability(id: number, updateProfessionalAvailabilityDto: UpdateProfessionalAvailabilityDto) {
        const availability = await this.availabilityRepository.findOne(id, {
            relations: ['professional'],
        });

        if (!availability) throw new BadRequestException('Availability not found');

        if (availability.professional.id != updateProfessionalAvailabilityDto.professional) {
            const newProfessional = await this.professionalRepository.findOne(updateProfessionalAvailabilityDto.professional);

            if (!newProfessional) throw new BadRequestException('Professional not found');
        }

        const updatedProfessionalAvailabilityDto: any = { ...availability, ...updateProfessionalAvailabilityDto };

        return this.availabilityRepository.save(updatedProfessionalAvailabilityDto);
    }
}
