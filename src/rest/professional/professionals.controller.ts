import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Professional } from './professional.entity';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';

@Controller('professionals')
export class ProfessionalsController {
    constructor(private readonly professionalService: ProfessionalsService) {}

    @Get()
    async getProfessionals(): Promise<Professional[]> {
        return this.professionalService.getProfessionals();
    }

    @Post()
    async addProfessional(@Body() createProfessionalDto: CreateProfessionalDto): Promise<Professional> {
        return this.professionalService.addProfessional(createProfessionalDto);
    }

    @Put(':id')
    updateProfessional(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
        @Body() updateProfessionalDto: UpdateProfessionalDto,
    ): Promise<Professional> | Promise<NotFoundException> {
        return this.professionalService.updateProfessional(id, updateProfessionalDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteProfessional(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    ): Promise<any> | Promise<NotFoundException> {
        return this.professionalService.deleteProfessional(id);
    }
}
