/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["node_modules/", "out/", "dist/"],
  testPathIgnorePatterns: ["node_modules/", "out/", "dist/"],
};
