const path = require('path')
const vueConfig = require('./vue-loader.config')
const config = require('./../config/config')
const utils = require('./utils')

module.exports = {
  devtool: '#source-map',
  entry: {
    app: './src-client/client-entry.js',
    vendor: ['vue', 'vue-router', 'vuex', 'vuex-router-sync', 'axios']
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src-client'), 'node_modules'],
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'client': path.resolve(__dirname, '../src-client'),
      'assets': path.resolve(__dirname, '../src-client/assets'),
      'components': path.resolve(__dirname, '../src-client/components')
    }
  },
  output: {
    path: config.webpack.assetsRoot,
    publicPath: config.webpack.assetsPublicPath,
    filename: 'client-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: utils.assetsPath('img/[name].[ext]?[hash:7]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: utils.assetsPath('fonts/[name].[ext]?[hash:7]')
        }
      }
    ]
  }
}
