import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, MaxLength, ValidateIf } from 'class-validator';
import { validateTimeFormat } from '@/rest/utils/time';

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
    @IsInt()
    @ValidateIf((booking: CreateBookingDto) => {
        const weekdays = [0, 1, 2, 3, 4, 5, 6]; // 0 - sunday, 1 - monday, 2 - tuesday,... (& so on)
        if (weekdays.includes(booking.weekday)) return true;

        throw new BadRequestException('Invalid weekday. Must be between 0 and 6');
    })
    @ApiProperty({ type: Number, required: true })
    weekday: number;

    @IsNotEmpty()
    @ValidateIf((booking: CreateBookingDto) => {
        if (!validateTimeFormat(booking.time)) throw new BadRequestException("Invalid time format for 'time'");

        return true;
    })
    @ApiProperty({ type: Number, required: true })
    time: string;
}
