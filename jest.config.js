module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverageFrom: [
    '<rootDir>/src/components/*.{vue,js}',
    '<rootDir>/src/utils/index.js',
    '<rootDir>/src/App.vue'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js']
}
