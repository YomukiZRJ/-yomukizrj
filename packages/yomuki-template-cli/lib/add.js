#!/usr/bin/env node
import { existsSync } from "node:fs";
import { cwd } from "node:process";
import { resolve } from "node:path";
import prompts from "prompts";
import addEslint from "./add-eslint.js";
import { printError, errorText } from "../utils/print.js";

const projectDirectory = cwd(),
	pakFile = resolve(projectDirectory, "package.json");
const addOptions = [
	{
		title: "eslint",
		value: addEslint,
	},
];
const questions = [
	{
		type: "select",
		name: "expand",
		message: "请选择要安装的拓展：",
		choices: addOptions,
	},
];
export default async () => {
	// 是否为项目目录检查
	const checkHasPak = existsSync(pakFile);
	if (!checkHasPak) {
		printError("未在当前目录中找到package.json，请在项目根目录下运行哦~");
		return;
	}
	let result = {};
	// 进行用户询问 拼接模板名称
	try {
		result = await prompts(questions, {
			onCancel: () => {
				throw new Error(errorText("❌Bye~"));
			},
		});
	} catch (cancelled) {
		console.log(cancelled.message);
		return;
	}
	const { expand } = result;
	expand();
};
