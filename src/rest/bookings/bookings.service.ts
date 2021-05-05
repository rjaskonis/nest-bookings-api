import { NotFoundException, Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from '../professionals/professional.entity';
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
        const professional = await this.professionalRepository.findOne(createBookingDto.professional);

        if (!professional) throw new BadRequestException('Professional not found');

        const booking = new Booking();

        booking.professional = professional;
        booking.customerName = createBookingDto.customerName;
        booking.weekday = createBookingDto.weekday;
        booking.time = createBookingDto.time;

        return this.bookingsRepository.save(booking);
    }

    async updateBooking(id: number, updateBookingDto: UpdateBookingDto) {
        const booking = await this.bookingsRepository.findOne(id);

        if (!booking) throw new NotFoundException('Booking not found');

        const professional = await this.professionalRepository.findOne(updateBookingDto.professional);

        if (!professional) throw new BadRequestException('Professional not found');

        const updatedBooking: any = { ...booking, ...updateBookingDto };

        return this.bookingsRepository.save(updatedBooking);
    }

    async deleteBooking(id: number) {
        const booking = await this.bookingsRepository.findOne(id);

        if (!booking) throw new NotFoundException('Booking not found');

        return this.bookingsRepository.delete(booking);
    }
}
