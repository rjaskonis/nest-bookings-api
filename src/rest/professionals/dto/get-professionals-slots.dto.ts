import { validateDateFormat, validateDatetimeSpecification } from '@/rest/utils/datetime';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class GetProfessionalsSlotsDto {
    @IsNotEmpty()
    @ValidateIf((booking: GetProfessionalsSlotsDto) => {
        if (booking.fromDate && !validateDateFormat(booking.fromDate)) throw new BadRequestException("Invalid date format for 'fromDate'");

        return true;
    })
    @ApiProperty({ type: Number, required: true })
    fromDate: string;

    @IsNotEmpty()
    @ValidateIf((booking: GetProfessionalsSlotsDto) => {
        if (booking.toDate && !validateDateFormat(booking.toDate)) throw new BadRequestException("Invalid date format for 'toDate'");

        return true;
    })
    @ApiProperty({ type: Number, required: true })
    toDate: string;
}
