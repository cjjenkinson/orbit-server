'use strict';

const User = require('../models/user');
const Entry = require('../models/entry');

// Add a new snapshot
module.exports.addSnapshot = async (ctx, next) => {
  if ('POST' != ctx.method) return await next();
  const targetEntry = await Entry.findOne({'_id': ctx.params.entryId});
  const snapshot = {
    date: Date.now(),
    title: ctx.request.body.title,
    comments: ctx.request.body.comments,
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
    ctx.body = "Snapshot not found";
  } else {
    await Entry.findOneAndUpdate({'_id': ctx.params.entryId}, {snapshots: newSnapshots});
    ctx.status = 204;
  }
}
