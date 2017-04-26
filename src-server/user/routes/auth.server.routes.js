const user = require('./../controllers/users.server.controller')
const passport = require('koa-passport')

module.exports = (router) => {
  router
    .post('/api/auth/register', user.register)
    .post('/api/auth/login', passport.authenticate('local'), user.login)
    .post('/api/auth/logout', user.logout)
}
