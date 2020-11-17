const vueLoaderPlugin = require('vue-loader/lib/plugin')
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd ? 'production' : 'development',
  output: {
    filename: '[name].[chunkhash].js',
    path: resolve('../dist'),
    publicPath: '/dist/'
  },
  resolve: {
    alias: {
      // 路径别名，@ 指向 src
      '@': resolve('../src')
    },
    // 可以省略的扩展名
    // 当省略扩展名时，则按照从前往后的顺序解析
    extensions: ['.js', '.vue', '.json']
  },
  devtool: isProd ? 'nosources-source-map' : 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.(gif|svg|png|je?pg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: 'file-loader'
      },
      {
        test: /\.vue$/i,
        use: 'vue-loader'
      },
      {
        test: /\.scss$/i,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new vueLoaderPlugin(),
    new friendlyErrorsWebpackPlugin()
  ]
}
