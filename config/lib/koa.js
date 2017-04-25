process.env.VUE_ENV = 'server'
const IS_PROD = process.env.NODE_ENV === 'production'
const fs = require('fs')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)
const serialize = require('serialize-javascript')
const createBundleRenderer = require('vue-server-renderer').createBundleRenderer
const Koa = require('koa')
const staticCache = require('koa-static-cache')
const favicon = require('koa-favicon')
const morgan = require('koa-morgan')
const logger = require('./logger')
const _ = require('lodash')
const config = require('./../config')
/**
 * Initialize application middleware
 */
const initMorganHttpLogger = (app) => {
  // Enable logger (morgan) if enabled in the configuration file
  if (_.has(config, 'log.format')) {
    app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()))
  }
}

const initFaviconRoute = (app) => {
  app.use(favicon(path.resolve(__dirname, './../../src/assets/logo.png')))
}

const initStaticRoutes = (app) => {
  let distPath = IS_PROD ? path.join(__dirname, './../../dist/') : path.join(__dirname, './dist/')
  app.use(staticCache(distPath, {
    maxAge: 365 * 24 * 60 * 60,
    prefix: '/dist'
  }))
}

const initVueSsr = (app) => {
  // parse index.html template
  const html = (() => {
    const template = fs.readFileSync(resolve('./../../index.html'), 'utf-8')
    const i = template.indexOf('{{ APP }}')
    // styles are injected dynamically via vue-style-loader in development
    const style = IS_PROD ? '<link rel="stylesheet" href="/dist/styles.css">' : ''
    return {
      head: template.slice(0, i).replace('{{ STYLE }}', style),
      tail: template.slice(i + '{{ APP }}'.length)
    }
  })()
  // init renderer base on env
  const createRenderer = (bundle) => {
    return createBundleRenderer(bundle, {
      cache: require('lru-cache')({
        max: 1000,
        maxAge: 1000 * 60 * 15
      })
    })
  }

  let renderer
  if (IS_PROD) {
    // create server renderer from real fs
    const bundlePath = resolve('./../../dist/server-bundle.js')
    renderer = createRenderer(fs.readFileSync(bundlePath, 'utf-8'))
  } else {
    require('./../../build/dev-server')(app, bundle => {
      renderer = createRenderer(bundle)
    })
  }

  app.use(async (ctx, next) => {
    // Not doing this for dist & api & sockets
    if (ctx.path.startsWith('/dist/') || ctx.path.startsWith('/api/') || ctx.path.indexOf('__webpack_hmr') >= 0) {
      return await next()
    }
    // renderer not ready
    if (!renderer) {
      ctx.type = 'text'
      ctx.body = 'waiting for compilation... refresh in a moment.'
      return await next()
    }
    const context = {url: ctx.path}
    const vueRenderStream = renderer.renderToStream(context)
    const responseStream = require('stream').PassThrough()
    responseStream.write(html.head)
    if (context.initialState) {
      responseStream.write(`<script>window.__INITIAL_STATE__ = ${serialize(context.initialState, {isJSON: true})}</script>`)
    }
    vueRenderStream.on('end', () => {
      responseStream.end(html.tail)
    }).pipe(responseStream)
    ctx.type = 'html'
    ctx.body = responseStream
  })
}

module.exports.init = () => {
  const app = new Koa()
  initMorganHttpLogger(app)
  initFaviconRoute(app)
  initStaticRoutes(app)
  initVueSsr(app)
  // listenOnPort(app)
  return app
}
