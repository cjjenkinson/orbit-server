'use strict';

const usersController = require('./controllers/usersController');

const router = require('koa-router')();

const authorize = async (ctx, next) => {
  if (!ctx.user) {
    ctx.status = 401;
    return;
  }

  await next();
};

const routes = function (app) {
  router.post('/sign-up', usersController.create);
  router.get('/log-in', usersController.logIn);
  router.get('/dashboard', authorize, usersController.dashboard);

  router.options('/', options);
  router.trace('/', trace);
  router.head('/', head);

  app
    .use(router.routes())
    .use(router.allowedMethods());

  return app;
};


const head = async () => {
  return;
};

const options = async () => {
  this.body = 'Allow: HEAD,GET,PUT,DELETE,OPTIONS';
};

const trace = async () => {
  this.body = 'Smart! But you can\'t trace.';
};

module.exports = routes;
