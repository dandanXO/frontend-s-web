const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development', // 可改为 'production' 进行生产环境打包
  entry: './src/main.js', // 指定入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js', // 输出的 JavaScript 文件名
    clean: true, // 清理旧文件
  },
  devServer: {
    static: path.resolve(__dirname, 'src'), // 指定静态资源路径
    port: 8080, // 设置开发服务器端口
    open: true, // 自动打开浏览器
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 处理 CSS 文件
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // 处理图片文件
        type: 'asset/resource',
      },
      {
        test: /\.js$/, // 处理 JavaScript 文件
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // 使用 Babel 转译
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 指定 HTML 模板
      filename: 'index.html', // 输出文件名
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets'), // Source folder
          to: 'assets', // Destination folder (relative to `dist`)
        },
      ],
    }),
  ],
};
