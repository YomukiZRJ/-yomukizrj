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
		messages: {
			skip: ":skip", // 该字段可以通过回车跳过
			max: "upper %d chars", // 最大字符数
			min: "%d chars at least", // 最少字符数
			emptyWarning: "can not be empty", // 该字段不能为空
			upperLimitWarning: "over limit", // 超出字数限制
			lowerLimitWarning: "below limit", // 字符数小于下限
		},
		questions: {
			type: {
				description: "选择你要提交的类型 :",
				enum: {
					feat: {
						description: "🚀  新增功能",
						title: "Features",
						emoji: "🚀",
					},
					fix: {
						description: "🐛  修复缺陷",
						title: "Bug Fixes",
						emoji: "🐛",
					},
					docs: {
						description: "📚  文档变更",
						title: "Documentation",
						emoji: "📚",
					},
					style: {
						description: "🎨  代码格式（不影响功能，例如空格、分号等格式修正）",
						title: "Styles",
						emoji: "🎨",
					},
					refactor: {
						description: "📦  代码重构（不包括 bug 修复、功能新增）",
						title: "Code Refactoring",
						emoji: "📦",
					},
					perf: {
						description: "⚡️  性能优化",
						title: "Performance Improvements",
						emoji: "⚡️",
					},
					test: {
						description: "🚨  添加疏漏测试或已有测试改动",
						title: "Tests",
						emoji: "🚨",
					},
					build: {
						description: "🛠   构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）",
						title: "Builds",
						emoji: "🛠",
					},
					ci: {
						description: "🎡  修改 CI 配置、脚本",
						title: "Continuous Integrations",
						emoji: "🎡",
					},
					chore: {
						description: "🔨  对构建过程或辅助工具和库的更改（不影响源文件、测试用例）",
						title: "Chores",
						emoji: "🔨",
					},
					revert: {
						description: "⏪️  回滚 commit",
						title: "Reverts",
						emoji: "⏪️",
					},
				},
			},
			scope: {
				description: "选择一个提交范围（可选）(e.g. component or file name):",
			},
			subject: {
				description: "填写简短精炼的变更描述 :\n",
			},
			body: {
				description: "填写更加详细的变更描述（可选）。使用 " | " 换行 :\n",
			},
			isBreaking: {
				description: "有什么非兼容性的变化吗？",
			},
			breakingBody: {
				description: "非兼容性更改提交需要一个主体。请输入提交本身的较长描述",
			},
			breaking: {
				description: "列举非兼容性重大的变更（可选）。使用 " | " 换行 :\n",
			},
			isIssueAffected: {
				description: "此更改是否影响任何open issues?",
			},
			issuesBody: {
				description: "如果issues已解决，则提交需要一个主体。请输入提交本身的较长描述",
			},
			issues: {
				description: 'Add issue references (e.g. "fix #123", "re #123".)',
			},
		},
	},
};
