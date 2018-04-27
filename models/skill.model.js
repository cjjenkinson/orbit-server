const mongoose = require('mongoose');

const Skill = new mongoose.Schema({
  name: String,
  attributes: Array
});

module.exports = Skill;