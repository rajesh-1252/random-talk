import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
const config = {
  ...nextJsConfig,
  rules: {
    ...nextJsConfig.rules,
    "react/prop-types": "off",
  },
};

export default config;
