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
  { ignores: ['**/node_modules/**', '**/dist/**', 'pnpm-lock.yaml', '.env*'] },
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
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.node, ...globals.es2024 },
    },
    
    rules: {}
  },
  {
    files: ['packages/*/src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: "module",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      }
    },
    plugins: {
      vue
    },
    rules: {}
  },
  prettier,
);
