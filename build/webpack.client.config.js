const base = require('./webpack.base.config')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')
const utils = require('./utils')

const config = Object.assign({}, base, {
  plugins: (base.plugins || []).concat([
    // strip comments in Vue code
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'client-vendor-bundle.js'
    })
  ])
})

if (process.env.NODE_ENV === 'production') {
  // extract CSS into a single file so it's applied on initial render
  const ExtractTextPlugin = require('extract-text-webpack-plugin')

  vueConfig.loaders = {
    css: ExtractTextPlugin.extract({
      use: 'css-loader'
    }),
    less: ExtractTextPlugin.extract({
      use: 'css-loader!less-loader'
    }),
    stylus: ExtractTextPlugin.extract({
      use: 'css-loader!stylus-loader'
    })
  }

  config.plugins = config.plugins.concat([
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/style.css?[contenthash:7]')
    }),
    // this is needed in webpack 2 for minifying CSS
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // minify JS
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    })
  ])
}

module.exports = config
