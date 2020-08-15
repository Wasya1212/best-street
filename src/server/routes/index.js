const Router = require('koa-router');

const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.body = "Hello world";

  await next();
});

module.exports = router;
