/*
 * webpack基础配置
 */
const ProgressBarPlugin = require("progress-bar-webpack-plugin"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	CopyWebpackPlugin = require("copy-webpack-plugin"),
	webpack = require("webpack"),
	{ VueLoaderPlugin } = require("vue-loader"),
	CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin"),
	DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin"),
	dotenv = require("dotenv"),
	{ rootPath } = require("./utils.js"),
	{ baseConfig } = require("./config.js");
const env = dotenv.config({ path: rootPath("build/.env") }).parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
	prev[`process.env.${next}`] = JSON.stringify(env[next]);
	return prev;
}, {});
module.exports = {
	entry: rootPath("src/main.js"),
	module: {
		/**
		 * @see https://webpack.docschina.org/configuration/module/#modulenoparse
		 */
		noParse: /jquery|(^vue$)|(^pinia$)|(^vue-router$)/,
		rules: [
			{
				test: /\.vue$/,
				include: rootPath("src"),
				exclude: /node_modules/,
				use: ["vue-loader"],
			},
			{
				test: /\.(js|jsx)$/, //对所有js后缀的文件进行编译
				include: rootPath("src"),
				exclude: /node_modules/,
				use: ["babel-loader?cacheDirectory=true"],
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
									/**
									 * use CSS modules
									 * @see https://www.npmjs.com/package/css-loader
									 */
									modules: true,
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
				exclude: /node_modules/,
				oneOf: [
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
			/**
			 * v5内置资源模块
			 * @see https://webpack.docschina.org/guides/asset-modules/
			 */
			{
				test: /\.(png|jpe?g|gif|ico|bmp|svg)$/i,
				type: "asset",
				parser: {
					dataUrlCondition: {
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
		 * 注入环境变量
		 */
		new webpack.DefinePlugin(envKeys),
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
					to: rootPath("dist/public"), // 目的源
				},
			],
		}),
		/**
		 * html文件处理
		 */
		new HtmlWebpackPlugin({
			template: rootPath("index.html"),
			filename: "index.html",
			title: baseConfig.APP_NAME, // 模板内，通过 <%= htmlWebpackPlugin.options.title %> 拿到的变量
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
			format: `  :msg [:bar] :percent (:elapsed s)`,
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
	/**
	 * 模块缓存
	 * @see https://webpack.docschina.org/configuration/cache/
	 */
	cache: {
		type: "filesystem", // 将缓存类型设置为文件系统
		buildDependencies: {
			config: [__filename],
		},
	},
};
