import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import nx from "@nx/eslint-plugin";
import tseslint from "typescript-eslint";
const publicImports = {
  group: ["@workspace/*/*"],
  message: "Use the public package entry point.",
};
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      ".nx/**",
      "public/**",
      "**/data/**",
      ".husky/_/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    files: ["**/*.{ts,tsx,js,mjs}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["apps/*/src/**/*.{ts,tsx}", "packages/ui/src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
  {
    files: ["apps/**/*.{ts,tsx}", "packages/**/*.{ts,tsx}", "tools/**/*.js"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { "@nx": nx },
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          allow: [],
          banTransitiveDependencies: true,
          depConstraints: [
            {
              sourceTag: "type:app",
              onlyDependOnLibsWithTags: ["scope:shared"],
            },
            {
              sourceTag: "scope:shared",
              onlyDependOnLibsWithTags: ["scope:shared"],
            },
            { sourceTag: "type:ui", onlyDependOnLibsWithTags: ["type:ui"] },
            {
              sourceTag: "type:transport",
              onlyDependOnLibsWithTags: [],
            },
            {
              sourceTag: "type:mock",
              onlyDependOnLibsWithTags: [],
            },
          ],
        },
      ],
      "no-restricted-imports": ["error", { patterns: [publicImports] }],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ImportExpression[source.value=/^@workspace\\/.*\\//]",
          message: "Use a public package entry point.",
        },
      ],
    },
  },
  prettier,
];
