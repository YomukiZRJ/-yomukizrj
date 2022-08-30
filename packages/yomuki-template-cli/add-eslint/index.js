/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-22 17:07:37
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-30 14:33:13
 */

export const commonPackages = ["eslint", "prettier", "eslint-plugin-prettier", "eslint-config-prettier"];
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
	// 使用制表符而不是空格缩进行
	useTabs: true,
	// 使用分号
	semi: true,
	// 是否单引号
	singleQuote: false,
	// 每行多少单词换行
	printWidth: 130,
	// 在对象，数组括号与文字之间加空格 "{ foo: bar }"
	bracketSpacing: true,
};

export const eslintIgnore = ["node_modules", "dist"];
