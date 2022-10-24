#!/usr/bin/env node
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import { cwd } from "node:process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "child_process";
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import {
	questions,
	basePackages,
	packagesMap,
	getEslintScripts,
	getStyleScripts,
	commandMap,
	eslintIgnore,
} from "./src/options.js";
/**
 * @description: 获取模板文件路径
 * @param {*} fileName
 * @return {string}
 */
function getTemplateFilePath(fileName) {
	return resolve(fileURLToPath(import.meta.url), "../src/template", fileName);
}
const errorText = chalk.bold.red,
	warning = chalk.hex("#FFA500"),
	success = chalk.bold.green,
	normal = chalk.bold.cyan,
	projectDirectory = cwd(),
	pakFile = resolve(projectDirectory, "package.json"),
	eslintFile = resolve(projectDirectory, ".eslintrc.js"),
	prettierFile = resolve(projectDirectory, ".prettierrc.js"),
	stylelintFile = resolve(projectDirectory, ".stylelintrc.js"),
	stylelintIgnoreFile = resolve(projectDirectory, ".stylelintignore"),
	eslintIgnoreFile = resolve(projectDirectory, ".eslintignore"),
	prettierOptionFile = getTemplateFilePath("prettierrc.js");
async function addLint() {
	console.log(
		`
        ${normal("🐣 欢迎使用lint添加工具！")}
        ${warning("⚠️  本工具将会添加eslint和prettier,stylelint为可选添加项")}
        ${warning("⚠️  本工具添加的配置是脱离构建的，如有此需求请手动下载相关依赖")}
        ${warning("⚠️  依赖版本请查看README")}
        ${normal("💐 让我们开始吧！")}
        `
	);
	if (!existsSync(pakFile)) {
		console.log(errorText("未在当前目录中找到package.json，请在项目根目录下运行哦~"));
		return;
	}
	const { manager, frame, eslintRule, needStylelint, stylelintPlugins } = await inquirer.prompt(questions);
	let { template: templateFileName, key: templateKey } = frame;
	if (eslintRule) templateFileName += `-${eslintRule}`;
	/**
	 * stylelint模板
	 */
	let stylelintFileName = "stylelint";
	if (needStylelint) {
		templateKey.push("stylelint");
		if (templateKey.includes("vue")) {
			templateKey.push("stylelintVue");
			stylelintFileName += "-vue";
		}
		if (stylelintPlugins) {
			templateKey.push(stylelintPlugins);
			stylelintFileName += `-${stylelintPlugins}`;
		}
	}
	/**
	 * 获取模板文件名称
	 */
	const eslintOptionFile = getTemplateFilePath(`eslint-${templateFileName}.js`), // eslint配置模板
		stylelintOptionFile = getTemplateFilePath(`${stylelintFileName}.js`), // stylelint配置模板
		installPackages = [...basePackages], // 需要安装的依赖
		eslintExt = [], // eslint 文件拓展名
		stylelintExt = []; // stylelint 文件拓展名
	templateKey.forEach((item) => {
		const { packages = [], fileExt = [], styleExt = [] } = packagesMap[item];
		installPackages.push(...packages);
		eslintExt.push(...fileExt);
		stylelintExt.push(...styleExt);
	});
	/**
	 * Scripts语句
	 */
	let addScripts = getEslintScripts(eslintExt);
	if (needStylelint) {
		addScripts = {
			...addScripts,
			...getStyleScripts(stylelintExt),
		};
	}
	/**
	 * command语句
	 */
	const commandStr = `${commandMap[manager]} ${installPackages.join(" ")}`;
	console.log(normal("\n" + commandStr));
	const spinner = createSpinner("Installing packages...").start();
	exec(`${commandStr}`, { cwd: projectDirectory }, (error) => {
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
			...addScripts,
			...{
				prettier: "prettier --write --ignore-path .eslintignore ./",
				"prettier:check": "prettier --check --ignore-path .eslintignore ./",
			},
		};
		writeFileSync(pakFile, JSON.stringify(newPakContent, null, 2) + "\n"); // 写入新的package.json
		writeFileSync(eslintIgnoreFile, eslintIgnore.join("\n")); // 写入eslintIgnore
		copyFileSync(eslintOptionFile, eslintFile);
		copyFileSync(prettierOptionFile, prettierFile);
		if (needStylelint) {
			copyFileSync(stylelintOptionFile, stylelintFile);
			writeFileSync(stylelintIgnoreFile, eslintIgnore.join("\n"));
		}
		spinner.success({ text: success("All done! 🎉"), mark: "✔" });
		console.log(`
			${normal("🔥 添加完毕~")}
			${normal("📣 如果需在打包中添加验证，请手动安装插件")}
			${normal("📣 vite：vite-plugin-eslint")}
			${normal("📣 webpack：eslint-webpack-plugin")}
		`);
	});
}
addLint().catch((err) => {
	console.log(errorText(err));
});
