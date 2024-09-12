import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";


export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: globals.node },
    rules: {
      "max-len": ["error", { "code": 80, "ignoreStrings": true }]
    }
  },
];