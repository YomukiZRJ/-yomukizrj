#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import prompts from "prompts";
import { red, green, bold } from "kolorist";
import gradient from "gradient-string";
import { BUNDLERS, TEMPLATES } from "../template/index.js";
import {
  formatTargetDir,
  isEmpty,
  isValidPackageName,
  toValidPackageName,
  emptyDir,
  copy,
  pkgFromUserAgent,
} from "../utils/index.js";

export default (projectName, templateName) => {
  console.log(bold(gradient.morning("\n🐣欢迎使用Yomuki的模板创建！\n")));
  const cwd = process.cwd(); // 当前node执行目录
  const renameFiles = {
    _gitignore: ".gitignore",
  };
  let targetDir = formatTargetDir(projectName);
  const defaultProjectName = "my-project";
  // 获取项目名称
  const getProjectName = () =>
    targetDir === "." ? path.basename(path.resolve()) : targetDir;
  const questions = [
    {
      type: targetDir ? null : "text",
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
      type: !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
      name: "overwrite",
      message: () =>
        (targetDir === "." ? "当前目录" : `目标目录"${targetDir}"`) +
        `不为空。删除现有文件并继续?`,
      onRender(kleur) {
        const { bold, red } = kleur;
        this.msg = red().bold(this.msg);
      },
    },
    {
      // 处理上一步的确认值。如果用户没同意，抛出异常。同意了就继续
      type: (_, { overwrite } = {}) => {
        if (overwrite === false) {
          throw new Error(red("✖") + " Operation cancelled");
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
      type: templateName && TEMPLATES.includes(templateName) ? null : "select",
      name: "bundler",
      message:
        typeof templateName === "string" && !TEMPLATES.includes(templateName)
          ? `"${templateName}" 不在模板列中，请选择打包器：`
          : "请选择打包器:",
      initial: 0,
      choices: BUNDLERS.map((bundler) => {
        const color = bundler.color;
        return {
          title: color(bundler.title),
          value: bundler,
          description: bundler.description,
          disabled: bundler.disabled ? true : false,
        };
      }),
      onRender(kleur) {
        const { bold, blue, underline } = kleur;
        this.msg = blue().underline().bold(this.msg);
      },
    },
    {
      type: (bundler) => (bundler && bundler.children ? "select" : null),
      name: "template",
      message: "选择模板:",
      choices: (bundler) =>
        bundler.children.map((template) => {
          const color = template.color;
          return {
            title: color(template.title),
            value: template.template,
            description: template.description,
          };
        }),
      onRender(kleur) {
        const { bold, blue, underline } = kleur;
        this.msg = blue().underline().bold(this.msg);
      },
    },
  ];

  async function init() {
    let result = {};
    try {
      result = await prompts(questions, {
        onCancel: () => {
          throw new Error(gradient.passion("❌已取消操作"));
        },
      });
    } catch (cancelled) {
      console.log(cancelled.message);
      return;
    }
    const { packageName, overwrite, template } = result;
    const projectRoot = path.join(cwd, targetDir);
    if (overwrite) {
      emptyDir(projectRoot);
    } else if (!fs.existsSync(projectRoot)) {
      fs.mkdirSync(projectRoot, { recursive: true });
    }
    console.log(green(`\nScaffolding project in ${projectRoot}...`));
    const templateFileName = template || templateName;
    const templateDir = path.resolve(
      fileURLToPath(import.meta.url),
      "../../template",
      templateFileName
    );
    const files = fs.readdirSync(templateDir);
    const write = (file, content) => {
      const targetPath = renameFiles[file]
        ? path.join(projectRoot, renameFiles[file])
        : path.join(projectRoot, file);
      if (content) {
        fs.writeFileSync(targetPath, content);
      } else {
        copy(path.join(templateDir, file), targetPath);
      }
    };
    for (const file of files.filter((f) => f !== "package.json")) {
      write(file);
    }
    const pkg = JSON.parse(
      fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
    );
    pkg.name = packageName || getProjectName();
    write("package.json", JSON.stringify(pkg, null, 2));
    const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
    const pkgManager = pkgInfo ? pkgInfo.name : "npm";
    console.log(gradient.cristal(`\nDone. Now run:\n`));
    if (projectRoot !== cwd) {
      console.log(`  cd ${path.relative(cwd, projectRoot)}`);
    }
    switch (pkgManager) {
      case "yarn":
        console.log("  yarn");
        console.log("  yarn dev");
        break;
      default:
        console.log(`  ${pkgManager} install`);
        console.log(`  ${pkgManager} run dev`);
        break;
    }
    console.log();
  }
  init().catch((e) => {
    console.error(e);
  });
};
