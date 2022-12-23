const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.EnvironmentPlugin({
      PATH_PREFIX: process.env.LAMA_PATH_PREFIX || '',
      API_URL: 'http://localhost:3333',
      WS_URL: 'ws://localhost:3333/ws',
      APPBAR_COLOR: '#2e7d32',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: './dist',
    historyApiFallback: {
      disableDotRule: true,
    },
    hot: true,
    port: 9000,
  },
  devtool: 'cheap-module-source-map',
});
