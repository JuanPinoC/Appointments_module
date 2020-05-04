const mongoose = require('mongoose');

const types = ['patient','doctor','organizer','admin'];

const userSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	email: { type: String, required: true },
	password: { type: String, required: true },
	type: { type: String, enum: types, default: 'patient', required: true }, 
	person: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }
});

module.exports = mongoose.model('User', userSchema, 'users');