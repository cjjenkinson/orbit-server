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

  let user = await User.findOne({username:userData.username});

  if (user) {
    ctx.status = 400;
    ctx.body = {
      errors:[
        'Username already exists.'
      ]
    };
  } else {
    let userObject = filterProps(userData, ['username','password','email']);
    let res;
    const hash = await bcrypt.hash(userObject.password, saltRounds);
    res = {username: userObject.username, email:userObject.email, password: hash, token: uuidv1()};
    ctx.body = await User.create(res);
    console.log(ctx.body)
    ctx.status = 201;
  }
};

module.exports.me = async (ctx, next) => {
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
    let [username, password] = user.split(':');
    ctx.user = await User.findOne({username});
    if(ctx.user !== null) {
      const same = bcrypt.compare(password, ctx.user.password);
      if(same) {
        // Passwords match
        ctx.status = 200;
        ctx.body = ctx.user;
      }
    } else {
      ctx.status = 401;
      ctx.body = "Not the correct token";
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
