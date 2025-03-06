const path = require('path');
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 30000,
    rootDir: path.resolve(__dirname, '.'),
    testMatch: ['**/__tests__/**/*.test.ts'],
};
