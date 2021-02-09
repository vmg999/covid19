const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssLoaders = (...extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '',
      },
    },
    {
      loader: 'css-loader',
      options: { url: false },
    },
  ];

  if (extra) {
    loaders.push(...extra);
  }

  return loaders;
};

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/index.html',
          to: './index.html',
        },
        {
          from: './src/img',
          to: './img',
        },
        {
          from: './src/audio',
          to: './audio',
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
};
