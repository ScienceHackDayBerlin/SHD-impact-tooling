const koa = require('koa')
const hbs = require('koa-hbs')
const router = require('koa-router')()
const controllers = require(__dirname + '/controllers/index')
const path = require('path')
 
var app = koa()

// configuration
global.config = require(__dirname + '/config.json');

app.use(function* (next) {
   for ( let name in config.page ) {
      this.state[`page_${name}`] = config.page[name]
   }
   yield next
})

// render with handlebars
app.use(hbs.middleware( {
   extname: config.template.format,
   viewPath: __dirname + config.template.viewPath,
   partialsPath: __dirname + config.template.partialsPath,
   layoutsPath: __dirname + config.template.layoutsPath,
   defaultLayout: 'default'
}))

// static files
app.use(require('koa-static')(__dirname + '/public'))

// page routes
router.get('/', controllers.index)

app.use(router.routes())
app.use(controllers.api.routes())

app.listen(config.server.port)
