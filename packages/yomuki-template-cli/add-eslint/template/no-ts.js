/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-30 13:57:20
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-30 14:38:29
 */
import { eslintRules } from "../rules.js";
export const templatePackages = ["@typescript-eslint/eslint-plugin", "@typescript-eslint/parser"];

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
		extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
	},
];
export const eslintScripts = {
	lint: "eslint --ext .js,.ts ./",
	"lint:fix": "eslint --fix --ext .js,.ts ./",
};
