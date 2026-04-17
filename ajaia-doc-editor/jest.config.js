module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.tsx?$': ['ts-jest', {
        tsconfig: {
          jsx: 'react-jsx',
        },
      }],
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
  }