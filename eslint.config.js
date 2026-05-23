const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["coverage/**", "node_modules/**"]
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      "no-console": "off"
    }
  }
];
