const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.EnvironmentPlugin({
      PATH_PREFIX: process.env.LAMA_PATH_PREFIX || '',
      API_URL: process.env.API_URL || '/api',
      WS_URL: process.env.WS_URL || `wss://${process.env.LAMA_PRODUCTION_DOMAIN}/ws`,
      APPBAR_COLOR: '#3f51b5',
    }),
  ],
});
