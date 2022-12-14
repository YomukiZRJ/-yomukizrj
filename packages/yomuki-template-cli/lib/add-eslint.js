#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import prompts from "prompts";
import { cwd } from "node:process";
import { createSpinner } from "nanospinner";
import { exec } from "child_process";
import { printNormal, printSuccess, printWarn, errorText, successText } from "../utils/print.js";
import { questions, qOverwrite } from "../template/add-eslint/questions.js";
import { commonPackages, commonEslintConfig, prettierConfig, eslintIgnore } from "../template/add-eslint/index.js";

export default () => {
	/**
	 * 路径
	 */
	const projectDirectory = cwd(),
		eslintFile = resolve(projectDirectory, ".eslintrc.json"),
		prettierFile = resolve(projectDirectory, ".prettierrc.json"),
		eslintIgnoreFile = resolve(projectDirectory, ".eslintignore"),
		pakFile = resolve(projectDirectory, "package.json");
	async function run() {
		printNormal("\n🐣欢迎使用eslint添加工具！\n");
		const pakContent = JSON.parse(readFileSync(pakFile));
		// 是否已安装eslint
		const hasEslint = Object.hasOwn(pakContent, "devDependencies") && Object.hasOwn(pakContent.devDependencies, "eslint");
		const promptsQuestions = hasEslint ? [...qOverwrite, ...questions] : questions;
		let result = {};
		// 进行用户询问 拼接模板名称
		try {
			result = await prompts(promptsQuestions, {
				onCancel: () => {
					throw new Error(errorText("❌Bye~"));
				},
			});
		} catch (cancelled) {
			console.log(cancelled.message);
			return;
		}
		const { frame, jstype, manager } = result;
		const templateName = `${frame}-${jstype}`;
		const { templatePackages, eslintOverrides, eslintScripts } = await import(`../template/add-eslint/config/${templateName}.js`);
		const packageList = [...commonPackages, ...templatePackages];
		const eslint = { ...commonEslintConfig, overrides: eslintOverrides };
		const commandMap = {
			npm: `npm install --save-dev ${packageList.join(" ")}`,
			yarn: `yarn add --dev ${packageList.join(" ")}`,
			pnpm: `pnpm install --save-dev ${packageList.join(" ")}`,
			pnpmw: `pnpm install --save-dev --workspace-root ${packageList.join(" ")}`,
		};
		const useManager = manager;
		const installCommand = commandMap[useManager];
		if (!installCommand) {
			printWarn("目前只支持npm / yarn / pnpm 哦~");
			return;
		}
		// console.log(installCommand);

		const spinner = createSpinner("Installing packages...").start();
		exec(`${installCommand}`, { cwd: projectDirectory }, (error) => {
			if (error) {
				spinner.error({
					text: errorText("Failed to install packages!"),
					mark: "✖",
				});
				console.error(error);
				return;
			}
			let newPakContent = JSON.parse(readFileSync(pakFile));

			newPakContent.scripts = {
				...newPakContent.scripts,
				...eslintScripts,
				...{
					prettier: "prettier --check --ignore-path .eslintignore ./",
					"prettier:fix": "prettier --write --ignore-path .eslintignore ./",
				},
			};
			writeFileSync(pakFile, JSON.stringify(newPakContent));
			writeFileSync(eslintFile, JSON.stringify(eslint, null, 2));
			writeFileSync(prettierFile, JSON.stringify(prettierConfig, null, 2));
			writeFileSync(eslintIgnoreFile, eslintIgnore.join("\n"));
			spinner.success({ text: successText("All done! 🎉"), mark: "✔" });
			printSuccess("\n🔥 添加完毕~");
			printSuccess("\n📣 如果需在打包中添加验证，请手动安装插件");
			printSuccess("\n📣 vite：vite-plugin-eslint");
			printSuccess("\n📣 webpack：eslint-webpack-plugin");
		});
	}
	run().catch((e) => {
		console.error(e);
	});
};
