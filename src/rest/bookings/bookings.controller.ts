import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @Get()
    async getBookings(): Promise<Booking[]> {
        return this.bookingsService.getBookings();
    }

    @Post()
    async addBooking(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
        return this.bookingsService.addBooking(createBookingDto);
    }

    @Put(':id')
    updateBooking(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
        @Body() updateBookingDto: UpdateBookingDto,
    ): Promise<Booking> | Promise<NotFoundException> {
        console.log('so far so good');
        return this.bookingsService.updateBooking(id, updateBookingDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteBooking(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    ): Promise<any> | Promise<NotFoundException> {
        return this.bookingsService.deleteBooking(id);
    }
}
