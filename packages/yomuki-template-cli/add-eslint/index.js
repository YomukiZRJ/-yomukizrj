/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-22 17:07:37
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-23 14:44:33
 */

export const commonPackages = [
  "eslint",
  "prettier",
  "eslint-plugin-prettier",
  "eslint-config-prettier",
];
export const commonEslintConfig = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
};

export const prettierConfig = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: true,
};

export const eslintIgnore = ["node_modules", "dist"];
