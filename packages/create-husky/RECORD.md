# 如何在自己的项目中一键添加 husky

前置条件：项目已关联了 git。

## 关于 husky

### [husky](https://typicode.github.io/husky/#/)有什么用？

当我们**commit message**时，可以进行测试和 lint 操作，保证仓库里的代码是优雅的。
当我们进行 commit 操作时，会触发**pre-commit**，在此阶段，可进行 test 和 lint。其后，会触发**commit-msg**，对 commit 的 message 内容进行验证。

#### pre-commit

一般的 lint 会全局扫描，但是在此阶段，我们仅需要对暂存区的代码进行 lint 即可。所以使用[lint-staged](https://www.npmjs.com/package/lint-staged)插件。

#### commit-msg

在此阶段，可用 [**@commitlint/cli**](https://commitlint.js.org/#/) **@commitlint/config-conventional** 对提交信息进行验证。但是记信息格式规范真的太太太太麻烦了，所以可用 [**commitizen**](https://www.npmjs.com/package/commitizen) [**cz-git**](https://cz-git.qbb.sh/zh/guide/) 生成提交信息。

## 一键添加 husky

从上述说明中，可以得出 husky 配置的基本流程：

1. 安装 husky；安装 lint-staged @commitlint/cli @commitlint/config-conventional commitizen cz-git
1. 写 commitlint 和 lint-staged 的配置文件
1. 修改 package.json 中的 scripts 和 config
1. 添加 pre-commit 和 commit-msg 钩子

看上去简简单单轻轻松松，那么，开干！

### 先把用到的 import 拿出来溜溜

```javascript
import { red, cyan, green } from "kolorist"; // 打印颜色文字
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";
import prompts from "prompts"; // 命令行交互提示
import { fileURLToPath } from "node:url";
import { getLintStagedOption } from "./src/index.js"; // 获取lint-staged配置 ，后头说
import { createSpinner } from "nanospinner"; // 载入动画（用于安装依赖的时候）
import { exec } from "node:child_process";
```

### package 验证

既然是为项目添加，那当然得有**package.json**文件啦！

```javascript
const projectDirectory = cwd();
const pakFile = resolve(projectDirectory, "package.json");
if (!existsSync(pakFile)) {
	console.log(red("未在当前目录中找到package.json，请在项目根目录下运行哦~"));
	return;
}
```

既然需要 lint，那当然也要 eslint/prettier/stylelint 啦~

```javascript
const pakContent = JSON.parse(readFileSync(pakFile));
const devs = {
	...(pakContent?.devDependencies || {}),
	...(pakContent?.dependencies || {}),
};
const pakHasLint = needDependencies.filter((item) => {
	return item in devs;
});
```

但是考虑到有可能 lint 安装在了全局，所以这边就不直接 return 了，而是向 questions 中插入一些询问来确定到底安装了哪些 lint。

```javascript
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
const questions = pakHasLint.length === 0 ? [...noLintQuestions, ...huskyQuestions] : huskyQuestions; // huskyQuestions的husky安装的询问语句，下面会讲
```

### husky 安装询问

因为不同的包管理器有不同的安装命令，以及有些项目会不需要**commit msg**验证。所有就会有以下询问的出现啦

```javascript
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
```

### 使用 prompts 进行交互提示

```javascript
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
```

这样子，我们就获取到了：

- **manager** 项目使用的包管理
- **commitlint** 是否需要 commit msg 验证
- selectLint 用户自己选择的已安装的 lint 依赖

### 生成命令

通过 manager 和 commitlint，可以生成要运行的命令

```javascript
const huskyCommandMap = {
	npm: "npx husky-init && npm install && npm install --save-dev ",
	yarn1: "npx husky-init && yarn && yarn add --dev ",
	yarn2: "yarn dlx husky-init --yarn2 && yarn && yarn add --dev ",
	pnpm: "pnpm dlx husky-init && pnpm install && pnpm install --save-dev ",
	pnpmw: "pnpm dlx husky-init && pnpm install -w && pnpm install --save-dev -w ",
};
const preCommitPackages = "lint-staged";
const commitMsgPackages = "@commitlint/cli @commitlint/config-conventional commitizen cz-git";

// 需要安装的包
const packages = commitlint ? `${preCommitPackages} ${commitMsgPackages}` : preCommitPackages;
// 需要安装的包的安装命令
const command = `${huskyCommandMap[manager]}${packages}`;

const createCommitHook = `npx husky set .husky/pre-commit "npm run lint:lint-staged"`;
const createMsgHook = `npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'`;

// 需要创建钩子的命令
const createHookCommand = commitlint ? `${createCommitHook} && ${createMsgHook}` : createCommitHook;
```

### lint-staged 配置

一般的 lint-staged.config.js 长这样：

```javascript
module.exports = {
	"*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
	"{!(package)*.json,*.code-snippets,.!(browserslist)*rc}": ["prettier --write--parser json"],
	"package.json": ["prettier --write"],
	"*.vue": ["eslint --fix", "prettier --write", "stylelint --fix"],
	"*.{scss,less,styl,html}": ["stylelint --fix", "prettier --write"],
	"*.md": ["prettier --write"],
};
```

所以呢，需要根据项目使用的 lint 来生成 lint-staged.config.js：

```javascript
// 简单粗暴的函数
export function getLintStagedOption(lint) {
	const jsOp = [],
		jsonOp = [],
		pakOp = [],
		vueOp = [],
		styleOp = [],
		mdOp = [];
	if (lint.includes("eslint")) {
		jsOp.push("eslint --fix");
		vueOp.push("eslint --fix");
	}
	if (lint.includes("prettier")) {
		jsOp.push("prettier --write");
		vueOp.push("prettier --write");
		mdOp.push("prettier --write");
		jsonOp.push("prettier --write--parser json");
		pakOp.push("prettier --write");
		styleOp.push("prettier --write");
	}
	if (lint.includes("stylelint")) {
		vueOp.push("stylelint --fix");
		styleOp.push("stylelint --fix");
	}
	return {
		"*.{js,jsx,ts,tsx}": jsOp,
		"{!(package)*.json,*.code-snippets,.!(browserslist)*rc}": jsonOp,
		"package.json": pakOp,
		"*.vue": vueOp,
		"*.{scss,less,styl,html}": styleOp,
		"*.md": mdOp,
	};
}
// lint-staged.config.js 内容
const lintStagedContent = `module.exports =${JSON.stringify(getLintStagedOption(selectLint || pakHasLint))}`;
// lint-staged.config.js 文件
const lintStagedFile = resolve(projectDirectory, "lint-staged.config.js");
```

### commitlint 配置

因为 commitlint.config.js 中的配置过于复杂。所以，我选择在安装完依赖后直接 copy 文件！被 copy 的文件内容：

```javascript
// @see: https://cz-git.qbenben.com/zh/guide
/** @type {import('cz-git').UserConfig} */
module.exports = {
	ignores: [(commit) => commit.includes("init")],
	extends: ["@commitlint/config-conventional"],
	// parserPreset: "conventional-changelog-conventionalcommits",
	rules: {
		// @see: https://commitlint.js.org/#/reference-rules
		"body-leading-blank": [2, "always"],
		"footer-leading-blank": [1, "always"],
		"header-max-length": [2, "always", 108],
		"subject-empty": [2, "never"],
		"type-empty": [2, "never"],
		"subject-case": [0],
		"type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"]],
	},
	prompt: {
		alias: { fd: "docs: fix typos" },
		messages: {
			type: "选择你要提交的类型 :",
			scope: "选择一个提交范围（可选）:",
			customScope: "请输入自定义的提交范围 :",
			subject: "填写简短精炼的变更描述 :\n",
			body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
			breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
			footerPrefixsSelect: "选择关联issue前缀（可选）:",
			customFooterPrefixs: "输入自定义issue前缀 :",
			footer: "列举关联issue (可选) 例如: #31, #I3244 :\n",
			confirmCommit: "是否提交或修改commit ?",
		},
		types: [
			{ value: "feat", name: "feat:     🚀新增功能 | A new feature", emoji: "🚀" },
			{ value: "fix", name: "fix:      🐛修复缺陷 | A bug fix", emoji: "🐛" },
			{ value: "docs", name: "docs:     📚文档更新 | Documentation only changes", emoji: "📚" },
			{ value: "style", name: "style:    🎨代码格式 | Changes that do not affect the meaning of the code", emoji: "🎨" },
			{
				value: "refactor",
				name: "refactor: 📦代码重构 | A code change that neither fixes a bug nor adds a feature",
				emoji: "📦",
			},
			{ value: "perf", name: "perf:     ⚡️性能提升 | A code change that improves performance", emoji: "⚡️" },
			{ value: "test", name: "test:     🚨测试相关 | Adding missing tests or correcting existing tests", emoji: "🚨" },
			{ value: "build", name: "build:    🛠构建相关 | Changes that affect the build system or external dependencies", emoji: "🛠" },
			{ value: "ci", name: "ci:       🎡持续集成 | Changes to our CI configuration files and scripts", emoji: "🎡" },
			{ value: "revert", name: "revert:   ⏪️回退代码 | Revert to a commit", emoji: "⏪️" },
			{ value: "chore", name: "chore:    🔨其他修改 | Other changes that do not modify src or test files", emoji: "🔨" },
		],
		useEmoji: true,
		emojiAlign: "center",
		themeColorCode: "",
		scopes: [],
		allowCustomScopes: true,
		allowEmptyScopes: true,
		customScopesAlign: "bottom",
		customScopesAlias: "custom | 以上都不是？我要自定义",
		emptyScopesAlias: "empty | 跳过",
		upperCaseSubject: false,
		markBreakingChangeMode: false,
		allowBreakingChanges: ["feat", "fix"],
		breaklineNumber: 100,
		breaklineChar: "|",
		skipQuestions: [],
		issuePrefixs: [
			// 如果使用 gitee 作为开发管理
			{ value: "link", name: "link:     链接 ISSUES 进行中" },
			{ value: "closed", name: "closed:   标记 ISSUES 已完成" },
		],
		customIssuePrefixsAlign: "top",
		emptyIssuePrefixsAlias: "skip | 跳过",
		customIssuePrefixsAlias: "custom | 自定义前缀",
		allowCustomIssuePrefixs: true,
		allowEmptyIssuePrefixs: true,
		confirmColorize: true,
		maxHeaderLength: Infinity,
		maxSubjectLength: Infinity,
		minSubjectLength: 0,
		scopeOverrides: undefined,
		defaultBody: "",
		defaultIssues: "",
		defaultScope: "",
		defaultSubject: "",
	},
};
```

被复制的路径，和目标路径

```javascript
const commitlintFile = resolve(projectDirectory, "commitlint.config.js");
const commitlintFileTemplateDir = resolve(fileURLToPath(import.meta.url), "../src/template", "commitlint.config.js");
```

### 准备就绪，开始安装！

1. 执行刚刚生成的安装命令
1.

```javascript
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

	/*  更改package.json内容 开始  */
	let newPakContent = JSON.parse(readFileSync(pakFile)); // 获取最新的包内容
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
	writeFileSync(pakFile, JSON.stringify(newPakContent)); // 写入
	/*  更改package.json内容 结束  */

	writeFileSync(lintStagedFile, lintStagedContent); // 写入lint-staged配置
	copyFileSync(commitlintFileTemplateDir, commitlintFile); // 复制commitlint配置至项目中
	spinner.success({ text: green("安装成功~准备添加钩子! 🎉"), mark: "✔" }); // 包安装成功啦~
	const hookSpinner = createSpinner("添加husky钩子中...").start(); // 开始装钩子
	exec(`${createHookCommand}`, { cwd: projectDirectory }, (error) => {
		if (error) {
			hookSpinner.error({
				text: red(`添加钩子失败，请手动执行${createHookCommand}`),
				mark: "✖",
			});
			console.error(error);
			return;
		}
		hookSpinner.success({ text: green("一切就绪! 🎉"), mark: "✔" }); // 钩子安装成功啦~一切ok~~
	});
});
```

### 发包

最后，发下包，就可以在其他项目中使用啦

## 结尾

这个是本萌新因为懒又想把 git 提交规范下又不想每次创项目都要翻文档安装的产物，没有经过测试，中间部分代码会有更好的解决方案~
本代码[仓库](https://github.com/YomukiZRJ/yomuki-cli/tree/master/packages/create-ym-husky#readme)
