'use strict';

const usersController = require('./controllers/usersController');

const router = require('koa-router')();

const routes = function (app) {
  router.post('/sign-up', usersController.create);
  router.get('/log-in', usersController.logIn);

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
