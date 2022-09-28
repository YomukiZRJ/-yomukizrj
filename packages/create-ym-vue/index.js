#!/usr/bin/env node
import { basename, resolve, join } from "node:path";
import { cwd } from "node:process";
import { existsSync, readFileSync, mkdirSync, cpSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { red } from "kolorist";
import prompts from "prompts";
import { vue3Dependencies } from "./src/options.js";
import { formatTargetDir, isEmpty, isValidPackageName, toValidPackageName } from "./src/utils.js";
import { green } from "kolorist";

const projectDirectory = cwd(), // 项目目录
	defaultProjectName = "my-project";
async function init() {
	let targetDir = formatTargetDir(defaultProjectName);
	// 获取项目名称
	const getProjectName = () => (targetDir === "." ? basename(resolve()) : targetDir);
	const questions = [
		{
			type: "text",
			name: "projectName",
			message: "Project name:",
			initial: defaultProjectName,
			onState: (state) => {
				targetDir = formatTargetDir(state.value) || defaultProjectName;
			},
			onRender(kleur) {
				const { bold, blue, underline } = kleur;
				this.msg = blue().underline().bold(this.msg);
			},
		},
		{
			type: !existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
			name: "overwrite",
			message: () => (targetDir === "." ? "当前目录" : `目标目录"${targetDir}"`) + `不为空。删除现有文件并继续?`,
			onRender(kleur) {
				const { bold, red } = kleur;
				this.msg = red().bold(this.msg);
			},
		},
		{
			// 处理上一步的确认值。如果用户没同意，抛出异常。同意了就继续
			type: (_, { overwrite } = {}) => {
				if (overwrite === false) {
					throw new Error(red("✖ 操作取消"));
				}
				return null;
			},
			name: "overwriteChecker",
		},
		{
			type: () => (isValidPackageName(getProjectName()) ? null : "text"),
			name: "packageName",
			message: "Package name:",
			initial: () => toValidPackageName(getProjectName()),
			// 包名验证
			validate: (dir) => isValidPackageName(dir) || "Invalid package.json name",
			onRender(kleur) {
				const { bold, blue, underline } = kleur;
				this.msg = blue().underline().bold(this.msg);
			},
		},
		{
			type: "multiselect",
			name: "dependencies",
			message: "请选择项目依赖",
			choices: vue3Dependencies,
		},
	];
	let result = {};
	try {
		result = await prompts(questions, {
			onCancel: () => {
				throw new Error(red("❌已取消操作"));
			},
		});
		// console.log(result);
		const { overwrite, dependencies, packageName } = result;
		const projectRoot = join(projectDirectory, targetDir);
		if (overwrite) {
			emptyDir(projectRoot);
		} else if (!existsSync(projectRoot)) {
			mkdirSync(projectRoot, { recursive: true });
		}
		const templateFileName = "vue3-js-webpack";
		const templateDir = resolve(fileURLToPath(import.meta.url), `../src/template/${templateFileName}/base`);
		const dependenciesDir = resolve(fileURLToPath(import.meta.url), `../src/template/${templateFileName}/dependencies`);
		const pkg = JSON.parse(readFileSync(join(templateDir, `package.json`), "utf-8"));
		pkg.name = packageName || getProjectName();
		//  fs.cpSync "node": ">=17.6.0"
		cpSync(templateDir, projectRoot, {
			recursive: true,
		});
		if (dependencies) {
			dependencies.forEach(({ dependencies, configurationFile }) => {
				pkg.dependencies = Object.assign(pkg.dependencies, dependencies);
				if (configurationFile) {
					cpSync(join(dependenciesDir, configurationFile.from), join(projectRoot, configurationFile.to), {
						recursive: true,
					});
				}
			});
		}
		writeFileSync(join(projectRoot, "package.json"), JSON.stringify(pkg, null, 2));
		console.log(green("success！"));
	} catch (cancelled) {
		console.log(cancelled.message);
		return;
	}
}
init().catch((e) => {
	console.error(e);
});
