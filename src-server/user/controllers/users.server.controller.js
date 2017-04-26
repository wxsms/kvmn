const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.getCurrent = ctx => {
  if (ctx.state.user) {
    let user = ctx.state.user.toJSON()
    delete user.password
    delete user.salt
    ctx.body = user
  } else {
    ctx.body = null
  }
}

exports.register = async (ctx) => {
  let body = ctx.request.body
  // For security measurement we remove the roles from the req.body object
  delete body.roles
  // Init user and add missing fields
  let user = new User(body)
  user.provider = 'local'
  user.displayName = user.firstName + ' ' + user.lastName
  // Save
  try {
    await user.save()
    ctx.body = user
  } catch (err) {
    let msg = 'Some thing went wrong. Please try again.'
    if (err.code === 11000) {
      ctx.status = 406
      msg = 'User already exist.'
    } else {
      ctx.status = 500
    }
    ctx.body = {msg: msg}
  }
}

exports.login = ctx => {
  let user = ctx.state.user.toJSON()
  delete user.password
  delete user.salt
  ctx.body = user
}

exports.logout = ctx => {
  ctx.logout()
  ctx.body = true
}
