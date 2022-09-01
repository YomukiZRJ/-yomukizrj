/*
 * @Desc:
 * @Author: 曾茹菁
 * @Date: 2022-01-29 11:37:02
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-09-01 11:00:46
 */
const path = require("path"),
	{ merge } = require("webpack-merge"),
	common = require("./webpack.base.js"),
	CompressionPlugin = require("compression-webpack-plugin"), // gzip压缩
	TerserWebpackPlugin = require("terser-webpack-plugin"),
	BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(common, {
	mode: "production",
	module: {},
	plugins: [
		new BundleAnalyzerPlugin({
			openAnalyzer: false, // 是否自动打开浏览器
		}),
		new CompressionPlugin(),
	],
	output: {
		filename: "js/[name].[contenthash].js", //contenthash 若文件内容无变化，则contenthash 名称不变
		path: path.resolve(__dirname, "../dist"),
		clean: true,
	},
	optimization: {
		splitChunks: {
			// 选择哪些 chunk 进行优化，默认async，即只对动态导入形成的chunk进行优化。
			chunks: "all",
			// 提取chunk最小体积
			minSize: 20000,
			// 要提取的chunk最少被引用次数
			minChunks: 1,
			// 对要提取的chunk进行分组
			cacheGroups: {
				// 匹配node_modules中的三方库，将其打包成一个chunk
				defaultVendors: {
					test: /[\\/]node_modules[\\/]/,
					// chunk名称
					name: "vendors",
					priority: -10,
				},
				default: {
					// 将至少被两个chunk引入的模块提取出来打包成单独chunk
					minChunks: 2,
					name: "default",
					priority: -20,
				},
			},
		},
		minimize: true,
		minimizer: [
			/**
			 * 做压缩和混淆 https://github.com/terser/terser#minify-options
			 * https://webpack.js.org/plugins/terser-webpack-plugin/#remove-comments
			 */
			new TerserWebpackPlugin({
				compress: {
					pure_funcs: ["console.log"],
				},
				terserOptions: {
					format: {
						comments: false,
					},
				},
				extractComments: false,
			}),
		],
	},
});
