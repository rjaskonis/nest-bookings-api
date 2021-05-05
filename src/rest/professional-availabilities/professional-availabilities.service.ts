import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ProfessionalAvailability } from './professional-availability.entity';
import { CreateProfessionalAvailabilityDto } from './dto/create-professional-availability.dto';
import { UpdateProfessionalAvailabilityDto } from './dto/update-professional-availability.dto';
import { Professional } from '@rest/professionals/professional.entity';
import { isTimeInTimeRange } from '@rest/utils/datetime';

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

        const isValidTimeRangeAvailability = await this.validateTimeRangeAvailability(availability);

        if (!isValidTimeRangeAvailability) throw new BadRequestException('Time range already defined');

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

        const isValidTimeRangeAvailability = await this.validateTimeRangeAvailability(updatedProfessionalAvailabilityDto);

        if (!isValidTimeRangeAvailability) throw new BadRequestException('Time range already defined');

        return this.availabilityRepository.save(updatedProfessionalAvailabilityDto);
    }

    private async validateTimeRangeAvailability(newAvailability: ProfessionalAvailability): Promise<boolean> {
        const weekdayTimeRangeRegistries: ProfessionalAvailability[] = await this.availabilityRepository.find({
            where: newAvailability.id
                ? { id: Not(newAvailability.id), professional: newAvailability.professional, weekday: newAvailability.weekday }
                : { professional: newAvailability.professional, weekday: newAvailability.weekday },
        });

        if (!weekdayTimeRangeRegistries.length) return true;

        let isValidTimeRange = true;

        weekdayTimeRangeRegistries.forEach((registeredAvailability) => {
            if (
                isTimeInTimeRange(newAvailability.fromTime, registeredAvailability.fromTime, registeredAvailability.toTime) ||
                isTimeInTimeRange(newAvailability.toTime, registeredAvailability.fromTime, registeredAvailability.toTime) ||
                isTimeInTimeRange(registeredAvailability.fromTime, newAvailability.fromTime, newAvailability.toTime) ||
                isTimeInTimeRange(registeredAvailability.toTime, newAvailability.fromTime, newAvailability.toTime)
            )
                isValidTimeRange = false;
        });

        return isValidTimeRange;
    }

    async deleteAvailability(id: number) {
        const availability = await this.availabilityRepository.findOne(id);

        if (!availability) throw new NotFoundException('Availability not found');

        return this.availabilityRepository.delete(availability);
    }
}
