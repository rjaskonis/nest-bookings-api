import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const settings: TypeOrmModuleOptions = {
    name: 'default',
    type: 'sqlite',
    database: './my.db',
    autoLoadEntities: true,
    synchronize: true,
    logging: false,
};
