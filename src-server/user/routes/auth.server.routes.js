const user = require('./../controllers/users.server.controller')

module.exports = (router) => {
  router
    .post('/api/auth/register', user.register)
}
