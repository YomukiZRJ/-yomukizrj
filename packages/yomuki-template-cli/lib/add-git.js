#!/usr/bin/env node

import { printNormal } from "../../utils/print.js";

export default () => {
	async function run() {
		printNormal("\n🐣欢迎使用git hook添加工具！\n");
	}
	run().catch((e) => {
		console.error(e);
	});
};
