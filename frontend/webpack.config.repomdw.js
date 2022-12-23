const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');

const PREFIX = process.env.LAMA_PATH_PREFIX || '/lama';
module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.EnvironmentPlugin({
      PATH_PREFIX: PREFIX,
      API_URL: PREFIX + '/api',
      WS_URL: process.env.LAMA_WEBSOCKET_URL || 'ws://localhost:9054/lama/ws',
      APPBAR_COLOR: '#3f51b5',
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'dist/index.html'),
      publicPath: PREFIX,
      template: path.resolve(__dirname, 'src/index.html'),
    }),
  ],
});
