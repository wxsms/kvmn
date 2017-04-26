const path = require('path')

module.exports = {
  app: {
    title: 'kvmn',
    description: 'Full-Stack JavaScript with MongoDB, Kao, Vue.js, and Node.js',
    keywords: 'mongodb, koa, vue.js, node.js, mongoose'
  },
  favicon: 'src-client/assets/img/logo.png',
  db: {
    promise: global.Promise
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  // DOMAIN config should be set to the fully qualified application accessible
  // URL. For example: https://www.myapp.com (including port if required).
  domain: process.env.DOMAIN,
  webpack: {
    assetsRoot: path.resolve(__dirname, '../../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/dist/'
  },
  // Session Cookie settings
  sessionOptions: {
    key: 'kvmn', /** (string) cookie key (default is koa:sess) */
    maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true /** (boolean) signed or not (default true) */
    /**
     * You can store the session content in external stores(redis, mongodb or other DBs) by pass options.store with three methods(need to be async function):
     * - get(key): get session object by key
     * - set(key, sess, maxAge): set session object for key, with a maxAge (in ms)
     * - destroy(key): destroy session for key
     */
  },
  // lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: {maxAge: 31536000, includeSubDomains: true},
    xssProtection: true
  },
  illegalUsernames: ['meanjs', 'administrator', 'password', 'admin', 'user',
    'unknown', 'anonymous', 'null', 'undefined', 'api'
  ]
}
