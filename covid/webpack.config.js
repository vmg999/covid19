var path = require('path');
const CopyWebpackPlugin= require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
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