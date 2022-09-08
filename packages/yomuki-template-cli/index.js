#!/usr/bin/env node
import { Command } from "commander";
import create from "./lib/create.js";
import ls from "./lib/ls.js";
import add from "./lib/add.js";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import path from "node:path";
import semver from "semver";
const program = new Command();
// 读取package
const pakDir = path.resolve(fileURLToPath(import.meta.url), "../", "package.json");
const pkg = JSON.parse(readFileSync(pakDir, "utf-8"));
// 检查node版本
function checkNodeVersion(wanted, id) {
	if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
		console.log(
			"You are using Node " +
				process.version +
				", but this version of " +
				id +
				" requires Node " +
				wanted +
				".\nPlease upgrade your Node version."
		);
		process.exit(1);
	}
}
checkNodeVersion(pkg.engines.node);
// 设置cli版本 -V
program.version(pkg.version);
// 创建
program
	.command("create")
	.description("从模板创建项目")
	.argument("[projectName]", "项目名称", null)
	.argument("[templateName]", "模板名称", null)
	.action(create);
// 模板列表
program.command("ls").description("查询模板列表").action(ls);
// 添加扩展
program.command("add").description("在项目中添加拓展").action(add);
program.parse(process.argv);
