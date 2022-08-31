/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-08 17:31:34
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-09 15:37:15
 */
import { PluginOption } from "vite";
import legacy from "@vitejs/plugin-legacy";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
export default function createBuildPlugins(viteEnv: ViteEnv) {
	const { VITE_BUILD_GZIP, VITE_LEGACY, VITE_REPORT } = viteEnv;
	const plugins: PluginOption[] = [];
	/**
	 * 拓展浏览器支持
	 */
	VITE_LEGACY &&
		plugins.push(
			legacy({
				targets: ["defaults", "not IE 11"]
			})
		);
	/**
	 * 打包gzip
	 */
	VITE_BUILD_GZIP &&
		plugins.push(
			viteCompression({
				verbose: true,
				disable: false,
				threshold: 10240,
				algorithm: "gzip",
				ext: ".gz"
			})
		);
	/**
	 * 打包分析
	 */
	VITE_REPORT &&
		plugins.push(
			visualizer({
				filename: "visualizer.html",
				open: false
			})
		);
	return plugins;
}
