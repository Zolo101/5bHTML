module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "linebreak-style": 0,
    indent: 0,
    quotes: 0,
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "max-classes-per-file": 0,
    "no-trailing-spaces": 1,
    "no-unused-vars": 1,
    "no-undef": 0,

    "global-require": 0,
    "import/extensions": 0,
    "import/no-unresolved": 0, // maybe 1?

    "spaced-comment": 0,
    "space-infix-ops": 0,
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "lines-between-class-members": 0,
    "no-param-reassign": ["error", { props: false }],
  },
};
