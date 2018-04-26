const mongoose = require('mongoose');

const Skill = new mongoose.Schema({
  name: {
    type: String,
    required: 'A skill must have a name!',
  },
  attributes: [String]
});

module.exports = Skill;