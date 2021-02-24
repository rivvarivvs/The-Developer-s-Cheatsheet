const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model('User', userSchema);
