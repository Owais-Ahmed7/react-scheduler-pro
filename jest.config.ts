import type { Config } from 'jest';

const config: Config = {
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.test.{ts,tsx}',
    '**/*.{spec,test}.{ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__mocks__/',
    '/__tests__/helpers/',
  ],
  moduleNameMapper: {
    '\\.(scss|css)$': '<rootDir>/src/lib/__mocks__/styleMock.ts',
  },
  collectCoverageFrom: [
    'src/lib/**/*.{ts,tsx}',
    '!src/lib/**/*.d.ts',
    '!src/lib/**/index.{ts,tsx}',
    '!src/lib/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 70,
      statements: 70,
    },
  },
  coverageReporters: ['text', 'text-summary', 'lcov', 'cobertura'],
};

export default config;
