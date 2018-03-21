const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const Workspaces = new Schema({
  name: String,
  category: { type: Schema.Types.ObjectId, ref: 'Catergories' },
  entries: [{ type: Schema.Types.ObjectId, ref: 'Entries' }]
});

const User = new Schema({
  name: String,
  email: String,
  password: String,
  token: String,
  workspaces: [ Workspaces ]
});

module.exports = mongoose.model('User', User);
