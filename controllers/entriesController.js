'use strict';

const User = require('../models/user');
const Entry = require('../models/entry');

// Get all Entries
module.exports.listEntries = async (ctx, next) => {
  if ('GET' != ctx.method) return await next();
  const user = await User.findOne({'_id': ctx.user._id});
  const targetWorkspace = await user.workspaces.filter( el => el._id == ctx.params.id);
  if (targetWorkspace.length == 0) {
    ctx.status = 404;
    ctx.body = "workspace not found"
  } else {
    const allEntries = [];
    let current;
    for (let x = 0; x < targetWorkspace[0].entries.length; x++) {
      current = await Entry.findOne({'_id': targetWorkspace[0].entries[x]})
      await allEntries.push(current)
    }
    ctx.status = 200;
    ctx.body = allEntries;
  }
};

// Adding a new Entry
module.exports.addEntry = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();
  if (!ctx.request.body.name) {
    ctx.status = 400;
    ctx.body = {
      errors:[
        'Name cannot be empty!'
      ]
    };
    return;
  }
  const user = await User.findOne({'_id': ctx.user._id});
  const targetWorkspace = await user.workspaces.filter( el => el._id == ctx.params.id);
  const entry = await Entry.create({
    name: ctx.request.body.name,
    workspace: ctx.params.id
  });
  targetWorkspace[0].entries.push(entry._id)
  await user.save();
  ctx.status = 201;
  ctx.body = entry;
};

// Deleting an existing Entry
module.exports.deleteEntry = async (ctx, next) => {
  if ('DELETE' != ctx.method) return await next();
  const user = await User.findOne({'_id': ctx.user._id});
  const targetWorkspace = await user.workspaces.filter( el => el._id == ctx.params.id);
  if (targetWorkspace[0].entries.indexOf(ctx.params.entryId) === -1) {
    ctx.status = 404;
    ctx.body = "Entry not found";
  } else {
    targetWorkspace[0].entries.splice(targetWorkspace[0].entries.indexOf(ctx.params.entryId),1);
    await user.save();
    ctx.status = 204;
  }
}
