module.exports = {
  server: {
    allJS: ['server.js', 'config/**/*.js', 'src-server/*/**/*.js'],
    models: 'src-server/*/models/**/*.js',
    routes: ['src-server/!(core)/routes/**/*.js', 'src-server/core/routes/**/*.js'],
    sockets: 'src-server/*/sockets/**/*.js',
    config: ['src-server/*/config/*.js'],
    policies: 'src-server/*/policies/*.js',
    views: ['src-server/*/views/*.html']
  }
}
