/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }]
  },
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  setupFilesAfterEnv: [],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Contournement pour les modules ESM
  transformIgnorePatterns: [
    '/node_modules/(?!string-width|strip-ansi|ansi-regex|emoji-regex|cliui|yargs|wrap-ansi|wrap-ansi-cjs)/'
  ]
};

module.exports = config;
