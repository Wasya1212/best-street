const Koa = require('koa');
const Morgan = require('koa-morgan');
const BodyParser = require('koa-body');
const Serve = require('koa-static');
// const Session = require('koa-session2');
const Cors = require('@koa/cors');

const Logger = require('./middleware/logger');
// const Passport = require('./middleware/passport');
const ErrorHandler = require('./middleware/error-handler');

// const { FeatureRouter, RouteRouter, UserRouter, AuthRouter, ProductRouter, OrderRouter } = require('./routes');

const Router = require('./routes');

const app = new Koa();

app.keys = ['secret'];

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(Cors());
app.use(Serve(__dirname + '../../../dist/public/'));
app.use(Morgan('combined', { stream: Logger.stream }));
app.use(ErrorHandler({ errorLogger: Logger, logMethodName: 'error' }));
app.use(BodyParser({
  formidable: {
    uploadDir: __dirname + '/uploads', // будь-який дєбіл може надіслати тонну файликів і сервак ляже, навіть якщо він не авторизований. ВИПРАВИТИ!
    keepExtensions: true
  },
  multipart: true,
  urlencoded: true
}));

// app.use(Session({
//   key: 'ppa:ogloni.igs',
//   maxAge: 24 * 60 * 60 * 1000,
//   httpOnly: true,
//   overwrite: true,
//   signed: true,
//   store: Mongoose.createStore()
// }));

// app.use(Passport.initialize())
// app.use(Passport.session())

app.use(Router.routes());
app.use(Router.allowedMethods());

app.on('error', (err, ctx) => {
  if (err.statusCode !== 500) {
    console.log('User Error!');
  }
});

module.exports = app;
