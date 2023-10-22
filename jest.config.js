/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ["test-old", "dist"],
  testPathIgnorePatterns: ["node_modules", "dist", "test-old"]
};