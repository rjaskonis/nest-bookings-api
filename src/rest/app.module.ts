import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessionalsModule } from './professional/professionals.module';

@Module({
    imports: [TypeOrmModule.forRoot(), ProfessionalsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
