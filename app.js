'use strict';

// Init server
const koa = require('koa');
const app = module.exports = new koa();
const routes = require('./routes.js');

const User = require('./models/user');
require('./db');

// Dependencies
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const cors = require('kcors');
const logger = require('koa-logger');

// Logger
app.use(logger());
app.use(cors());
app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = undefined;
    switch (ctx.status) {
    case 401:
      ctx.app.emit('error', err, this);
      break;
    default:
      if (err.message) {
        ctx.body = {errors:[err.message]};
      }
      ctx.app.emit('error', err, this);
    }
  }
});

app.use(async (ctx, next) => {
  let token = ctx.headers['authorization'].split(' ').pop();

  if (!token) return await next();
  ctx.user = await User.findOne({token});

  return await next();
});

routes(app);

// Compress
app.use(compress());

// Run server
if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port);
  // eslint-disable-next-line
  console.log('Listening to Orbits server at port %s', port);
}
