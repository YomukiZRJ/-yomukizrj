/**
 * @see: https://stylelint.io
 */
module.exports = {
	/* 继承某些已有的规则 */
	extends: [
		"stylelint-config-standard", // 配置stylelint拓展插件
		"stylelint-config-standard-scss",
		"stylelint-config-html/vue", // 配置 vue 中 template 样式格式化
		"stylelint-config-prettier", // 配置stylelint和prettier兼容
	],
	overrides: [
		// 扫描 .vue/html 文件中的<style>标签内的样式
		{
			files: ["**/*.{vue,html}"],
			customSyntax: "postcss-html",
		},
	],
	/**
	 * null  => 关闭该规则
	 */
	rules: {},
};
