const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 8586,
    proxy: {
      '/api/v3/flint': {
        target: 'https://fdp.qianxin.com',
        pathRewrite: {
          '^/api': '',
        },
        changeOrigin: true,
        secure: false,
        onProxyReq: proxyReq => {
          // 在这里可以修改请求头
          proxyReq.setHeader('origin', 'https://fdp.qianxin.com');
          proxyReq.setHeader('referer', 'https://fdp.qianxin.com');
        },
      },
    },
  },
});
