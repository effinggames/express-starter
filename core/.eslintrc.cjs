module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb-base',
  rules: {
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: true,
        peerDependencies: true
      }
    ],
    'comma-dangle': 'off',
    'func-names': 'off',
    'no-use-before-define': 'off',
    'no-plusplus': 'off',
    'no-unused-vars': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'no-console': 'off',
    'newline-after-var': 'error',
    'capitalized-comments': 'warn'
  }
};
