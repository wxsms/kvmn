const fs = require('fs')
const mkdirp = require('mkdirp')

module.exports.imageFileFilter = (req, file, callback) => {
  let type = file.mimetype
  if (type !== 'image/png' && type !== 'image/jpg' && type !== 'image/jpeg' && type !== 'image/gif') {
    let err = new Error()
    err.code = 'UNSUPPORTED_MEDIA_TYPE'
    return callback(err, false)
  }
  callback(null, true)
}

module.exports.ensureUploadPath = (path) => {
  return new Promise((resolve, reject) => {
    fs.exists(path, exists => {
      if (exists) {
        resolve()
      } else {
        mkdirp(path, err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      }
    })
  })
}

