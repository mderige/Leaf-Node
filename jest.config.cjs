module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.cjs'],
  transform: {
    '^.+\\.vue$': '<rootDir>/src/test/vue-sfc-transformer.cjs',
  },
  moduleNameMapper: {
    '^\\.\\./assets/plantImages$': '<rootDir>/src/test/mocks/plant-images.cjs',
    '^\\.\\./data/mockData$': '<rootDir>/src/test/mocks/mock-data.cjs',
    '^lucide-vue-next$': '<rootDir>/src/test/mocks/lucide-vue-next.cjs',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/test/mocks/image.cjs',
  },
};
