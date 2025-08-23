import js from '@eslint/js';
//import tseslint from '@typescript-eslint/eslint-plugin';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

///** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  { ignores: ['**/node_modules/**', '**/dist/**', 'pnpm-lock.yaml', '.env*'] },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    files: ['packages/*/src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.node, ...globals.es2024 },
    },
    rules: {},
  },
  prettier,
);
