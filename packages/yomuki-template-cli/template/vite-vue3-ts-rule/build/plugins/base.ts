/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-08 17:25:43
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-09 15:37:40
 */
import { PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { createHtmlPlugin } from "vite-plugin-html";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
export default (viteEnv: ViteEnv) => {
	const { VITE_APP_TITLE } = viteEnv;
	const commonPlugins: (PluginOption | PluginOption[])[] = [
		vue(),
		vueJsx(),
		createHtmlPlugin({
			inject: {
				data: {
					title: VITE_APP_TITLE
				}
			}
		}),
		// name 可以写在 script 标签上
		VueSetupExtend()
	];
	return [...commonPlugins];
};
