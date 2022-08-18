#!/usr/bin/env node
import { Command } from "commander";
import create from "./lib/create.js";
import fs from "node:fs";
const program = new Command();
// 读取package
const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));

// 设置cli版本 -V
program.version(pkg.version);

program
  .command("create")
  .description("从模板创建项目")
  .argument("[projectName]", "项目名称", null)
  .argument("[templateName]", "模板名称", null)
  .action(create);
program.parse(process.argv);
