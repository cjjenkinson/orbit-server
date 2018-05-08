const mongoose = require('mongoose');

const Workspace = new mongoose.Schema({
	name: String,
	template: Object,
	category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
	entries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry'
  }],
});

module.exports = Workspace;