// @ts-check

import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

// export default tseslint.config(
//     eslint.configs.recommended,
//     tseslint.configs.strict,
// );

const srcConfig = tseslint.config({
    files: ['src/**/*.{ts,tsx}'],
    extends: [eslint.configs.recommended, tseslint.configs.strict],
    languageOptions: {
        globals: {
            ...globals.node,
        },
        parserOptions: {
            project: './tsconfig.lint.json',
        },
    },

    rules: {
        // about code metrics
        'max-lines-per-function': ['error', 300],
        'max-lines': ['error', 300],
        'max-len': ['error', { code: 120, ignoreComments: true }],
        'max-statements-per-line': ['error', { max: 1 }],
        'max-statements': ['error', 30],
        'max-nested-callbacks': ['error', 3],
        'max-params': ['error', 5],
        'max-depth': ['error', 5],
        complexity: ['error', 15],
        // about redundancy
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                args: 'all',
                argsIgnorePattern: '^_',
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                ignoreRestSiblings: true,
            },
        ],
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/consistent-type-imports': [
            'warn',
            { prefer: 'type-imports' },
        ],
        '@typescript-eslint/consistent-type-exports': 'warn',
        // no debugging code
        'no-console': 'warn',
    },
});

export default [
    {
        ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
    },
    ...srcConfig,
];
