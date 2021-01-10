module.exports = {
   preset: "ts-jest",
   coveragePathIgnorePatterns: ["/node_modules/"],
   testMatch: ["**/__tests__/*.+(ts|tsx|js)"],
   moduleNameMapper: {
      "~routes/(.*)": "<rootDir>/src/routes/$1",
      "~config/(.*)": "<rootDir>/src/config/$1",
      "~middleware/(.*)": "<rootDir>/src/middleware/$1",
      "~declarations/(.*)": "<rootDir>/src/declarations/$1"
   },
   testEnvironment: "node",
};