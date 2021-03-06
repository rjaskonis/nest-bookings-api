import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, ValidateIf } from 'class-validator';
import { isTimeEqualOrAfterAnotherTime, validateTimeFormat } from '@rest/utils/datetime';

export class CreateProfessionalAvailabilityDto {
    @IsNotEmpty()
    @IsInt()
    @ValidateIf((availability: CreateProfessionalAvailabilityDto) => {
        if (availability.professional > 0) return true;

        throw new BadRequestException();
    })
    @ApiProperty({ type: Number, required: true })
    professional: number;

    @IsNotEmpty()
    @IsInt()
    @ValidateIf((availability: CreateProfessionalAvailabilityDto) => {
        const weekdays = [0, 1, 2, 3, 4, 5, 6]; // 0 - sunday, 1 - monday, 2 - tuesday,... (& so on)
        if (weekdays.includes(availability.weekday)) return true;

        throw new BadRequestException('Invalid weekday. Must be between 0 and 6');
    })
    @ApiProperty({ type: Number, required: true })
    weekday: number;

    @IsNotEmpty()
    @ValidateIf((availability: CreateProfessionalAvailabilityDto) => {
        if (!validateTimeFormat(availability.fromTime)) throw new BadRequestException("Invalid time format for 'fromTime'");

        if (
            availability.toTime &&
            validateTimeFormat(availability.toTime) &&
            isTimeEqualOrAfterAnotherTime(availability.fromTime, availability.toTime)
        )
            throw new BadRequestException("'fromTime' must be before 'toTime'");

        return true;
    })
    @ApiProperty({ type: Number, required: true })
    fromTime: string;

    @IsNotEmpty()
    @ValidateIf((availability: CreateProfessionalAvailabilityDto) => {
        if (!validateTimeFormat(availability.toTime)) throw new BadRequestException("Invalid time format for 'toTime'");

        return true;
    })
    @ApiProperty({ type: Number, required: true })
    toTime: string;
}
