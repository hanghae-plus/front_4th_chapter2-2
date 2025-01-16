import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
import vitest from 'eslint-plugin-vitest';
import prettier from 'eslint-plugin-prettier';
import airbnb from 'eslint-config-airbnb-typescript';

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
    },
    rules: {
      ...airbnb.rules,
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off', // React 17+ JSX transform 사용
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
      'import/prefer-default-export': 'off', // 유틸 함수 내보내기 규칙 맞춤
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/anchor-is-valid': 'off', // Next.js의 <Link> 지원
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
