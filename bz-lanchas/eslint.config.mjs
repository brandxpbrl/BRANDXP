import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["app/page.tsx"],
    // Preserve the supplied logo asset with its uncropped contain layout.
    rules: { "@next/next/no-img-element": "off" },
  },
  globalIgnores([".next/**", ".vercel/**", ".npm-cache/**", "out/**", "build/**", "next-env.d.ts"]),
]);
