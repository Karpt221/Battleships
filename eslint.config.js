import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    ignores: ["dist"],
  },

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
