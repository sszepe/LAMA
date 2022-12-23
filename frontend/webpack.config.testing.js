const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.EnvironmentPlugin({
      PATH_PREFIX: '',
      API_URL: '/api',
      WS_URL: `wss://${process.env.LAMA_TESTING_DOMAIN}/ws`,
      APPBAR_COLOR: '#0097a7',
    }),
  ],
});
