const mongoose = require('mongoose');

const specialtySchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true }
});

module.exports = mongoose.model('Specialty', specialtySchema, 'specialties');