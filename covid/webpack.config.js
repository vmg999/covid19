var path = require('path');
const CopyWebpackPlugin= require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
      new CopyWebpackPlugin({
          patterns: [
            {
            from: './src/index.html',
            to: './index.html'
            },
            {
            from: './src/img',
            to: './img'
            },
            {
              from: './src/css',
              to: './css'
            }
      ]}),
    ]
};