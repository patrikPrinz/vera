import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['**/node_modules/**', '**/dist/**', 'pnpm-lock.yaml', '.env*', 'eslint.config.js'] },
  js.configs.recommended,
  {
    files: ['packages/*/src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.node, ...globals.es2024 },
    },
    rules: {},
  },
  prettier,
];
