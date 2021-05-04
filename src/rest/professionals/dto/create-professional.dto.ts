import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProfessionalDto {
    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
    name: string;

    @IsNotEmpty()
    @ApiProperty({ type: String, required: true })
    title: string;
}
