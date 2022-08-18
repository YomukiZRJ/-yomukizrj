/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-08-08 15:43:48
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-08-09 15:38:00
 */
import { resolve } from "path";
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import createVitePlugins from "./build/plugins";
import { wrapperEnv } from "./build/utils";
function pathResolve(dir: string) {
	return resolve(__dirname, `./${dir}`);
}
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }: ConfigEnv): UserConfig => {
	const root = process.cwd();
	const env = loadEnv(mode, process.cwd());
	const viteEnv = wrapperEnv(env);
	const isBuild = command === "build";
	const { VITE_PORT, VITE_OPEN, VITE_PUBLIC_PATH, VITE_DROP_CONSOLE, VITE_OUTPUT_DIR } = viteEnv;
	// console.log(isBuild)
	return {
		/**
		 * 项目根目录，绝对|相对。默认为process.cwd()
		 */
		root,
		/**
		 * 用于开发或生产时的基础公共路径。默认/
		 */
		base: VITE_PUBLIC_PATH,
		/**
		 * 插件注入
		 */
		plugins: createVitePlugins(viteEnv, isBuild),
		resolve: {
			alias: [
				// @/xxxx => src/xxxx
				{
					find: "@/",
					replacement: pathResolve("src") + "/"
				},
				// #/xxxx => types/xxxx
				{
					find: "#/",
					replacement: pathResolve("types") + "/"
				}
			]
		},
		/**
		 * dev option
		 */
		server: {
			host: "0.0.0.0", // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
			port: VITE_PORT,
			open: VITE_OPEN,
			cors: true // 为开发服务器配置 CORS(跨域资源共享)。
		},
		/**
		 * esbuild option
		 */
		esbuild: {
			pure: VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
		},
		/**
		 * build
		 */
		build: {
			// target: 'es2015',// 编译的浏览器版本
			// cssTarget: 'chrome80',// 编辑的css的浏览器版本
			outDir: VITE_OUTPUT_DIR, // 输出目录
			// assetsDir:'assets',// 静态资源输出目录
			assetsInlineLimit: 4096, // 小于4kb的资源转为base64
			rollupOptions: {
				output: {
					// Static resource classification and packaging
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
				}
			},
			// minify: 'terser',
			/**
			 * 当 minify=“minify:'terser'” 解开注释
			 * Uncomment when minify="minify:'terser'"
			 */
			// terserOptions: {
			//   compress: {
			//     keep_infinity: true,
			//     drop_console: VITE_DROP_CONSOLE,
			//   },
			// },
			// Turning off brotliSize display can slightly reduce packaging time
			// brotliSize: false,
			chunkSizeWarningLimit: 2000
		}
	};
});
