import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import securityPlugin from "eslint-plugin-security";
import noSecretsPlugin from "eslint-plugin-no-secrets";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      security: securityPlugin,
      "no-secrets": noSecretsPlugin,
    },
    rules: {
      ...securityPlugin.configs.recommended.rules,
      "no-secrets/no-secrets": "error",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright.config.ts",
    "vitest.config.ts",
  ]),
]);

export default eslintConfig;
