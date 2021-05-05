import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { IsInt, IsOptional, ValidateIf } from 'class-validator';
import { validateTimeFormat } from '@/rest/utils/time';

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
    @IsInt()
    @ValidateIf((booking: UpdateBookingDto) => {
        if (!booking.weekday) return;

        const weekdays = [0, 1, 2, 3, 4, 5, 6]; // 0 - sunday, 1 - monday, 2 - tuesday,... (& so on)
        if (weekdays.includes(booking.weekday)) return true;

        throw new BadRequestException('Invalid weekday. Should be between 0 and 6');
    })
    @ApiProperty({ type: Number, required: false })
    weekday: number;

    @ValidateIf((booking: UpdateBookingDto) => {
        if (!booking.time) return true;

        if (!validateTimeFormat(booking.time)) throw new BadRequestException("Invalid time format for 'time'");

        return true;
    })
    @ApiProperty({ type: Number, required: false })
    time: string;
}
