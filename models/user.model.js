const mongoose = require('mongoose');
const validator = require('validator');

const Workspace = require('./workspace.schema');

const User = new mongoose.Schema({
	name: {
    type: String,
    required: 'A user must have a name!',
    trim: true,
  },
	email: {
    type: String,
    required: 'A user must have a email!',
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email!']
  },
	password: {
    type: String,
		required: 'A user must have a password!',
		minlength: 4,
		maxlength: 64,
  },
	token: String,
	workspaces: [Workspace],
});

module.exports = mongoose.model('User', User);
