import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },

  // Reglas JS
  js.configs.recommended,

  // Reglas TS sin type-checking
  ...tseslint.configs.recommended,

  // Reglas TS con type-checking (convertidas a flat config)
  ...tseslint.configs.recommendedTypeChecked.map((c) => ({
    ...c,
    files: ['**/*.ts'],
  })),
  ...tseslint.configs.strictTypeChecked.map((c) => ({
    ...c,
    files: ['**/*.ts'],
  })),

  // Bloque TS principal
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      '@typescript-eslint/no-extraneous-class': 'off',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'always',
        },
      ],
    },
  },

  // Prettier
  prettierConfig,

  {
    plugins: {
      prettier: prettierPlugin,
    },
  },
];
