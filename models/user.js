const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Workspace = new Schema({
	name: String,
	template: Object,
	category: { type: Schema.Types.ObjectId, ref: 'Catergory' },
	entries: [{ type: Schema.Types.ObjectId, ref: 'Entry' }],
});

const User = new Schema({
	name: String,
	email: String,
	password: String,
	token: String,
	workspaces: [Workspace],
});

module.exports = mongoose.model('User', User);
