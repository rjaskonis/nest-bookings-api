import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProfessionalDto {
    @IsNotEmpty()
    @MaxLength(150)
    @ApiProperty({ type: String, required: true })
    name: string;

    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({ type: String, required: true })
    title: string;
}
