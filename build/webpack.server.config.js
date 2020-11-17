const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const vueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const commonWebpack = require('./webpack.common.config')

module.exports = merge(commonWebpack, {
  entry: './src/entry-server.js',
  // 以 node 适用方式处理模块加载
  target: 'node',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
    // library: {
    //   type: 'commonjs2'
    // }
  },
  // 不打包 node_modules 的第三方包，而是保留 require 方式直接加载
  externals: [nodeExternals({
    // 白名单中的资源依然打包
    allowlist: [/\.css$/]
  })],
  plugins: [
    // 这是将服务器的整个输出构建为单个 json 文件的插件
    // 默认文件名 vue-ssr-server-bundle.json
    new vueSSRServerPlugin()
  ]
})
