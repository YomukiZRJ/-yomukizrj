import { readdirSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
/**
 * 格式化目标目录 替换反斜杠 / 为空字符串
 * @param {string | undefined} targetDir
 */
export function formatTargetDir(targetDir) {
	return targetDir?.trim().replace(/\/+$/g, "");
}

/**
 * @param {string} path
 */
export function isEmpty(path) {
	const files = readdirSync(path);
	return files.length === 0 || (files.length === 1 && files[0] === ".git");
}
/**
 * 验证包名
 * @param {string} projectName
 */
export function isValidPackageName(projectName) {
	return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName);
}
/**
 * 项目名格式化为包名
 * @param {string} projectName
 */
export function toValidPackageName(projectName) {
	return projectName
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/^[._]/, "")
		.replace(/[^a-z0-9-~]+/g, "-");
}
/**
 * @param {string} dir
 */
export function emptyDir(dir) {
	if (!existsSync(dir)) {
		return;
	}
	for (const file of readdirSync(dir)) {
		rmSync(resolve(dir, file), { recursive: true, force: true });
	}
}
