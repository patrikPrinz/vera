import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

///** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  {
    ignores: [
      'packages/shared-types/*',
      '**/node_modules/**',
      '**/dist/**',
      'pnpm-lock.yaml',
      '.env*',
      '**/__fixtures__/**',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  //...pluginVue.configs['flat/recommended'],
  {
    files: ['packages/*/{src,tests}/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: false,
        project: ['./packages/*/tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.node, ...globals.es2024 },
    },

    rules: {
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
    },
  },
  {
    files: ['packages/*/src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser, ...globals.es2024 },
    },
    plugins: {
      vue,
    },
    rules: {},
  },
  prettier,
);
