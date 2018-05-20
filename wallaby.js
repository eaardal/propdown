/* eslint-disable global-require */

module.exports = wallaby => ({
  files: ['src/**/*.js*', '!src/**/__tests__/*.js', 'jest.json'],
  tests: ['src/**/__tests__/*.js'],
  env: {
    type: 'node',
    runner: 'node',
  },
  testFramework: 'jest',
  compilers: {
    '**/*.js': wallaby.compilers.babel(),
    '**/*.jsx': wallaby.compilers.babel(),
  },
  setup: () => {
    const jestConfig = require('./jest.json');
    wallaby.testFramework.configure(jestConfig);
  },
});
