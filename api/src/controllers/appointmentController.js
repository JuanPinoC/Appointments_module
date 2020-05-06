const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Appointment = require('../models/appointment');
const jwt = require('jsonwebtoken');

const errorHandler = ( res, err ) => {
	res.status(500).json({
		error:err
	});
};

module.exports = {

	list: (req,res,next) => {

		Appointment.aggregate([
				{
					$lookup: {
						from: 'users',
						localField: 'patient',
						foreignField: '_id',
						as: 'patient'
					}
				},{
					$lookup: {
						from: 'shifts',
						localField: 'shift',
						foreignField: '_id',
						as: 'shift'
					}
				},{
					$lookup: {
						from: 'doctors',
						localField: 'shift.doctor',
						foreignField: '_id',
						as: 'doctor_data'
					}
				},{
					$lookup: {
						from: 'people',
						localField: 'doctor_data.person',
						foreignField: '_id',
						as: 'doctor'
					}
				},{
					$lookup: {
						from: 'health_centers',
						localField: 'shift.health_center',
						foreignField: '_id',
						as: 'health_center'

					}
				},{
					$project: {
						__v: 0,
						'patient.password': 0,
						'patient.__v': 0,
						'shift.__v': 0,
						'health_center.__v': 0,
						'doctor.__v': 0
					}
				}
			])
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					records: docs.map( doc => {
						return {
								_id: doc._id,
								patient: doc.patient,
								shift: doc.shift,
								state: doc.state,
								order: doc.order,
								doctor: doc.doctor,
								health_center: doc.health_center
							}
					})
				};

				res.status(200).json(response);
			})
			.catch( err => errorHandler(res, err) );

	},
	create: (req,res,next) => {

		Appointment.find({ shift: req.body.shift })
			.populate('shift')
			.exec()
			.then( records => {

				if( records.length > 0 && records.length >= records[0].shift.patient_limit ) {
					return res.status(409).json({
						message: 'Shift is full'
					});
				} else {

					const appointment = new Appointment({
						_id: new mongoose.Types.ObjectId(),
						patient: req.body.patient,
						shift: req.body.shift,
						state: 'pending',
						order: req.body.order
					});

					appointment.save().then( result => {

						res.status(201).json({
							message: 'Succesfully created',
							createdRecord: {
								_id: result._id,
								patient: result.patient,
								shift: result.shift,
								state: result.state,
								order: result.order
							}
						});													

					}).catch( err => errorHandler(res, err) );
				}
			}).catch( err => errorHandler(res, err) );
			
	},
	
	find: (req,res,next) => {

		const id = req.query.id;

		Appointment.aggregate([
				{
					$match: {
						_id: mongoose.Types.ObjectId(id)
					},
					$lookup: {
						from: 'users',
						localField: 'patient',
						foreignField: '_id',
						as: 'patient'
					},
					$lookup: {
						from: 'shifts',
						localField: 'shift',
						foreignField: '_id',
						as: 'shift'
					},
					$lookup: {
						from: 'people',
						localField: 'shift.doctor',
						foreignField: '_id',
						as: 'doctor'
					},
					$lookup: {
						from: 'health_centers',
						localField: 'shift.health_center',
						foreignField: '_id',
						as: 'health_center'
					}
				}
			])
			.exec()
			.then(doc => {
				
				if (doc) {
					res.status(200).json( doc );
				}else{
					res.status(404).json({message:'No valid entry found for provided ID'});
				}

			})
			.catch( err => errorHandler(res, err) );

	},

	update: (req,res,next) => {

		const filter = { _id: req.body.id };

		const appointmentUpdate = {
				patient: req.body.patient,
				shift: req.body.shift,
				state: 'pending',
				order: req.body.order
		};

		Appointment.findOneAndUpdate(filter, appointmentUpdate, { new: true })
			.then( (doc) => {
				
				res.status(200).json({
					message: 'Appointment updated'
				});		

			}).catch( err => errorHandler(res, err) );

	},
	delete: (req,res,next) => {

		const id = req.query.id;
			
		Appointment.findById(id)
			.select('_id')
			.exec()
			.then( doc =>{
				
				if (!doc) {

					return res.status(404).json({
						message: "Health center not found"
					});
				
				}else{

					Appointment.deleteOne({ _id: id })
							.exec()
							.then( result =>{

								res.status(200).json({
									message: 'Appointment deleted',
								});

							})
							.catch( err => errorHandler(res, err) );	
				}

			})
			.catch( err => errorHandler(res, err) );

	}

};