module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.cjs'],
  transform: {
    '^.+\\.vue$': '<rootDir>/src/test/vue-sfc-transformer.cjs',
  },
  moduleNameMapper: {
    '^\\.\\./data/mockData$': '<rootDir>/src/test/mocks/mock-data.cjs',
    '^lucide-vue-next$': '<rootDir>/src/test/mocks/lucide-vue-next.cjs',
  },
};
