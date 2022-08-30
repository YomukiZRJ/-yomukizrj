/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-23 13:36:05
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-30 13:56:39
 */
import { errorText } from "../utils/print.js";
export const questions = [
	{
		type: "select",
		name: "frame",
		message: "请选择框架：",
		choices: [
			{
				title: "vue3",
				value: "vue3",
			},
			{
				title: "vue2",
				value: "vue2",
			},
			{
				title: "无框架",
				value: "no",
			},
		],
	},
	{
		type: "select",
		name: "jstype",
		message: "请选择语言：",
		choices: [
			{
				title: "js",
				value: "js",
			},
			{
				title: "ts",
				value: "ts",
			},
		],
	},
];
export const qPkgManager = {
	type: "select",
	name: "manager",
	message: "请选择包管理器：",
	choices: [
		{
			title: "npm",
			value: "npm",
		},
		{
			title: "pnpm",
			value: "pnpm",
		},
		{
			title: "yarn",
			value: "yarn",
		},
	],
};
export const qOverwrite = [
	{
		type: "confirm",
		name: "overwrite",
		message: "当前package.json中存在eslint，是否重新安装？",
		onRender(kleur) {
			const { bold, red } = kleur;
			this.msg = red().bold(this.msg);
		},
	},
	{
		// 处理上一步的确认值。如果用户没同意，抛出异常。同意了就继续
		type: (_, { overwrite } = {}) => {
			if (overwrite === false) {
				throw new Error(errorText("✖ 取消操作"));
			}
			return null;
		},
		name: "overwriteChecker",
	},
];
