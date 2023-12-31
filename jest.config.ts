import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testPathIgnorePatterns: ["./.next/", "./.vercel", "./node_modules/"],
  setupFilesAfterEnv: ["./jest.config.ts"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  transform: {
    "\\.[jt]sx?$": "@swc/jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "C:/mylab/sipbuk/$1",
  },
};

export default config;
