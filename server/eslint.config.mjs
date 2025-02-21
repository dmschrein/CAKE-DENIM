import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    languageOptions: { globals: globals.browser },
  },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    // ✅ Ignore specific directories and files
    ignores: [
      "**/node_modules/**",
      "**/dist/**", // Ignore built JS files
      "**/.next/**",
      "**/coverage/**",
      "**/temp.js",
      "config/*",
      "**/.*", // Ignore all dotfiles
      "**/prisma/**",
    ],
  },
];
