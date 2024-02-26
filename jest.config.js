export default {
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup/jest-setup.ts"],
};
