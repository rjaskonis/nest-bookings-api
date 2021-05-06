import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Professional } from './professional.entity';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { GetProfessionalsSlotsDto } from './dto/get-professionals-slots.dto';

@Controller('professionals')
export class ProfessionalsController {
    constructor(private readonly professionalService: ProfessionalsService) {}

    @Get()
    async getProfessionals(): Promise<Professional[]> {
        return this.professionalService.getProfessionals();
    }

    @Get('slots')
    async getProfessionalsSlots(@Query() getProfessionalsSlotsDto: GetProfessionalsSlotsDto): Promise<any[]> {
        console.log(getProfessionalsSlotsDto);

        return this.professionalService.getProfessionalsSlots(getProfessionalsSlotsDto);
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
