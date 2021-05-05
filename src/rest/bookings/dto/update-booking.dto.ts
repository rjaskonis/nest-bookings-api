import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { IsInt, IsOptional, ValidateIf } from 'class-validator';
import { validateDatetimeFormat, validateDatetimeSpecification, validateTimeFormat } from '@rest/utils/datetime';

export class UpdateBookingDto {
    @IsOptional()
    @IsInt()
    @ValidateIf((booking: UpdateBookingDto) => {
        if (!booking.professional || booking.professional > 0) return true;

        throw new BadRequestException();
    })
    @ApiProperty({ type: Number, required: false })
    professional: number;

    @IsOptional()
    @ApiProperty({ type: Number, required: false })
    customerName: string;

    @IsOptional()
    @ValidateIf((booking: UpdateBookingDto) => {
        if (!booking.datetime) return true;

        if (!validateDatetimeFormat(booking.datetime)) throw new BadRequestException("Invalid datetime format for 'datetime'");

        if (!validateDatetimeSpecification(booking.datetime))
            throw new BadRequestException('Invalid datetime specification (only able to define half or full hour)');

        return true;
    })
    @ApiProperty({ type: Number, required: false })
    datetime: string;
}
