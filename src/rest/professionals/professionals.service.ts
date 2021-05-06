import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from './professional.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { GetProfessionalsSlotsDto } from './dto/get-professionals-slots.dto';
import { addTimeToTime, getDayInformationFromDateRange, getTimesFromTimeRange, parseDate } from '../utils/datetime';
import dayjs from 'dayjs';

type slot = {
    available: boolean;
    time: String;
};

interface AvailabilityDay {
    date: Date;
    slots: slot[];
}

@Injectable()
export class ProfessionalsService {
    constructor(@InjectRepository(Professional) private readonly professionalsRepository: Repository<Professional>) {}

    async getProfessionals(): Promise<Professional[]> {
        return this.professionalsRepository.find();
    }

    async getProfessionalsSlots(getProfessionalsSlotsDto: GetProfessionalsSlotsDto): Promise<Professional[]> {
        const professionals = await this.professionalsRepository.find({ relations: ['availabilities', 'bookings'] });

        professionals.map((professional) => {
            const daysInformation = getDayInformationFromDateRange(
                parseDate(getProfessionalsSlotsDto.fromDate),
                parseDate(getProfessionalsSlotsDto.toDate),
            );

            const professionalAvailableDays = daysInformation.filter((day) => {
                return professional.availabilities.map((a) => a.weekday).includes(day.dayOfWeek);
            });

            const availabilityDays: AvailabilityDay[] = [];

            professionalAvailableDays.forEach((availableDay) => {
                const professionalAvailability = professional.availabilities.find((a) => a.weekday == availableDay.dayOfWeek);
                const availabilityDay: AvailabilityDay = {
                    date: availableDay.date,
                    slots: getTimesFromTimeRange(
                        professionalAvailability.fromTime,
                        addTimeToTime(professionalAvailability.toTime, -1, 'hour'),
                    ).map((time) => ({
                        time,
                        available: !professional.bookings.find(
                            (b) =>
                                dayjs(b.datetime).isSame(dayjs(`${dayjs(availableDay.date).format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm')) ||
                                dayjs(b.datetime)
                                    .add(-30, 'minutes')
                                    .isSame(dayjs(`${dayjs(availableDay.date).format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm')) ||
                                dayjs(b.datetime)
                                    .add(30, 'minutes')
                                    .isSame(dayjs(`${dayjs(availableDay.date).format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm')),
                        ),
                    })),
                };

                availabilityDays.push(availabilityDay);
            });

            (professional as any).availabilityDays = availabilityDays;

            return { ...professional };
        });

        return professionals;
    }

    addProfessional(createProfessionalDto: CreateProfessionalDto) {
        const professional = new Professional();

        professional.name = createProfessionalDto.name;
        professional.title = createProfessionalDto.title;

        return this.professionalsRepository.save(professional);
    }

    async updateProfessional(id: number, updateProfessionalDto: UpdateProfessionalDto) {
        const professional = await this.professionalsRepository.findOne(id);

        if (!professional) throw new NotFoundException('Professional not found');

        const updatedProfessional = { ...professional, ...updateProfessionalDto };

        return this.professionalsRepository.save(updatedProfessional);
    }

    async deleteProfessional(id: number) {
        const professional = await this.professionalsRepository.findOne(id);

        if (!professional) throw new NotFoundException('Professional not found');

        return this.professionalsRepository.delete(professional);
    }
}
