module.exports = {
  extends: ['spv', 'plugin:jest/recommended'],
  env: {
    jest: true
  },
  globals: {
    document: true
  },
  plugins: ['jest'],
};
