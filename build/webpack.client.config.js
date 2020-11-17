const { merge } = require('webpack-merge')
const vueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const commonWebpack = require('./webpack.common.config')

module.exports = merge(commonWebpack, {
  entry: {
    app: './src/entry-client.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /(node_modules|bower_components)/, // 过略第三方库的转换
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              cacheDirectory: true, // 构建时，读取缓存，提升构建速度
              plugins: ['@babel/transform-runtime']
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      name: 'manifest',
      minChunks: Infinity
    }
  },
  plugins: [
    // 在 dist 中输出 vue-ssr-client-manifest.json 文件
    new vueSSRClientPlugin()
  ]
})
