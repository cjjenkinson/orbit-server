'use strict';

const User = require('../models/user');
const Entry = require('../models/entry');
const Category = require('../models/category');

// Add a new snapshot
module.exports.addSnapshot = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();
  if (!ctx.request.body.title || !ctx.request.body.enablers) {
    ctx.status = 404;
    ctx.body = {
      errors:[
        'Title and enablers are mandatory fields.'
      ]
    };
    return await next();
  }
  const user = await User.findOne({'_id': ctx.user._id});
  const categoryId = user.workspaces.filter( el => el._id == ctx.params.id)[0].category;
  const category = await Category.findById(categoryId);

  function checkAmountEnablers (category, enablers) {
    let check = false;
    if (category.attributesAmount.length === enablers.length) {
      for (let i = 0; i < enablers.length; i++) {
        if (category.attributesAmount[i] !== enablers[i].length) {
          return check;
        }
      }
      check = true;
    }
    return check;
  }
  if (!checkAmountEnablers(category,ctx.request.body.enablers)) {
    ctx.status = 400;
    ctx.body = {
      errors:[
        'Enablers input doesn\'t fit the selected category'
      ]
    };
    return await next();
  }
  const targetEntry = await Entry.findOne({'_id': ctx.params.entryId});
  const snapshot = {
    date: Date.now(),
    title: ctx.request.body.title,
    comments: ctx.request.body.comments || "",
    enablers: ctx.request.body.enablers
  }
  await targetEntry.snapshots.push(snapshot)
  await targetEntry.save();
  ctx.status = 200;
  ctx.body = await targetEntry.snapshots;
}

// Delete a snapshot
module.exports.deleteSnapshot = async (ctx, next) => {
  const targetEntry = await Entry.findOne({'_id': ctx.params.entryId});
  let newSnapshots = [];
  if (targetEntry) {
    newSnapshots = await targetEntry.snapshots.filter( el => el._id != ctx.params.snapId);
  }
  if (newSnapshots.length === targetEntry.snapshots.length) {
    ctx.status = 404;
    ctx.body = {
      errors:[
        'Snapshot not found!'
      ]
    };
    return await next();
  }
  await Entry.findOneAndUpdate({'_id': ctx.params.entryId}, {snapshots: newSnapshots});
  ctx.status = 204;
}
