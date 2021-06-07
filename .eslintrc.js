module.exports = {
  root: true,
  plugins: [
    'prettier',
    'react',
    '@typescript-eslint',
    'react-hooks',
    'jsx-a11y',
    'import',
    'jest',
    'promise',
  ],
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  overrides: [
    {
      files: '*.js',
      extends: ['eslint-config-airbnb/base', 'prettier'],
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      settings: {
        'import/extensions': ['.js', '.ts'],
        'import/resolver': {
          typescript: {
            project: ['tsconfig.json'],
          },
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
      },
      extends: [
        'plugin:react/recommended',
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        'plugin:import/recommended',
        'plugin:promise/recommended',
        'plugin:unicorn/recommended',
        'plugin:jsx-a11y/recommended',
        'prettier',
      ],
      rules: {
        'prettier/prettier': 'error',
        'class-methods-use-this': [0],
        'unicorn/no-useless-undefined': 'off',
        'unicorn/prefer-node-protocol': 'off',
        // 'import/no-cycle': 'off',
        'react/jsx-props-no-spreading': 'off',
        // 'react-hooks/rules-of-hooks': 'error',
        // 'react-hooks/exhaustive-deps': 'warn',
        // 'react/prop-types': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
          },
        ],
        'react/jsx-filename-extension': [
          1,
          {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        ],
        'unicorn/prevent-abbreviations': [
          'error',
          {
            checkFilenames: false,
          },
        ],
      },
    },
  ],
};
