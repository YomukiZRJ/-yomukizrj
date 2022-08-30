/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-23 13:20:59
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-23 14:19:14
 */
import { vueRules, eslintRules } from "../rules.js";
export const templatePackages = ["vue-eslint-parser", "eslint-plugin-vue"];
export const eslintOverrides = [
  {
    files: ["*.js"],
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    rules: eslintRules,
  },
  {
    files: ["*.vue"],
    parser: "vue-eslint-parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    extends: [
      "eslint:recommended",
      "plugin:vue/recommended",
      "plugin:prettier/recommended",
    ],
    rules: {
      ...eslintRules,
      ...vueRules,
    },
  },
];