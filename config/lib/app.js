const config = require('../config')
const koa = require('./koa')
const chalk = require('chalk')
const mongoose = require('./mongoose')
const seed = require('./seed')
const logger = require('./logger')

const seedDB = () => {
  if (config.seedDB && config.seedDB.seed) {
    logger.warn('Database seeding is turned on')
    seed.start()
  }
}

// Initialize Models
mongoose.loadModels(seedDB)

const init = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect()
      .then(() => {
        // Initialize Koa
        let app = koa.init()
        resolve(app)
      })
      .catch(reject)
  })
}

const start = () => {
  init()
    .then(app => {
      app.listen(config.port, config.host, () => {
        // Create server URL
        let server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port
        // Logging initialization
        console.log('--')
        console.log(chalk.green(config.app.title))
        console.log()
        console.log(chalk.green('Environment:     ' + process.env.NODE_ENV))
        console.log(chalk.green('Server:          ' + server))
        console.log(chalk.green('Database:        ' + config.db.uri))
        console.log(chalk.green('App version:     ' + config.kvmn.version))
        if (config.kvmn['kvmn-version']) {
          console.log(chalk.green('kvmn version:    ' + config.kvmn['kvmn-version']))
        }
        console.log('--')
      })
    })
    .catch(err => {
      console.log(config.port, config.host)
      console.error(err)
    })
}

module.exports = {init, start}
