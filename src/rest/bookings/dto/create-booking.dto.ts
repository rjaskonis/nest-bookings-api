import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, MaxLength, ValidateIf } from 'class-validator';
import { validateDatetimeFormat, validateDatetimeSpecification } from '@rest/utils/datetime';

export class CreateBookingDto {
    @IsNotEmpty()
    @IsInt()
    @ValidateIf((booking: CreateBookingDto) => {
        if (booking.professional > 0) return true;

        throw new BadRequestException();
    })
    @ApiProperty({ type: Number, required: true })
    professional: number;

    @IsNotEmpty()
    @MaxLength(150)
    @ApiProperty({ type: String, required: true })
    customerName: string;

    @IsNotEmpty()
    @ValidateIf((booking: CreateBookingDto) => {
        if (booking.datetime && !validateDatetimeFormat(booking.datetime))
            throw new BadRequestException("Invalid datetime format for 'datetime'");

        if (booking.datetime && !validateDatetimeSpecification(booking.datetime))
            throw new BadRequestException('Invalid datetime specification (only able to define half or full hour)');

        return true;
    })
    @ApiProperty({ type: Number, required: true })
    datetime: string;
}
