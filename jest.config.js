module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'],
    bail: true,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@database/(.*)$': '<rootDir>/src/database/$1',
        '^@rest/(.*)$': '<rootDir>/src/rest/$1',
    },
};
