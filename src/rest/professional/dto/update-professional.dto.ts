import { CreateProfessionalDto } from './create-professional.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {}
