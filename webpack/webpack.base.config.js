const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

// 配置常量
// 设置入口文件路径
const SRC_PATH = rootDir('entry');
// 打包后的资源根目录（本地物理文件路径）
const TEMPLATE_BUILD_PATH = rootDir('dist');

module.exports = {
	context: SRC_PATH, // 设置源代码的默认根路径
	entry: getEntries(SRC_PATH),
	output: {
		path: TEMPLATE_BUILD_PATH,
		filename: './js/[name].js',
		/*   publicPath: "http://192.168.1.117:8080/"*/
	},
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			'pages': '../pages',
			'sass': '../sass'
		}
	},
	module: {
		rules: [
			{
				include: [SRC_PATH, rootDir('lib')],
				test: /\.jsx?$/,
				use: {loader: 'babel-loader', options: {cacheDirectory: true}}
			},
			{
				include: rootDir('images'),
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: 'images/icons/[name].[ext]',
							publicPath: '../'
						}
					}
				]
			},
			{
				include: rootDir('fonts'),
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							mimetype: 'application/font-woff',
							name: 'fonts/[name].[ext]'
						}
					}
				]
			},
			{
				include: rootDir('fonts'),
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							mimetype: 'application/font-woff',
							name: 'fonts/[name].[ext]'
						}
					}
				]
			},
			{
				test: require.resolve('jquery'),
				use: [{
					loader: 'expose-loader',
					options: 'jQuery'
				}, {
					loader: 'expose-loader',
					options: '$'
				}]
			},
			{
				test: require.resolve('fastclick'),
				use: [{
					loader: 'expose-loader',
					options: 'FastClick'
				}]
			}
		]
	},
	plugins: [
		// 启用 CommonChunkPlugin
		new webpack.optimize.CommonsChunkPlugin({
			names: 'vendor',
			filename: './js/[name].js',
			minChunks: 2
		})
	]
};

//开启查找入口文件
function getEntries(entryDir) {
	let files = glob.sync(entryDir.replace(/\/$/, '') + '/*.js'),
		entries = {};
	files.forEach((path) => {
		let fileName = path.match(/\/\w+[-]*[a-z,0-9]/ig).reverse()[0].replace(/\//, '');
		entries[fileName] = path;
	});
	return entries;
}

function rootDir(src) {
	return path.join(__dirname, '..', src);
}
