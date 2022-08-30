/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-30 10:55:11
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-30 11:09:41
 */
import { red, green, bold } from "kolorist";
import gradient from "gradient-string";
/**
 * @description: 打印普通提示
 * @param {string} str
 */
export function printNormal(str) {
	console.log(bold(gradient.morning(str)));
}
/**
 * @description: 打印成功提示
 * @param {string} str
 */
export function printSuccess(str) {
	console.log(bold(gradient.cristal(str)));
}
/**
 * @description: 打印警告提示
 * @param {string} str
 */
export function printWarn(str) {
	console.log(bold(gradient.passion(str)));
}
/**
 * @description: 打印失败提示
 * @param {string} str
 */
export function printError(str) {
	console.log(bold(gradient.passion(str)));
}
/**
 * @description: 返回美化后的失败提示语
 * @param {*} str
 * @return {*}
 */
export function errorText(str) {
	return red(str);
}
export function successText(str) {
	return green(str);
}
