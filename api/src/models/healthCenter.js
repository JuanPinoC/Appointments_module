const mongoose = require('mongoose');

const healthCenterSchema = mongoose.Schema({
	_id:	mongoose.Schema.Types.ObjectId,
	ruc: { type: Number, required: true },
	name: { type: String, required: true },
	city: { type: String, required: true },
	district: { type: String, required: true },
	specialties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Specialty'}]
});

module.exports = mongoose.model('HealthCenter', healthCenterSchema, 'health_centers');