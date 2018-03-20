const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Snapshots = new Schema({
  date: Date,
  title: String,
  comments: String,
  enablers: Array
});

const Entries = new Schema({
  name: String,
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspaces' },
  snapshots: [ Snapshots ]
});

module.exports = mongoose.model('Entries', Entries);
