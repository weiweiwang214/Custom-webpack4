const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const config = require('./webpack.base.config');
module.exports = merge(config, {
  devtool: 'source-map',
  devServer: {
    contentBase: './',
    hot: true,
    port: 8081,
    compress: true
  },
  module: {
    rules: [
      {
        include: rootDir('sass'),
        test: /(\.scss|\.css)$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
			loader: "postcss-loader"
		}, {
          loader: "sass-loader"
        }]
      },
      {
        test: /\.html$/,
        use: [{
          loader: "raw-loader"
        }],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});

// 构建之前往入口文件添加HTML文件(HTML热更新)
/*addHtml();*/

function addHtml() {
  Object.keys(module.exports.entry).forEach((v) => {
    let str = `import 'pages/${v}.html'`;
    fs.readFile(rootDir(`entry/${v}.js`), 'UTF8', (err, data) => {
      if (!(data.indexOf(str) === -1) || v === 'common') {
        return
      }
      fs.appendFile(rootDir(`entry/${v}.js`), str);
    });
  });
}

//多页面html构建
function pagesBuild() {
  Object.keys(module.exports.entry).forEach((key) => {
    if (key === 'common') {
      return
    }
    const htmlPlugin = new HtmlWebpackPlugin({
      filename: `${key}.html`,
      chunks: ['vendor', key],
      inject: 'head',
      template: rootDir(`pages/${key}.html`),
    });
    module.exports.plugins.push(htmlPlugin);
  })
}

pagesBuild();

function rootDir(src) {
  return path.join(__dirname,'..',src);
}
