import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professional } from '../professionals/professional.entity';
import { Booking } from './booking.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
    imports: [TypeOrmModule.forFeature([Professional, Booking])],
    providers: [BookingsService],
    controllers: [BookingsController],
})
export class BookingsModule {}
