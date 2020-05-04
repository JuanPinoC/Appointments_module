const mongoose = require('mongoose');

const shiftSchema = mongoose.Schema({
	
	_id:	mongoose.Schema.Types.ObjectId,
	health_center: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthCenter', required: true },
	doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
	start: { type: date, required: true },
	end: { type: date, required: true },
	patient_limit: { type: Number, required: true }

});

module.exports = mongoose.model('Shift', shiftSchema, 'shifts');