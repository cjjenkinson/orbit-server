const mongoose = require('mongoose');

const Skill = require('./skill.model')

const Snapshot = new mongoose.Schema({
  date: Date,
  title: {
    type: String,
    required: 'A snapshot must have a name!',
  },
  comments: [String],
  enablers: Array
});

module.exports = Snapshot;