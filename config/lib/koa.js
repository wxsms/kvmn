process.env.VUE_ENV = 'server'
const IS_PROD = process.env.NODE_ENV === 'production'
const fs = require('fs')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)
const serialize = require('serialize-javascript')
const createBundleRenderer = require('vue-server-renderer').createBundleRenderer
const Koa = require('koa')
const Router = require('koa-router')
const staticCache = require('koa-static-cache')
const favicon = require('koa-favicon')
const morgan = require('koa-morgan')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const lusca = require('koa-lusca')
const helmet = require('koa-helmet')
const passport = require('koa-passport')
const mime = require('mime')
const logger = require('./logger')
const _ = require('lodash')
const config = require('./../config')

const initMorganHttpLogger = (app) => {
  // Enable logger (morgan) if enabled in the configuration file
  if (_.has(config, 'log.format')) {
    app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()))
  }
}

const initFaviconRoute = (app) => {
  app.use(favicon(path.resolve(__dirname, './../../' + config.favicon)))
}

const initStaticRoutes = (app) => {
  let distPath = IS_PROD ? path.join(__dirname, './../../dist/') : path.join(__dirname, './dist/')
  app.use(staticCache(distPath, {
    maxAge: 365 * 24 * 60 * 60,
    prefix: '/dist'
  }))
}

const initParsers = (app) => {
  app.use(bodyParser())
  app.use(session(config.sessionOptions, app))
}

const initSecures = (app) => {
  app.use(helmet())
  app.use(lusca(config.csrf))
}

const correctMimeTypes = (app) => {
  app.use(async (ctx, next) => {
    if (ctx.path.startsWith('/api/')) {
      ctx.type = 'json'
    } else {
      ctx.type = mime.lookup(ctx.path)
    }
    await next()
  })
}

const initVueSsr = (app) => {
  // parse index.html template
  const html = (() => {
    const template = fs.readFileSync(resolve('./../../index.html'), 'utf-8')
    const i = template.indexOf('{{ APP }}')
    let version = config.kvmn.version
    let subfix = IS_PROD ? '' : '&dev=true'
    // styles are injected dynamically via vue-style-loader in development
    let style = IS_PROD ? `<link rel="stylesheet" href="/dist/static/css/style.css?${version}${subfix}">` : ''
    let script = `<script src="/dist/client-vendor-bundle.js?${version}${subfix}"></script>`
    script += `<script src="/dist/client-bundle.js?${version}${subfix}"></script>`
    return {
      head: template.slice(0, i).replace('{{ STYLE }}', style),
      tail: template.replace('{{ SCRIPT }}', script).slice(i + '{{ APP }}'.length)
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
      ctx.body = 'Preparing client bundle, please wait...'
      return await next()
    }
    const context = {url: ctx.path}
    const vueRenderStream = renderer.renderToStream(context)
    const responseStream = require('stream').PassThrough()
    let firstChunk = true
    vueRenderStream.on('data', chunk => {
      if (firstChunk) {
        responseStream.write(html.head)
        if (context.initialState) {
          responseStream.write(`<script>window.__INITIAL_STATE__=${serialize(context.initialState, {isJSON: true})}</script>`)
        }
        firstChunk = false
      }
    })
    vueRenderStream.on('end', () => {
      responseStream.end(html.tail)
    }).pipe(responseStream)
    ctx.type = 'html'
    ctx.body = responseStream
  })
}

const initApiRoutes = (router) => {
  // Globbing routing files
  config.files.server.routes.forEach((routePath) => {
    require(path.resolve(routePath))(router)
  })
}

const initErrorRoutes = (router) => {
  // Set api and dist that not exist as 404
  router.all(/^\/api(?:\/|$)|(^\/dist(?:\/|$))/, ctx => {
    ctx.body = 'Not Found'
    ctx.type = 'text'
    ctx.status = 404
  })
}

const initPassport = (app) => {
  require('./../auth/local')
  app.use(passport.initialize())
  app.use(passport.session())
}

module.exports.init = () => {
  const app = new Koa()
  const router = new Router()
  app.keys = [config.sessionOptions.key]
  // in development mode static files lost mime type, fix by manually add
  if (!IS_PROD) {
    correctMimeTypes(app)
  }
  // lusca, helmet
  initSecures(app)
  // body-parser, session
  initParsers(app)
  // passport
  initPassport(app)
  // koa-morgan
  initMorganHttpLogger(app)
  // koa-favicon
  initFaviconRoute(app)
  // koa-static-cache
  initStaticRoutes(app)
  // All modules API route
  initApiRoutes(router)
  // 404
  initErrorRoutes(router)
  // Vue SSR middleware
  initVueSsr(app)
  // setup router
  app
    .use(router.routes())
    .use(router.allowedMethods())
  return app
}
