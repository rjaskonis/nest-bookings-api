import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from './professional.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';

@Injectable()
export class ProfessionalsService {
    constructor(@InjectRepository(Professional) private readonly professionalsRepository: Repository<Professional>) {}

    async getProfessionals(): Promise<Professional[]> {
        return this.professionalsRepository.find();
    }

    addProfessional(createProfessionalDto: CreateProfessionalDto) {
        const professional = new Professional();

        professional.name = createProfessionalDto.name;
        professional.title = createProfessionalDto.title;

        return this.professionalsRepository.save(professional);
    }

    async updateProfessional(id: number, updateProfessionalDto: UpdateProfessionalDto) {
        const professional = await this.professionalsRepository.findOne(id);

        if (!professional) throw new BadRequestException('Professional not found');

        const updatedProfessional = { ...professional, ...updateProfessionalDto };

        return this.professionalsRepository.save(updatedProfessional);
    }
}
