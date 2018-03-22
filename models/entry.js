const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Snapshot = new Schema({
  date: Date,
  title: String,
  comments: String,
  enablers: Array
});

const Entry = new Schema({
  name: String,
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  snapshots: [ Snapshot ]
});

module.exports = mongoose.model('Entry', Entry);
