/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-18 15:43:48
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-18 17:57:16
 */
import { blue, cyan, green, lightRed, magenta, red, reset, yellow } from "kolorist";
const BUNDLERS = [
	{
		title: "webpack",
		description: "老牌打包器，不会出错",
		color: yellow,
		children: [
			{
				title: "webpack-vue3-js",
				template: "webpack-vue3-js",
				description: "less + eslint + prettier + jsx + vueuse + axios + lodash + pinia + vue-router",
				color: magenta,
			},
		],
	},
	{
		title: "vite",
		description: "快快快",
		color: green,
		children: [
			{
				title: "vite-vue3-ts-rule",
				template: "vite-vue3-ts-rule",
				description: "commitlint + eslint + husky + stylelint + prettier + commitizen + jsx",
				color: blue,
			},
		],
	},
	{
		title: "father",
		color: cyan,
		description: "用来打包工具函数，自定义指令，钩子啥的",
		disabled: true,
	},
];
const TEMPLATES = BUNDLERS.map((f) => (f.children && f.children.map((v) => v.template)) || []).reduce((a, b) => a.concat(b), []);
export { BUNDLERS, TEMPLATES };
