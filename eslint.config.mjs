// @ts-check

import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsdoceslint from 'eslint-plugin-tsdoc';
import jsdoc from 'eslint-plugin-jsdoc';

const srcConfig = tseslint.config({
    files: ['src/**/*.{ts,tsx}'],
    extends: [eslint.configs.recommended, tseslint.configs.strict],
    plugins: {
        jsdoc,
        tsdoc: tsdoceslint,
    },
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
        'tsdoc/syntax': 'warn',
        'jsdoc/require-jsdoc': [
            'warn',
            {
                publicOnly: true,
                contexts: [
                    'VariableDeclaration',
                    'TSInterfaceDeclaration',
                    'TSTypeAliasDeclaration',
                    'TSPropertySignature',
                    'TSMethodSignature',
                ],
            },
        ],
        'jsdoc/require-param-type': 'off',
        'jsdoc/require-returns-type': 'off',
    },
});

export default [
    {
        ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
    },
    jsdoc.configs['flat/recommended'],
    ...srcConfig,
];
