// eslint.config.js
const js = require('@eslint/js')
const tsParser = require('@typescript-eslint/parser')
const prettier = require('eslint-config-prettier')
const globals = require('globals')

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  // Ignoruj buildy, lockfile a env
  { ignores: ['**/node_modules/**', '**/dist/**', 'pnpm-lock.yaml', '.env*'] },

  // Výchozí ESLint pravidla
  js.configs.recommended,

  // TS: jen parser (bez pravidel) + Node globály
  {
    files: ['packages/*/src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.node, ...globals.es2024 }
    },
    rules: {}
  },

  // Vypne potenciální kolize se stylem (Prettier)
  prettier
]
