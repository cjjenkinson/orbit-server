'use strict';

// Init server
const koa = require('koa');
const app = module.exports = new koa();

// Dependencies
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const cors = require('kcors');
const logger = require('koa-logger');

// Compress
app.use(compress());

// Run server
if (!module.parent) {
  const port = process.env.PORT || 3000;
  app.listen(port);
  // eslint-disable-next-line
  console.log('Listening to Orbits server at port %s', port);
}
