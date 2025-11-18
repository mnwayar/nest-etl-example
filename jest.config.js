/* eslint-disable no-undef */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@infra/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@interface/(.*)$': '<rootDir>/src/interface/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  maxWorkers: 1,
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'apps/api/src/**/*.ts',
    'apps/etl-runner/src/**/*.ts',
    'src/**/*.ts',
    '!**/*.module.ts',
    '!**/main.ts',
  ],
};
