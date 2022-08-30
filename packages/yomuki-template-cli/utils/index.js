/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-18 15:35:28
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-30 10:57:17
 */
import fs from "node:fs";
import path from "node:path";
/**
 * 格式化目标目录 替换反斜杠 / 为空字符串
 * @param {string | undefined} targetDir
 */
export function formatTargetDir(targetDir) {
	return targetDir?.trim().replace(/\/+$/g, "");
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
 * @param {string} path
 */
export function isEmpty(path) {
	const files = fs.readdirSync(path);
	return files.length === 0 || (files.length === 1 && files[0] === ".git");
}
/**
 * @param {string} dir
 */
export function emptyDir(dir) {
	if (!fs.existsSync(dir)) {
		return;
	}
	for (const file of fs.readdirSync(dir)) {
		fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
	}
}
/**
 * 复制文件
 * @param {*} src
 * @param {*} dest
 */
export function copy(src, dest) {
	const stat = fs.statSync(src);
	// 判断是否为目录
	if (stat.isDirectory()) {
		copyDir(src, dest);
	} else {
		// 复制文件
		fs.copyFileSync(src, dest);
	}
}
/**
 * 复制目录
 * @param {string} srcDir
 * @param {string} destDir
 */
function copyDir(srcDir, destDir) {
	fs.mkdirSync(destDir, { recursive: true });
	for (const file of fs.readdirSync(srcDir)) {
		const srcFile = path.resolve(srcDir, file);
		const destFile = path.resolve(destDir, file);
		copy(srcFile, destFile);
	}
}
/**
 * 获取包管理器和版本号
 * @param {string | undefined} userAgent process.env.npm_config_user_agent
 * @returns object | undefined
 */
export function pkgFromUserAgent(userAgent) {
	if (!userAgent) return undefined;
	const pkgSpec = userAgent.split(" ")[0];
	const pkgSpecArr = pkgSpec.split("/");
	return {
		name: pkgSpecArr[0],
		version: pkgSpecArr[1],
	};
}
