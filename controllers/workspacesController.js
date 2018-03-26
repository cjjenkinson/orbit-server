'use strict';

const User = require('../models/user');
const Category = require('../models/category');

// Get all Workspaces
module.exports.dashboard = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  const answer = {
    id: ctx.user._id,
    name: ctx.user.name,
    email: ctx.user.email,
    token: ctx.user.token,
    workspaces: ctx.user.workspaces
  }
  ctx.status = 200;
  ctx.body = answer;
};

// Adding a new Workspace
module.exports.addWorkspace = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();
  if (!ctx.request.body.name) {
    ctx.status = 400;
    ctx.body = {
      errors:[
        'Workspace name cannot be empty!'
      ]
    };
    return await next();
  }

  const workspace = {
    name: ctx.request.body.name,
    template: ctx.request.body.template
  };

  if (ctx.user.workspaces.some((el) => el.name === ctx.request.body.name)) {
    ctx.status = 401;
    ctx.body = {
      errors:[
        'Workspace already exists.'
      ]
    };
    return await next();
  }

  await User.findOneAndUpdate({'_id': ctx.user._id}, {
    $push: { workspaces: workspace }
  });

  ctx.user = await User.findOne({'_id': ctx.user._id});
  ctx.status = 200;
  ctx.body = ctx.user.workspaces.pop();
};

// Deleting an existing workspace
module.exports.deleteWorkspace = async (ctx, next) => {
  const user = await User.findOne({'_id': ctx.user._id});
  const newWorkspaces = await user.workspaces.filter( el => el._id != ctx.params.id);
  if (newWorkspaces.length === user.workspaces.length) {
    ctx.status = 404;
    ctx.body = {
      errors:[
        'Workspace doesn\'t exists.'
      ]
    };
    return await next();
  }
  ctx.user = await User.findOneAndUpdate({'_id': ctx.user._id}, {workspaces: newWorkspaces});
  ctx.status = 204;
}
