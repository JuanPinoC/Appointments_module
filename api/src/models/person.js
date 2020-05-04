const mongoose = require('mongoose');

const genders = ['male','female','other'];

const personSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	dni: { type: Number, required: true },
	name: { type: String, required: true },
	lastname: { type: String, required: true },
	gender: { type: String, enum: genders, default: 'other', required: true },
	birthdate: { type: Date, required: true },
	cellphone: { type: String, required: true },
	telephone: { type: String, required: true }
});

module.exports = mongoose.model('Person', personSchema, 'people');