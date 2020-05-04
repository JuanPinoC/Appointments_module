const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	worker_code: { type: Number, required: true },
	health_centers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HealthCenter' }],
	specialty: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialty', required: true }, 
	person: { type: mongoose.Schema.Types.ObjectId, ref: 'Person', required: true }
});

module.exports = mongoose.model('Doctor', doctorSchema, 'doctors');