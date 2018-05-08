const mongoose = require('mongoose');

const Skill = require('./skill.model')

const Category = new mongoose.Schema({
  name: {
    type: String,
    required: 'A category must have a name!',
  },
  attributesAmount: Array,
  skills: [Skill]
});

module.exports = mongoose.model('Category', Category);
