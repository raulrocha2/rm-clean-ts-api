
export default {
  bail: true,
  coverageProvider: "v8",
  roots: ['<rootDir>/src'],
  preset: ["ts-jest", "@shelf/jest-mongodb"],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  testMatch: ["**/*.spec.ts"],
};
