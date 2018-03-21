'use strict';

const filterProps = require('../services/utils').filterProps;
require('dotenv').config();
const atob = require('atob');

const bcrypt = require('bcrypt');
const saltRounds = process.env.SALT;
const uuidv1 = require('uuid/v1');

const User = require('../models/user');

// Create a new User
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

// Log in a User
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

// Remove a user
module.exports.removeUser = async (ctx, next) => {
  const user = await User.findOneAndRemove({token: ctx.user.token});
  ctx.user = '';
  ctx.status = 204;
}
