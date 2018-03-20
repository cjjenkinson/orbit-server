'use strict';

const usersController = require('./controllers/usersController');
const workspacesController = require('./controllers/workspacesController');
const entriesController = require('./controllers/entriesController');
const snapshotsController = require('./controllers/snapshotsController');

const router = require('koa-router')();

const authorize = async (ctx, next) => {
  if (!ctx.user) {
    ctx.status = 401;
    return;
  }

  await next();
};

const routes = function (app) {
  // User
  router.get('/log-in', usersController.logIn);
  router.post('/sign-up', usersController.create);
  router.delete('/remove', authorize, usersController.removeUser);

  // Workspaces
  router.get('/dashboard', authorize, workspacesController.dashboard);
  router.post('/dashboard', authorize, workspacesController.addWorkspace);
  router.delete('/dashboard/:id', authorize, workspacesController.deleteWorkspace);

  // Entries
  router.get('/dashboard/:id/', authorize, entriesController.listEntries);
  router.post('/dashboard/:id/', authorize, entriesController.addEntry);
  router.delete('/dashboard/:id/:entryId', authorize, entriesController.deleteEntry);

  // // Snapshots
  // router.get('/dashboard/:id/:entryId', authorize, snapshotsController.entryDetails);

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
