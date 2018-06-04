const CleanWebpackPlugin = require('clean-webpack-plugin');
const fs = require('fs');
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require("./webpack.base.config");
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = merge(config, {
	module: {
		rules: [
			{
				include: rootDir('sass'),
				test: /(\.scss|\.css)$/,
				use: ExtractTextPlugin.extract(
					{
						use: [
							'css-loader',
							"sass-loader",
							"postcss-loader"
						],
						fallback: 'style-loader',
						publicPath: '../'
					}
				),
				exclude: /node_modules/
			},
		],
	},

	devtool: 'source-map',
	plugins: [
		// 每次打包前，先清空原来目录中的内容
		new CleanWebpackPlugin(rootDir("dist"), {verbose: false, root: rootDir('/')}),
		// 官方文档推荐使用下面的插件确保 NODE_ENV
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
		}),
		// 抽取公共CSS 文件
		new ExtractTextPlugin({
			filename: './css/layout.css',
			allChunks: true,
			ignoreOrder: true
		}),
		//压缩代码
		new ParallelUglifyPlugin({
			cacheDir: rootDir('cache'),
			uglifyJS: {
				output: {
					comments: false
				},
				compress: {
					warnings: false,
					drop_debugger: true,
					drop_console: true
				}
			}
		}),

		//启用css代码压缩
		new webpack.LoaderOptionsPlugin({minimize: true}),

		new CopyWebpackPlugin([
			{
				from: rootDir('images'),
				to: rootDir('dist/images'),
				ignore: ['.*']
			}
		]),

		new CopyWebpackPlugin([
			{
				from: rootDir('lib'),
				to: rootDir('dist/lib'),
				ignore: ['.*']
			}
		]),
		new CopyWebpackPlugin([
			{
				from: rootDir('video'),
				to: rootDir('dist/video'),
				ignore: ['.*']
			}
		]),
		new CopyWebpackPlugin([
			{
				from: rootDir('fonts'),
				to: rootDir('dist/fonts'),
				ignore: ['.*']
			}
		]),

		new BundleAnalyzerPlugin()
	]
});
// 构建之前删除入口文件的HTML文件
delHtml();

function delHtml() {
	Object.keys(module.exports.entry).forEach((v) => {
		fs.readFile(rootDir(`/entry/${v}.js`), 'UTF8', (err, data) => {
			let str = `import 'pages/${v}.html'`;
			let reg = new RegExp(str, 'ig');
			let newData = data.replace(reg, '');
			fs.writeFileSync(rootDir(`/entry/${v}.js`), newData);
		});
	});
}

//html构建
pagesBuild();

function pagesBuild() {
	Object.keys(module.exports.entry).forEach((key) => {
		if (key === 'common') {
			return
		}
		const htmlPlugin = new HtmlWebpackPlugin({
			filename: `${key}.html`,
			chunks: ['vendor', key],
			template: rootDir(`/pages/${key}.html`),
			hash: false,
			/*     minify: {
				   removeComments: true,
				   collapseWhitespace: true,
				   removeAttributeQuotes: true
				 }*/
		});
		module.exports.plugins.push(htmlPlugin);
	})
}

function rootDir(src) {
	return path.join(__dirname, '..', src);
}
