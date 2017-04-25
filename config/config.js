const _ = require('lodash')
const chalk = require('chalk')
const glob = require('glob')
const fs = require('fs')
const path = require('path')

/**
 * Get files by glob patterns
 */
const getGlobbedPaths = (globPatterns, excludes) => {
  // URL paths regex
  let urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i')

  // The output array
  let output = []

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach((globPattern) => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes))
    })
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns)
    } else {
      let files = glob.sync(globPatterns)
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            for (let i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '')
              }
            }
          } else {
            file = file.replace(excludes, '')
          }
          return file
        })
      }
      output = _.union(output, files)
    }
  }
  return output
}

/**
 * Validate NODE_ENV existence
 */
const validateEnvironmentVariable = () => {
  let environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js')
  console.log()
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'))
    } else {
      console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'))
    }
    process.env.NODE_ENV = 'development'
  }
  // Reset console color
  console.log(chalk.white(''))
}

/**
 * Validate Secure=true parameter can actually be turned on
 * because it requires certs and key files to be available
 */
const validateSecureMode = (config) => {
  if (!config.secure || config.secure.ssl !== true) {
    return true
  }

  let privateKey = fs.existsSync(path.resolve(config.secure.privateKey))
  let certificate = fs.existsSync(path.resolve(config.secure.certificate))

  if (!privateKey || !certificate) {
    console.log(chalk.red('+ Error: Certificate file or key file is missing, falling back to non-SSL mode'))
    console.log(chalk.red('  To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh'))
    console.log()
    config.secure.ssl = false
  }
}

/**
 * Initialize global configuration files
 */
const initGlobalConfigFiles = (config, assets) => {
  // Appending files
  config.files = {
    server: {},
    client: {}
  }

  // Setting Globbed model files
  config.files.server.models = getGlobbedPaths(assets.server.models)

  // Setting Globbed route files
  config.files.server.routes = getGlobbedPaths(assets.server.routes)

  // Setting Globbed config files
  config.files.server.configs = getGlobbedPaths(assets.server.config)

  // Setting Globbed socket files
  config.files.server.sockets = getGlobbedPaths(assets.server.sockets)

  // Setting Globbed policies files
  config.files.server.policies = getGlobbedPaths(assets.server.policies)
}

/**
 * Initialize global configuration
 */
const initGlobalConfig = () => {
  // merge env
  validateEnvironmentVariable()
  const defaultConfig = require(path.join(process.cwd(), 'config/env/default'))
  const environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {}
  let config = _.merge(defaultConfig, environmentConfig)
  // merge assets
  const defaultAssets = require(path.join(process.cwd(), 'config/assets/default'))
  const environmentAssets = require(path.join(process.cwd(), 'config/assets/', process.env.NODE_ENV)) || {}
  const assets = _.merge(defaultAssets, environmentAssets)
  // start working
  config.meanjs = require(path.resolve('./package.json'))
  // Extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings present in the local configuration.
  config = _.merge(config, (fs.existsSync(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js')) && require(path.join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js'))) || {})
  initGlobalConfigFiles(config, assets)
  validateSecureMode(config)
  config.utils = {
    getGlobbedPaths: getGlobbedPaths
  }
  return config
}

module.exports = initGlobalConfig()
