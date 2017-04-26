const articles = require('./../controllers/articles.server.controller')

module.exports = (router) => {
  router
    .get('/api/articles/', articles.list)
    .get('/api/articles/:id', articles.get)
}
