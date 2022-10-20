/*
 * webpack prod 配置
 */
const { merge } = require("webpack-merge"),
	common = require("./webpack.base.js"),
	CompressionPlugin = require("compression-webpack-plugin"),
	TerserWebpackPlugin = require("terser-webpack-plugin"),
	BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin,
	{ rootPath } = require("./utils.js"),
	{ baseConfig } = require("./config.js");
const prodPlugins = [];
if (baseConfig.BUILD_ANALYZER) {
	prodPlugins.push(
		/**
		 * 产物包分析
		 */
		new BundleAnalyzerPlugin({
			openAnalyzer: true, // 是否自动打开浏览器
		})
	);
}
if (baseConfig.BUILD_GZIP) {
	prodPlugins.push(
		/**
		 * gzip压缩
		 */
		new CompressionPlugin({
			deleteOriginalAssets: false, // 是否删除原产物
		})
	);
}
module.exports = merge(common, {
	mode: "production",
	devtool: "source-map",
	module: {},
	plugins: prodPlugins,
	output: {
		filename: "js/[name].[contenthash].js",
		path: rootPath("dist"),
		clean: true,
	},
	optimization: {
		runtimeChunk: "single",
		splitChunks: {
			chunks: "all", // 表示哪些代码需要优化，默认为 async ；initial(初始块)、async(按需加载块)、all(全部块)
			minSize: 20000, // 表示在压缩前的最小模块大小，默认为 20000
			minChunks: 1, // 要提取的chunk最少被引用次数，默认为2
			maxAsyncRequests: 30, // 按需加载时的最大并行请求数，默认30
			maxInitialRequests: 30, // 入口点的最大并行请求数，默认30
			enforceSizeThreshold: 50000, // 强制执行拆分的体积阈值，默认值50000，其他限制（minRemainingSize，maxAsyncRequests，maxInitialRequests）将被忽略。
			// cacheGroups: {
			// 	vendor: {
			// 		test: /[\\/]node_modules[\\/]/,
			// 		name(module) {
			// 			// use npm
			// 			// get the name. E.g. node_modules/packageName/not/this/part.js
			// 			// or node_modules/packageName
			// 			// const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
			// 			// return `npm.${packageName.replace("@", "")}`;
			// 			// use pnpm
			// 			const packageName = module.context.match(/[\\/]node_modules\/.pnpm[\\/](.*?)([\\/]|$)/)[1];
			// 			return `npm.${packageName.replaceAll("@", "").replaceAll("+", "-")}`;
			// 		},
			// 	},
			// },
		},
		minimize: true,
		minimizer: [
			/**
			 * 做压缩和混淆 https://github.com/terser/terser#minify-options
			 * @see https://webpack.js.org/plugins/terser-webpack-plugin/
			 */
			new TerserWebpackPlugin({
				parallel: true, // 多进程并发，默认true
				terserOptions: {
					format: {
						comments: false, // 是否保留注释
					},
					compress: {
						pure_funcs: ["console.log"],
					},
				},
				extractComments: false, // 是否将注释剥离到单独的文件中 默认true
			}),
		],
	},
});
