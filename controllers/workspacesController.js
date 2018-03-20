'use strict';

const User = require('../models/user');

// Get all Workspaces
module.exports.dashboard = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  // retrieve the current user data
  ctx.status = 200;
  ctx.body = ctx.user.workspaces;
};

// Adding a new Workspace
module.exports.addWorkspace = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();
  const workspace = {
    name: ctx.request.body.name,
    category: ctx.request.body.category
  };
  if (ctx.user.workspaces.some((el) => el.name === workspace.name)) {
    ctx.status = 401;
    ctx.body = {
      errors:[
        'Workspace already exists.'
      ]
    };
    return;
  }
  ctx.user = await User.findOneAndUpdate({'_id': ctx.user._id}, {
    $push: {workspaces: workspace}
  });
  ctx.status = 200;
  ctx.body = await ctx.user.workspaces;
};

// Deleting an existing workspace
module.exports.deleteWorkspace = async (ctx, next) => {
  const user = await User.findOne({'_id': ctx.user._id});
  let newWorkspaces = [];
  if (user) {
    newWorkspaces = await user.workspaces.filter( el => el._id != ctx.params.id);
  }
  if (newWorkspaces.length === user.workspaces.length) {
    ctx.status = 404;
    ctx.body = "Workspace not found";
  }
  else {
    ctx.user = await User.findOneAndUpdate({'_id': ctx.user._id}, {workspaces: newWorkspaces});
    ctx.status = 204;
  }
}
