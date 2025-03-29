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
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.test.js", "**/*.spec.js"],  
    languageOptions: {  
      globals: {  
        ...globals.jest,
      },  
    },  
    env: {  
      jest: true, 
    },  
  },  
];
