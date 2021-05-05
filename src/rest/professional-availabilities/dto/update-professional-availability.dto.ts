import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { IsInt, IsOptional, ValidateIf } from 'class-validator';
import { CreateProfessionalAvailabilityDto } from './create-professional-availability.dto';
import { isTimeEqualOrAfterAnotherTime, validateTimeFormat } from '@rest/utils/datetime';

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
        if (availability.fromTime && !availability.toTime)
            throw new BadRequestException("Shall not set 'fromTime' without setting 'toTime' as well");

        if (!availability.fromTime) return true;

        if (!validateTimeFormat(availability.fromTime)) throw new BadRequestException("Invalid time format for 'fromTime'");

        if (validateTimeFormat(availability.toTime) && isTimeEqualOrAfterAnotherTime(availability.fromTime, availability.toTime))
            throw new BadRequestException("'fromTime' must be before 'toTime'");

        return true;
    })
    @ApiProperty({ type: Number, required: false })
    fromTime: string;

    @ValidateIf((availability: CreateProfessionalAvailabilityDto) => {
        if (availability.toTime && !availability.fromTime)
            throw new BadRequestException("Shall not set 'toTime' without setting 'fromTime' as well");

        if (!availability.toTime) return true;

        if (!validateTimeFormat(availability.toTime)) throw new BadRequestException("Invalid time format for 'toTime'");

        return true;
    })
    @ApiProperty({ type: Number, required: false })
    toTime: string;
}
