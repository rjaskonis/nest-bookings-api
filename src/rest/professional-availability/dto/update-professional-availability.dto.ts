import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { IsInt, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { CreateProfessionalAvailabilityDto } from './create-professional-availability.dto';
import { validateTimeFormat } from '@/rest/utils/validate-time';

export class UpdateProfessionalAvailabilityDto {
    @IsOptional()
    @IsInt()
    @ValidateIf((availability: CreateProfessionalAvailabilityDto) => {
        if (!availability.professional || availability.professional > 0) return true;

        throw new BadRequestException();
    })
    @ApiProperty({ type: Number, required: false })
    professional: number;

    @IsOptional()
    @IsInt()
    @ValidateIf((availability: CreateProfessionalAvailabilityDto) => {
        if (!availability.weekday) return;

        const weekdays = [0, 1, 2, 3, 4, 5, 6]; // 0 - sunday, 1 - monday, 2 - tuesday,... (& so on)
        if (weekdays.includes(availability.weekday)) return true;

        throw new BadRequestException('Invalid weekday. Should be between 0 and 6');
    })
    @ApiProperty({ type: Number, required: false })
    weekday: number;

    @ValidateIf((availability: CreateProfessionalAvailabilityDto) => {
        if (!availability.fromTime) return true;
        if (validateTimeFormat(availability.fromTime)) return true;

        throw new BadRequestException("Invalid time format for 'fromTime'");
    })
    @ApiProperty({ type: Number, required: false })
    fromTime: string;

    @ValidateIf((availability: CreateProfessionalAvailabilityDto) => {
        if (!availability.toTime) return true;
        if (validateTimeFormat(availability.toTime)) return true;

        throw new BadRequestException("Invalid time format for 'toTime'");
    })
    @ApiProperty({ type: Number, required: false })
    toTime: string;
}
