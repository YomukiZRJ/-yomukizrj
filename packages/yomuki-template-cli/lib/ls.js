#!/usr/bin/env node
import { bold } from "kolorist";
import gradient from "gradient-string";
import { TEMPLATES } from "../template/create/index.js";
export default () => {
	console.log(bold(gradient.morning("\n🐣当前有以下模板：\n")));
	TEMPLATES.forEach((item) => {
		console.log(item);
	});
};
