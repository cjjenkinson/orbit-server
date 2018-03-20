'use strict';

const filterProps = require('../services/utils').filterProps;

const atob = require('atob');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const uuidv1 = require('uuid/v1');

const User = require('../models/user');

module.exports.create = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();
  const userData = ctx.request.body;

  let user = await User.findOne({email:userData.email});

  if (user) {
    ctx.status = 400;
    ctx.body = {
      errors:[
        'e-mail already exists.'
      ]
    };
  } else {
    let userObject = filterProps(userData, ['name','password','email']);
    let res;
    const hash = await bcrypt.hash(userObject.password, saltRounds);
    res = {name: userObject.name, email:userObject.email, password: hash, token: uuidv1()};
    ctx.body = await User.create(res);
    ctx.status = 201;
  }
};

module.exports.dashboard = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  // retrieve the current user data
  ctx.body = ctx.user;
};

module.exports.logIn = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  const fullToken = ctx.header['authorization'].split(' ');
  if (fullToken[0] === 'Basic') {
    let encUser = fullToken[1];
    let user = atob(encUser);
    let [email, password] = user.split(':');
    ctx.user = await User.findOne({email});
    if(ctx.user !== null) {
      const same = await bcrypt.compare(password, ctx.user.password);
      if(same) {
        // Passwords match
        ctx.status = 200;
        ctx.body = ctx.user;
      }
    } else {
      ctx.status = 401;
      ctx.body = "Wrong e-mail or password";
      return await next();
    }
  } else {
    let token = fullToken[1];
    ctx.user = await User.findOne({token});
    if(ctx.user !== null) {
      ctx.status = 200;
      ctx.body = ctx.user;
    } else {
      ctx.status = 401;
      ctx.body = "Not the correct token";
      return await next();
    }
  }
};

// Adding a new Workspace
module.exports.workspaceAdd = async (ctx, next) => {
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
  ctx.body = await ctx.user;
};

// Deleting an existing workspace
module.exports.workspaceDelete = async (ctx, next) => {
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

// Get entries details
module.exports.entriesDetails = async (ctx, next) => {
  console.log(ctx)
}
