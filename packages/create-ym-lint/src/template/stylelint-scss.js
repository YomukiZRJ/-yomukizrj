/**
 * @see: https://stylelint.io
 */
module.exports = {
	/* 继承某些已有的规则 */
	extends: [
		"stylelint-config-standard", // 配置stylelint拓展插件
		"stylelint-config-standard-scss",
		"stylelint-config-prettier", // 配置stylelint和prettier兼容
	],
	overrides: [],
	/**
	 * null  => 关闭该规则
	 */
	rules: {},
};
