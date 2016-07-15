// represents a user allowed to push data
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: {type: String, required: true, unique: true},
	fqname: {type: String},

	roles: [String],
});

module.exports = mongoose.model('User', UserSchema);