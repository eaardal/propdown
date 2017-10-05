module.exports = {
  extends: ['airbnb', 'plugin:jest/recommended'],
  env: {
    jest: true
  },
  globals: {
    document: true
  },
  plugins: ['jest'],
  rules: {
   'linebreak-style': 0,
   'import/no-extraneous-dependencies': [2, {'devDependencies': true}],
   'import/prefer-default-export': 0,
 },
};
