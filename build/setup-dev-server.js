const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const chokidar = require('chokidar')
const webpackDevMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const resolve = file => path.resolve(__dirname, file)

module.exports = (server, callback) => {
  // 设置 ready
  let ready
  const onReady = new Promise(r => ready = r)

  // 定义变量
  let serverBundle
  let template
  let clientManifest

  // 监视构建 -> 更新 Renderer
  const update = () => {
    if (serverBundle && template && clientManifest) {
      ready()
      callback(serverBundle, template, clientManifest)
    }
  }

  // 监听 template -> 调用 update -> 渲染 renderer
  // 1. 通过 fs.watch 或 fs.watchFile 监听 index.template.html 改变
  // 2. 通过 chokidar 第三方库（封装了 fs.watch 和 fs.watchFile）监听
  // 定义模板地址
  const templatePath = resolve('../index.template.html')
  template = fs.readFileSync(templatePath, 'utf8')
  update()
  // 模板发生改变时触发
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf8')
    console.log('Template had changed!')
    update()
  })

  // 监听 serverBundle -> 调用 update -> 渲染 renderer
  const serverConfigPath = resolve('../dist/vue-ssr-server-bundle.json')
  const serverConfig = require('./webpack.server.config')
  const serverCompiler = webpack(serverConfig)
  const serverDevMiddleware = webpackDevMiddleware(serverCompiler, {
    logLevel: 'silent'
  })
  // 完成后的钩子函数
  serverCompiler.hooks.done.tap('server', () => {
    // 编译完成后执行
    serverBundle = JSON.parse(
      serverDevMiddleware.fileSystem.readFileSync(serverConfigPath, 'utf8')
    )
    update()
  })

  // 监听 clientManifest -> 调用 update -> 渲染 renderer
  const clientConfigPath = resolve('../dist/vue-ssr-client-manifest.json')
  const clientConfig = require('./webpack.client.config')
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  clientConfig.entry.app = [
    'webpack-hot-middleware/client?quiet=true&reload=true', // 和服务端交互处理热更新一个客户端脚本
    clientConfig.entry.app
  ]
  clientConfig.output.filename = '[name].js'
  const clientCompiler = webpack(clientConfig)
  const clientDevMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'silent'
  })
  clientCompiler.hooks.done.tap('client', () => {
    clientManifest = JSON.parse(
      clientDevMiddleware.fileSystem.readFileSync(clientConfigPath, 'utf8')
    )
    update()
  })

  server.use(hotMiddleware(clientCompiler, {
    log: false // 关闭它本身的日志输出
  }))

  server.use(clientDevMiddleware)

  return onReady
}
