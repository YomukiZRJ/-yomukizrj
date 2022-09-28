/*
 * @Desc:存放 dev 和 prod 通用配置
 * @Author: 曾茹菁
 * @Date: 2022-01-29 11:37:07
 * @LastEditors: 曾茹菁
 * @LastEditTime: 2022-09-06 15:49:28
 */
const chalk = require("chalk"),
	ProgressBarPlugin = require("progress-bar-webpack-plugin"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	CopyWebpackPlugin = require("copy-webpack-plugin"),
	{ VueLoaderPlugin } = require("vue-loader/dist/index"),
	CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin"),
	DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin"),
	{ rootPath } = require("./utils.js");
require("dotenv").config({ path: rootPath("env/.env." + process.env.NODE_ENV) });
// const idDev = process.env.NODE_ENV === "development";
// console.log(idDev);
module.exports = {
	entry: rootPath("src/main.js"), // 打包入口
	module: {
		rules: [
			{
				test: /\.vue$/,
				include: rootPath("src"),
				exclude: /node_modules/,
				use: ["vue-loader"],
			},
			{
				test: /\.(js|jsx)$/, //对所有js后缀的文件进行编译
				// include: path.resolve("src"), //表示在src目录下的.js文件都要进行一下使用的loader
				exclude: /node_modules/,
				use: [
					"babel-loader?cacheDirectory=true",
					{
						loader: "thread-loader",
						options: {
							workers: 3,
						},
					},
				],
			},
			{
				test: /\.css$/,
				oneOf: [
					// 这里匹配 `<style module>`
					{
						resourceQuery: /module/,
						use: [
							"style-loader",
							{
								loader: "css-loader",
								options: {
									modules: true, // use CSS modules  @see https://www.npmjs.com/package/css-loader
								},
							},
							"postcss-loader",
						],
					},
					// 这里匹配普通的 `<style>` 或 `<style scoped>`
					{
						use: ["style-loader", "css-loader", "postcss-loader"],
					},
				],
			},
			{
				test: /\.less$/,
				include: rootPath("src"),
				oneOf: [
					// 这里匹配 `<style module>`
					{
						resourceQuery: /module/,
						use: [
							"style-loader",
							{
								loader: "css-loader",
								options: {
									modules: true,
								},
							},
							"postcss-loader",
							"less-loader",
						],
					},
					// 这里匹配普通的 `<style>` 或 `<style scoped>`
					{
						use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
					},
				],
			},

			// 在webpack5中，内置了资源模块（asset module），代替了file-loader和url-loader
			{
				test: /\.(png|jpe?g|gif|ico|bmp|svg)$/i,
				type: "asset",
				parser: {
					dataUrlCondition: {
						// 转换成data-uri的条件
						maxSize: 10 * 1024, // 10kb
					},
				},
				generator: {
					filename: "images/[contenthash][ext][query]", // 指定生成目录名称
				},
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				type: "asset",
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024, // 10kb
					},
				},
				generator: {
					filename: "fonts/[contenthash][ext][query]",
				},
			},
		],
	},
	plugins: [
		/**
		 * 路径强制大小写
		 */
		new CaseSensitivePathsPlugin({
			debug: false, // 是否输出目录列表
		}),
		/**
		 * 复制静态资源至
		 */
		new CopyWebpackPlugin({
			patterns: [
				{
					from: rootPath("public"), // 复制源
					to: rootPath("dist/static"), // 目的源
				},
			],
		}),
		/**
		 * html文件处理
		 */
		new HtmlWebpackPlugin({
			template: rootPath("index.html"), //  模板文件
			filename: "index.html", // 输出name
			title: process.env.APP_NAME, // 模板内，通过 <%= htmlWebpackPlugin.options.title %> 拿到的变量
			minify: {
				//压缩HTML
				collapseWhitespace: true, //删除空格
				removeComments: true, //干掉注释
			},
		}),
		/**
		 * vueLoader插件
		 * 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块。
		 */
		new VueLoaderPlugin(),
		/**
		 * 进度条
		 */
		new ProgressBarPlugin({
			format: `  :msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
		}),
		/**
		 * 检测是否引入了一个包的多个版本
		 */
		new DuplicatePackageCheckerPlugin(),
	],
	resolve: {
		extensions: [".js", ".jsx", ".json", ".vue"], //省略文件后缀 yyx说.vue最好别省略
		alias: {
			//配置别名
			"@": rootPath("src"),
		},
	},
	// 缓存
	cache: {
		// 将缓存类型设置为文件系统
		type: "filesystem",
		buildDependencies: {
			// 推荐在 webpack 配置中设置 cache.buildDependencies.config: [__filename] 来获取最新配置以及所有依赖项
			config: [__filename],
		},
	},
};
