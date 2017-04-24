'use strict'

process.env.VUE_ENV = 'server'
const isProd = process.env.NODE_ENV === 'production'

const fs = require('fs')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)
const serialize = require('serialize-javascript')
const createBundleRenderer = require('vue-server-renderer').createBundleRenderer

// const app = express()
const Koa = require('koa')
const staticCache = require('koa-static-cache')
const app = new Koa()
const favicon = require('koa-favicon')

// parse index.html template
const html = (() => {
  const template = fs.readFileSync(resolve('./index.html'), 'utf-8')
  const i = template.indexOf('{{ APP }}')
  // styles are injected dynamically via vue-style-loader in development
  const style = isProd ? '<link rel="stylesheet" href="/dist/styles.css">' : ''
  return {
    head: template.slice(0, i).replace('{{ STYLE }}', style),
    tail: template.slice(i + '{{ APP }}'.length)
  }
})()

let renderer
if (isProd) {
  // create server renderer from real fs
  const bundlePath = resolve('./dist/server-bundle.js')
  renderer = createRenderer(fs.readFileSync(bundlePath, 'utf-8'))
} else {
  require('./build/dev-server')(app, bundle => {
    renderer = createRenderer(bundle)
  })
}

function createRenderer (bundle) {
  return createBundleRenderer(bundle, {
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

app.use(require('koa-bigpipe'))

app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}`)
})

app.use(favicon(path.resolve(__dirname, 'src/assets/logo.png')))
app.use(staticCache(path.join(__dirname, 'dist'), {
  maxAge: 365 * 24 * 60 * 60,
  prefix: '/dist'
}))

app.use(async (ctx, next) => {
  if (ctx.path.startsWith('/dist')) return
  let res = ctx.res
  let req = ctx.req
  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }
  const context = {url: req.url}
  const stream = renderer.renderToStream(context)
  stream.write(html.head)
  if (context.initialState) {
    stream.write(`<script>window.__INITIAL_STATE__ = ${serialize(context.initialState, {isJSON: true})}</script>`)
  }
  const passThrough = require('stream').PassThrough()
  stream.on('end', () => {
    passThrough.end(html.tail)
  }).pipe(passThrough)
  ctx.body = passThrough
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
