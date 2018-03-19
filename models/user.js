const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Attributes = new Schema({
  name: String,
  subattributes: Array
});

const Workspaces = new Schema({
  name: String,
  category: String,
  attributes: [ Attributes ]
});

const User = new Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  workspaces: [ Workspaces ]
});



module.exports = mongoose.model('User', User);
