const webpack = require('webpack');
const path = require('path');

const config = {
  entry: [
    './src/index.ts',
    './src/styles.css',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: 'babel-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      // {
      //   test: /\.css$/,
      //   exclude: /node_modules/,
      //   use: [
      //     'style-loader',
      //     {
      //       loader: 'file-loader',
      //       options: { name: '[name].css'}
      //     },
      //     'css-loader'
      //   ]
      // }
      // {
        // test: /\.scss$/,
        // exclude: /node_modules/,
        // use: [
          // 'style-loader',
          // {
            // loader: 'file-loader',
            // options: { /* outputPath: 'css/', */ name: '[name].css'}
          // },
          // 'sass-loader'
        // ]
      // }
    ],
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 8080,
  },
};

module.exports = config;
