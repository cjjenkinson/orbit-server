const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Enabler = new Schema({
  name: String,
  attributes: Array
});

const Category = new Schema({
  name: String,
  enablersAmount: Number,
  attributesAmount: Array,
  enablers: [ Enabler ]
});

module.exports = mongoose.model('Category', Category);
