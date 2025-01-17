import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
import vitest from 'eslint-plugin-vitest';
import prettier from 'eslint-plugin-prettier';
import airbnb from 'eslint-config-airbnb-typescript';
import boundaries from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ['*.ts', '*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: [
          './tsconfig.json',
          './tsconfig.app.json',
          './tsconfig.node.json',
        ],
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': a11y,
      vitest,
      prettier,
      import: importPlugin,
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: './src/refactoring/app/*' },
        { type: 'pages', pattern: './src/refactoring/pages/*' },
        { type: 'widgets', pattern: './src/refactoring/widgets/*' },
        { type: 'features', pattern: './src/refactoring/features/*' },
        { type: 'entities', pattern: './src/refactoring/entities/*' },
        { type: 'shared', pattern: './src/refactoring/shared/*' },
      ],
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...airbnb.rules,
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      'import/prefer-default-export': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/anchor-is-valid': 'off',
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'app',
              allow: ['pages', 'widgets', 'features', 'entities', 'shared'],
            },
            {
              from: 'pages',
              allow: ['widgets', 'features', 'entities', 'shared'],
            },
            { from: 'widgets', allow: ['features', 'entities', 'shared'] },
            { from: 'features', allow: ['entities', 'shared'] },
            { from: 'entities', allow: ['shared'] },
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],
    },
  },
  {
    files: ['*.test.{ts,tsx}'],
    plugins: {
      vitest,
    },
    rules: {
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-focused-tests': 'error',
      'vitest/no-identical-title': 'error',
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
];
