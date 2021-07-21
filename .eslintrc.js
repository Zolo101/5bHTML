module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2020: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 11,
    },
    plugins: [
        "@typescript-eslint",
    ],
    rules: {
        "linebreak-style": ["error", "windows"],
        indent: ["error", 4, { SwitchCase: 1 }],
        quotes: ["error", "double"],
        "no-console": 0, // ["warn", { allow: ["warn", "error"] }],
        "max-classes-per-file": ["warn", 3],
        "no-trailing-spaces": 1,
        "no-unused-vars": 0,
        "@typescript-eslint/no-unused-vars": 1,
        "no-undef": 0,

        "global-require": 0,
        "import/extensions": 0,
        "import/no-unresolved": 0, // maybe 1?

        "comma-spacing": 2,
        "quote-props": ["warn", "as-needed"],
        // "spaced-comment": 0,
        "space-infix-ops": 2,
        "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
        "lines-between-class-members": 0,
        "no-param-reassign": ["error", { props: false }],
    },
};
