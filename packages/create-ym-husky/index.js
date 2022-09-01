#!/usr/bin/env node
import { red, cyan } from "kolorist";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";
import prompts from "prompts";
import { fileURLToPath } from "node:url";
import { getLintStagedOption } from "./src/index.js";
import { createSpinner } from "nanospinner";
import { exec } from "node:child_process";
import { green } from "kolorist";

const projectDirectory = cwd(), // 项目目录
	pakFile = resolve(projectDirectory, "package.json"), // 项目package.json
	huskyFile = resolve(projectDirectory, ".husky"),
	lintStagedFile = resolve(projectDirectory, "lint-staged.config.js"),
	commitlintFile = resolve(projectDirectory, "commitlint.config.js"),
	commitlintFileTemplateDir = resolve(fileURLToPath(import.meta.url), "../src/template", "commitlint.config.js"),
	needDependencies = ["eslint", "prettier", "stylelint"], // pak包中需包含的依赖
	huskyCommandMap = {
		npm: "npx husky-init && npm install && npm install --save-dev ",
		yarn1: "npx husky-init && yarn && yarn add --dev ",
		yarn2: "yarn dlx husky-init --yarn2 && yarn && yarn add --dev ",
		pnpm: "pnpm dlx husky-init && pnpm install && pnpm install --save-dev ",
		pnpmw: "pnpm dlx husky-init && pnpm install -w && pnpm install --save-dev -w ",
	},
	preCommitPackages = "lint-staged",
	commitMsgPackages = "@commitlint/cli @commitlint/config-conventional commitizen cz-git";
const createCommitHook = `npx husky set .husky/pre-commit "npm run lint:lint-staged"`;
const createMsgHook = `npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'`;
const huskyQuestions = [
	{
		type: "select",
		name: "manager",
		message: "请选择包管理器：",
		choices: [
			{
				title: "npm",
				value: "npm",
			},
			{
				title: "yarn1",
				value: "yarn1",
			},
			{
				title: "yarn2+",
				value: "yarn2",
			},
			{
				title: "pnpm",
				value: "pnpm",
			},
			{
				title: "pnpm 根工作区",
				value: "pnpmw",
			},
		],
	},
	{
		type: "confirm",
		name: "commitlint",
		message: "是否需要commit信息验证？",
	},
];
const noLintQuestions = [
	{
		type: "confirm",
		name: "isContinue",
		message: "未在package.json中找到eslint/prettier/stylelint，是否继续？",
	},
	{
		// 处理上一步的确认值。如果用户没同意，抛出异常。同意了就继续
		type: (_, { isContinue } = {}) => {
			if (isContinue === false) {
				throw new Error(red("✖ 取消操作"));
			}
			return null;
		},
		name: "isContinueChecker",
	},
	{
		type: "multiselect",
		name: "selectLint",
		message: "请选择已安装的依赖：",
		choices: [
			{
				title: "eslint",
				value: "eslint",
			},
			{
				title: "prettier",
				value: "prettier",
			},
			{
				title: "stylelint",
				value: "stylelint",
			},
		],
	},
];
const overwriteQuestions = [
	{
		type: "confirm",
		name: "overwrite",
		message: "该项目已安装husky，是否重新安装？",
	},
	{
		// 处理上一步的确认值。如果用户没同意，抛出异常。同意了就继续
		type: (_, { overwrite } = {}) => {
			if (overwrite === false) {
				throw new Error(red("✖ 取消操作"));
			}
			return null;
		},
		name: "overwriteChecker",
	},
];
async function init() {
	console.log(cyan("\n🐣欢迎使用git hook添加工具，在使用本工具前请先确保已关联git仓库！\n"));
	console.log(`当前package.json路径：${pakFile}`);
	if (!existsSync(pakFile)) {
		console.log(red("未在当前目录中找到package.json，请在项目根目录下运行哦~"));
		return;
	}
	const pakContent = JSON.parse(readFileSync(pakFile));
	const devs = {
		...(pakContent?.devDependencies || {}),
		...(pakContent?.dependencies || {}),
	};
	const pakHasLint = needDependencies.filter((item) => {
		return item in devs;
	});
	const questions = pakHasLint.length === 0 ? [...noLintQuestions, ...huskyQuestions] : huskyQuestions;
	if (existsSync(huskyFile)) {
		questions.unshift(...overwriteQuestions);
	}
	let result = {};
	try {
		result = await prompts(questions, {
			onCancel: () => {
				throw new Error(red("❌Bye~"));
			},
		});
	} catch (cancelled) {
		console.log(cancelled.message);
		return;
	}
	const { selectLint, manager, commitlint } = result;
	const packages = commitlint ? `${preCommitPackages} ${commitMsgPackages}` : preCommitPackages;
	const createHookCommand = commitlint ? `${createCommitHook} && ${createMsgHook}` : createCommitHook;
	const command = `${huskyCommandMap[manager]}${packages}`;
	const isEsm = pakContent.type && pakContent.type === "module";
	const lintStagedContent = isEsm
		? `export default ${JSON.stringify(getLintStagedOption(selectLint || pakHasLint))}`
		: `module.exports =${JSON.stringify(getLintStagedOption(selectLint || pakHasLint))}`;
	const spinner = createSpinner("Installing packages...").start();
	exec(`${command}`, { cwd: projectDirectory }, (error) => {
		if (error) {
			spinner.error({
				text: red("Failed to install packages!"),
				mark: "✖",
			});
			console.error(error);
			return;
		}
		let newPakContent = JSON.parse(readFileSync(pakFile));
		newPakContent.scripts = {
			...newPakContent.scripts,
			"lint:lint-staged": "lint-staged",
			commit: "git add . && git-cz",
		};
		newPakContent.config = {
			...(newPakContent?.config || {}),
			commitizen: {
				path: "node_modules/cz-git",
			},
		};
		writeFileSync(pakFile, JSON.stringify(newPakContent));
		writeFileSync(lintStagedFile, lintStagedContent);
		copyFileSync(commitlintFileTemplateDir, commitlintFile);
		spinner.success({ text: green("安装成功~准备添加钩子! 🎉"), mark: "✔" });
		const hookSpinner = createSpinner("添加husky钩子中...").start();
		exec(`${createHookCommand}`, { cwd: projectDirectory }, (error) => {
			if (error) {
				hookSpinner.error({
					text: red(`添加钩子失败，请手动执行${createHookCommand}`),
					mark: "✖",
				});
				console.error(error);
				return;
			}
			hookSpinner.success({ text: green("一切就绪! 🎉"), mark: "✔" });
		});
	});
}
init().catch((e) => {
	console.error(e);
});
