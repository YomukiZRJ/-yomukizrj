/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-30 13:57:13
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-30 14:39:21
 */
import { eslintRules } from "../rules.js";
export const templatePackages = [];
export const eslintOverrides = [
	{
		files: ["*.js"],
		extends: ["eslint:recommended", "plugin:prettier/recommended"],
		rules: eslintRules,
	},
];
export const eslintScripts = {
	lint: "eslint ./",
	"lint:fix": "eslint --fix ./",
};
