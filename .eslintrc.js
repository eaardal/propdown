module.exports = {
  extends: ['airbnb-base', 'plugin:jest/recommended', 'prettier'],
  parser: 'babel-eslint',
  env: {
    jest: true,
  },
  globals: {
    document: true,
  },
  plugins: ['jest', 'prettier'],
  rules: {
    'linebreak-style': 0,
    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    'import/prefer-default-export': 0,
  },
};
