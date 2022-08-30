/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-23 14:19:48
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-23 14:24:06
 */
import { vueRules, eslintRules } from "../rules.js";
export const templatePackages = [
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "vue-eslint-parser",
  "eslint-plugin-vue",
];

export const eslintOverrides = [
  {
    files: ["*.js"],
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    rules: eslintRules,
  },
  {
    files: ["*.ts", "*.tsx"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
    ],
  },
  {
    files: ["*.vue"],
    parser: "vue-eslint-parser",
    parserOptions: {
      parser: "@typescript-eslint/parser",
      ecmaVersion: "latest",
      sourceType: "module",
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:vue/recommended",
      "plugin:prettier/recommended",
    ],
    rules: {
      ...eslintRules,
      ...vueRules,
    },
  },
];
