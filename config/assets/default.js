module.exports = {
  server: {
    allJS: ['server.js', 'config/**/*.js', 'server/*/**/*.js'],
    models: 'server/*/models/**/*.js',
    routes: ['server/!(core)/routes/**/*.js', 'server/core/routes/**/*.js'],
    sockets: 'server/*/sockets/**/*.js',
    config: ['server/*/config/*.js'],
    policies: 'server/*/policies/*.js',
    views: ['server/*/views/*.html']
  }
}
