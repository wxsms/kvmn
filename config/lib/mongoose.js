const config = require('../config')
const path = require('path')
const mongoose = require('mongoose')

// Load the mongoose models
const loadModels = (callback) => {
  config.files.server.models.forEach((modelPath) => {
    require(path.resolve(modelPath))
  })
  if (callback) callback()
}

// Initialize Mongoose
const connect = () => {
  mongoose.Promise = config.db.promise
  return mongoose.connect(config.db.uri, config.db.options)
}

const disconnect = () => {
  return mongoose.disconnect()
}

module.exports = {loadModels, connect, disconnect}
