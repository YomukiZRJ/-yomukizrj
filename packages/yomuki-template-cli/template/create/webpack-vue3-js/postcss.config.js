/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-01-29 11:52:52
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-04-11 14:02:41
 */
const autoprefixer = require("autoprefixer");
module.exports = {
	plugins: [
		autoprefixer({
			// browsers: ["last 10 Chrome versions", "last 5 Firefox versions", "Safari >= 6", "ie> 8"],
		}),
	],
};
