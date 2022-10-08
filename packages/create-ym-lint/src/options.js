const frameMap = {
	js: [
		{
			name: "vue2",
			value: { template: "vue2-js", key: ["vue", "js"] },
		},
		{
			name: "vue3",
			value: { template: "vue3-js", key: ["vue", "js"] },
		},
		{
			name: "无",
			value: { template: "js", key: ["js"] },
		},
	],
	ts: [
		{
			name: "vue3",
			value: { template: "vue3-ts", key: ["vue", "ts"] },
		},
		{
			name: "无",
			value: { template: "ts", key: ["ts"] },
		},
	],
};
/**
 * 交互询问语句
 */
export const questions = [
	{
		type: "list",
		name: "manager",
		message: "请选择包管理器：",
		choices: [
			{
				name: "npm",
				value: "npm",
			},
			{
				name: "yarn",
				value: "yarn",
			},
			{
				name: "pnpm",
				value: "pnpm",
			},
			{
				name: "pnpm 根工作区",
				value: "pnpmw",
			},
		],
	},
	{
		type: "list",
		name: "lag",
		message: "项目使用的是js or ts：",
		choices: [
			{
				name: "js",
				value: "js",
			},
			{
				name: "ts",
				value: "ts",
			},
		],
	},
	{
		type: "list",
		name: "frame",
		message: "选择项目所使用的框架：",
		choices: ({ lag }) => {
			return frameMap[lag];
		},
	},
	{
		type: "list",
		name: "eslintRule",
		message: "请选择eslint规范：",
		choices: [
			{
				name: "eslint",
				value: null,
			},
			{
				name: "基于standard",
				value: "standard",
			},
		],
	},
	{
		type: "confirm",
		name: "needStylelint",
		message: "是否需要stylelint？",
	},
	{
		when: ({ needStylelint }) => {
			return needStylelint;
		},
		type: "list",
		name: "stylelintPlugins",
		message: "stylelint插件：",
		choices: [
			{
				name: "无",
				value: null,
			},
			{
				name: "sass",
				value: "scss",
			},
		],
	},
];
export const commandMap = {
	npm: `npm install --save-dev`,
	yarn: `yarn add --dev`,
	pnpm: `pnpm install --save-dev`,
	pnpmw: `pnpm install --save-dev --workspace-roo`,
};
export function getEslintScripts(fileExtArr = []) {
	const fileExtStr = fileExtArr.join("");
	return {
		lint: `eslint --fix --ext ${fileExtStr} ./`,
		"lint:check": `"eslint --ext ${fileExtStr} ./`,
	};
}
export function getStyleScripts(fileExtArr = []) {
	const fileExtStr = fileExtArr.join("");
	return {
		stylelint: `stylelint --fix **/*.{${fileExtStr}}`,
		"stylelint:check": `stylelint **/*.{${fileExtStr}}`,
	};
}
/**
 * 基础包
 */
export const basePackages = ["eslint@8", "prettier@8", "eslint-plugin-prettier@4", "eslint-config-prettier@8"];
export const packagesMap = {
	js: {
		packages: [],
		fileExt: [".js", ".jsx"],
	},
	ts: {
		packages: ["@typescript-eslint/eslint-plugin@5", "@typescript-eslint/parser@5"],
		fileExt: [".ts", ".tsx"],
	},
	vue: {
		packages: ["vue-eslint-parser@9", "eslint-plugin-vue@9"],
		fileExt: [".vue"],
	},
	standard: {
		packages: ["eslint-config-standard@17", "eslint-plugin-import@2", "eslint-plugin-n@15", "eslint-plugin-promise@6"],
	},
	stylelint: {
		packages: ["stylelint@14", "stylelint-config-standard@28", "stylelint-config-prettier@9"],
		styleExt: ["css"],
	},
	stylelintVue: {
		packages: ["postcss-html@1", "stylelint-config-html@1"],
		styleExt: ["vue"],
	},
	scss: {
		packages: ["stylelint-scss@4", "stylelint-config-standard-scss@5"],
		styleExt: ["scss", "sass"],
	},
};
export const eslintIgnore = ["node_modules", "dist", "public"];
