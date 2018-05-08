const mongoose = require('mongoose');

const Snapshot = require('./snapshot.schema');

const Entry = new mongoose.Schema({
  name: {
    type: String,
    required: 'An entry must have a name!',
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace'
  },
  snapshots: [Snapshot]
});

module.exports = mongoose.model('Entry', Entry);
