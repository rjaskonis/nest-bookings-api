import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { settings } from '@database/settings';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessionalAvailabilitiesModule } from './professional-availability/professional-availabilities.module';
import { ProfessionalsModule } from './professional/professionals.module';

@Module({
    imports: [TypeOrmModule.forRoot(settings), ProfessionalsModule, ProfessionalAvailabilitiesModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
