const path = require('path')
const config = require('./../config/config')

exports.assetsPath = (_path) => {
  return path.posix.join(config.webpack.assetsSubDirectory, _path)
}
