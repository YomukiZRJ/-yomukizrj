#!/usr/bin/env node
import { Command } from "commander";
import create from "./lib/create.js";
import ls from "./lib/ls.js";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
const program = new Command();
const pakDir = path.resolve(
  fileURLToPath(import.meta.url),
  "../",
  "package.json"
);
// console.log(pakDir);
// 读取package
const pkg = JSON.parse(fs.readFileSync(pakDir, "utf-8"));

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
program.parse(process.argv);
