const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  workspaces: Array
});

module.exports = mongoose.model('User', User);
