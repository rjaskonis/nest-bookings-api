import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalAvailability } from './professional-availability.entity';
import { ProfessionalAvailabilitiesController } from './professional-availabilities.controller';
import { ProfessionalAvailabilitiesService } from './professional-availabilities.service';
import { Professional } from '@rest/professional/professional.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Professional, ProfessionalAvailability])],
    providers: [ProfessionalAvailabilitiesService],
    controllers: [ProfessionalAvailabilitiesController],
})
export class ProfessionalAvailabilitiesModule {}
