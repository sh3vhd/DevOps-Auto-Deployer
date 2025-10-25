module.exports = {
  root: true,
  env: {
    es2022: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ['dist', 'build', 'node_modules'],
  overrides: [
    {
      files: ['client/src/**/*.{js,jsx}'],
      env: {
        browser: true,
        es2022: true
      },
      extends: ['plugin:react/recommended'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      settings: {
        react: {
          version: '18.2'
        }
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off'
      }
    },
    {
      files: ['server/src/**/*.js'],
      env: {
        node: true
      }
    }
  ]
};
