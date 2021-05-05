import { NotFoundException, Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from '../professionals/professional.entity';
import {
    addTimeToDatetime,
    addTimeToTime,
    isDatetimeEqualAnotherTime,
    isTimeInTimeRange,
    parseDate,
    parseDateToTimeString,
} from '../utils/datetime';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Professional) private readonly professionalRepository: Repository<Professional>,
        @InjectRepository(Booking) private readonly bookingsRepository: Repository<Booking>,
    ) {}

    async getBookings(): Promise<Booking[]> {
        return this.bookingsRepository.find();
    }

    async addBooking(createBookingDto: CreateBookingDto) {
        const professional = await this.professionalRepository.findOne(createBookingDto.professional, {
            relations: ['availabilities', 'bookings'],
        });

        if (!professional) throw new BadRequestException('Professional not found');

        const booking = new Booking();

        booking.professional = professional;
        booking.customerName = createBookingDto.customerName;
        booking.datetime = parseDate(createBookingDto.datetime);

        const isSlotAvailable = await this.validateTimeSlotAvailable(professional, booking);

        if (!isSlotAvailable) throw new BadRequestException('Time slot not available');

        return this.bookingsRepository.save(booking);
    }

    async updateBooking(id: number, updateBookingDto: UpdateBookingDto) {
        const booking = await this.bookingsRepository.findOne(id);

        if (!booking) throw new NotFoundException('Booking not found');

        const professional = await this.professionalRepository.findOne(updateBookingDto.professional, {
            relations: ['availabilities', 'bookings'],
        });

        if (!professional) throw new BadRequestException('Professional not found');

        const updatedBooking: any = {
            ...booking,
            ...updateBookingDto,
            datetime: updateBookingDto.datetime ? parseDate(updateBookingDto.datetime) : booking.datetime,
        };

        const isSlotAvailable = await this.validateTimeSlotAvailable(professional, updatedBooking);

        if (!isSlotAvailable) throw new BadRequestException('Time slot not available');

        return this.bookingsRepository.save(updatedBooking);
    }

    private async validateTimeSlotAvailable(professional: Professional, booking: Booking): Promise<boolean> {
        let isSlotAvailable = true;

        if (!professional.availabilities.length) return false;

        professional.availabilities
            .filter((availability) => availability.weekday == booking.datetime.getDay())
            .forEach((availability) => {
                const maxTimeToSchedule = addTimeToTime(availability.toTime, -1, 'hour');

                if (!isTimeInTimeRange(parseDateToTimeString(booking.datetime), availability.fromTime, maxTimeToSchedule))
                    isSlotAvailable = false;
            });

        if (
            professional.bookings.filter((registeredBooking) => {
                return (
                    booking.id != registeredBooking.id &&
                    (isDatetimeEqualAnotherTime(booking.datetime, registeredBooking.datetime) ||
                        isDatetimeEqualAnotherTime(addTimeToDatetime(booking.datetime, -30, 'minutes'), registeredBooking.datetime) ||
                        isDatetimeEqualAnotherTime(addTimeToDatetime(booking.datetime, 30, 'minutes'), registeredBooking.datetime))
                );
            }).length
        )
            isSlotAvailable = false;

        return isSlotAvailable;
    }

    async deleteBooking(id: number) {
        const booking = await this.bookingsRepository.findOne(id);

        if (!booking) throw new NotFoundException('Booking not found');

        return this.bookingsRepository.delete(booking);
    }
}
