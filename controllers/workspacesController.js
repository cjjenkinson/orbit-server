'use strict';

const User = require('../models/user');

// Get all Workspaces
module.exports.dashboard = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  // retrieve the current user data
  ctx.status = 200;
  const answer = {
    id: ctx.user._id,
    name: ctx.user.name,
    email: ctx.user.email,
    token: ctx.user.token,
    workspaces: ctx.user.workspaces
  }
  ctx.body = answer;
};

// Adding a new Workspace
module.exports.addWorkspace = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();
  if (!ctx.request.body.name || !ctx.request.body.category) {
    ctx.status = 400;
    ctx.body = {
      errors:[
        'Name and category cannot be empty!'
      ]
    };
    return;
  }
  const category = await Catergories.findOne({'name': ctx.request.body.category});
  if (!category) {
    ctx.status = 400;
    ctx.body = {
      errors:[
        'Category doesn\'t exist!'
      ]*
    };
    return;
  }
  const workspace = {
    name: ctx.request.body.name,
    category: category._id
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
