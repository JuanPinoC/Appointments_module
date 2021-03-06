const mongoose = require('mongoose');

const states = ['free','pending','cancelled','done'];

const appointmentSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
	shift: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true },
	state: { type: String, enum: states, default: 'free', required: true },
	order: { type: Number, required: true }
});

module.exports = mongoose.model('Appointment', appointmentSchema, 'appointments');