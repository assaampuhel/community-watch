export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.mjs'],
  verbose: true,
  collectCoverageFrom: ['src/**/*.js', '!src/__tests__/**'],
};
