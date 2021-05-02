module.exports = [
    {
        name: 'default',
        type: 'sqlite',
        database: './my.db',
        synchronize: true,
        logging: false,
        entities: ['src/**/*.entity.ts'],
    },
];
