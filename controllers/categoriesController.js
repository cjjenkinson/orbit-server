'use strict';

const Category = require('../models/category');

// Get all Categories
module.exports.getAllCategory = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  const categories = await Category.find();
  ctx.status = 200;
  ctx.body = categories;
}

// Get Category
module.exports.getCategory = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  const category = await Category.findOne({'_id': ctx.params.id});
  if (!category) {
    ctx.status = 401;
    ctx.body = {
      errors:[
        'Category not found!'
      ]
    };
    return await next();
  }
  ctx.status = 200;
  ctx.body = category;
};

// Add a new Category
module.exports.addCategory = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();
  if ( !ctx.request.body.name || !ctx.request.body.enablers) {
    ctx.status = 400;
    ctx.body = {
      errors:[
        'Category name and enablers fields cannot be empty.'
      ]
    };
    return await next();
  }
  let category = await Category.findOne({name: ctx.request.body.name});
  if (category) {
    ctx.status = 400;
    ctx.body = {
      errors:[
        'Category name already exists.'
      ]
    };
    return await next();
  }
  const attributesAmount = function (enablers) {
    const result = [];
    enablers.forEach(el => result.push(el.attributes.length));
    return result;
  }
  category = await Category.create({
    name: ctx.request.body.name,
    attributesAmount: attributesAmount(ctx.request.body.enablers),
    enablers: ctx.request.body.enablers
  });
  ctx.status = 201;
  ctx.body = category;
}
