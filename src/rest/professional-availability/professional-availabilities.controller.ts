import { Body, Controller, Get, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProfessionalAvailability } from './professional-availability.entity';
import { ProfessionalAvailabilitiesService } from './professional-availabilities.service';
import { CreateProfessionalAvailabilityDto } from './dto/create-professional-availability.dto';
import { UpdateProfessionalAvailabilityDto } from './dto/update-professional-availability.dto';

@Controller('professional-availabilities')
export class ProfessionalAvailabilitiesController {
    constructor(private readonly professionalAvailabilitiesService: ProfessionalAvailabilitiesService) {}

    @Get()
    async getAvailabilities(): Promise<ProfessionalAvailability[]> {
        return this.professionalAvailabilitiesService.getAvailabilities();
    }

    @Post()
    async addAvailability(@Body() createProfessionalDto: CreateProfessionalAvailabilityDto): Promise<ProfessionalAvailability> {
        return this.professionalAvailabilitiesService.addAvailability(createProfessionalDto);
    }

    @Put(':id')
    updateAvailability(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
        @Body() updateProfessionalAvailabilityDto: UpdateProfessionalAvailabilityDto,
    ): Promise<ProfessionalAvailability> | Promise<NotFoundException> {
        return this.professionalAvailabilitiesService.updateAvailability(id, updateProfessionalAvailabilityDto);
    }
}
