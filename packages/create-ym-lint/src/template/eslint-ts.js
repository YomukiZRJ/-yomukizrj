/**
 * @see http://eslint.cn/docs/rules/  eslint
 * @see https://typescript-eslint.io/rules/ ts
 */
module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	parserOptions: {
		ecmaVersion: 9,
		sourceType: "module",
	},
	/**
	 * 全局变量 主要用于防止【禁用未声明的变量 (no-undef)】误判
	 * @see https://eslint.org/docs/latest/user-guide/configuring/language-options#specifying-globals
	 */
	globals: {},
	extends: ["eslint:recommended", "plugin:prettier/recommended"],
	rules: {
		"prettier/prettier": "error",
		"no-unused-vars": 1, // 变量定义了没使用
	},
	overrides: [
		{
			files: ["*.js"],
			rules: {},
		},
		{
			files: ["*.ts", "*.tsx"],
			parser: "@typescript-eslint/parser",
			parserOptions: {
				ecmaVersion: 9,
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
			},
			extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
		},
	],
};
