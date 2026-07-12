import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwindcss from "eslint-plugin-tailwindcss";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    extends: [tailwindcss.configs.recommended],
    settings: {
      tailwindcss: {
        // v4 is CSS-first — the theme lives here, not in a tailwind.config.ts.
        cssConfigPath: "./src/app/globals.css",
      },
    },
    rules: {
      // The 8pt grid, enforced. Theme config alone cannot stop either of these:
      //   p-[13px] — arbitrary values bypass the theme entirely
      //   p-7      — off-grid classes emit no CSS, silently. This catches them.
      "tailwindcss/no-arbitrary-value": "error",
      // `grain` is a real utility declared in globals.css @layer utilities; the plugin
      // reads the @theme, not the layers, so it cannot see it. Whitelist, do not disable.
      "tailwindcss/no-custom-classname": ["error", { whitelist: ["grain"] }],
      "tailwindcss/no-contradicting-classname": "error",
      "tailwindcss/enforces-shorthand": "warn",
      "tailwindcss/classnames-order": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
