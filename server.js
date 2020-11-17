const express = require('express')
const fs = require('fs')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const setupDevServer = require('./build/setup-dev-server')
const server = express()
const isProd = process.env.NODE_ENV === 'production'

// 定义渲染器
let renderer
// 定义一个 promise 来等待完成后执行
let onReady
// 判断是否是生产环境
if (isProd) {
  const resolve = file => path.resolve(__dirname, file)
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const template = fs.readFileSync(resolve('./index.template.html'), 'utf-8')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  // 直接通过 createBundleRenderer 来创建 renderer
  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest
  })
} else {
  // 通过 Promise 来等待渲染完成
  // 监听打包构建 -> 重新生成 renderer 渲染器
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer = createBundleRenderer(serverBundle, {
      template,
      clientManifest
    })
  })
}

const render = async (req, res) => {
  try {
    const html = await renderer.renderToString({
      title: 'Vue SSR',
      meta: `
        <meta name="description" content="这是一段描述" />
      `,
      url: req.url
    })
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  } catch (err) {
    console.log(err)
    res.status(500).end('Internal Server Error!')
  }
}

// 设置静态资源访问权限
server.use('/dist', express.static('./dist'))

server.get('*', isProd
  ? render
  : async (req, res) => {
    await onReady
    render(req, res)
  }
)

server.listen(8888, () => {
  console.log('server running at port 8888')
})
