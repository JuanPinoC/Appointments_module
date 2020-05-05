const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Shift = require('../models/shift');
const jwt = require('jsonwebtoken');

const errorHandler = ( res, err ) => {
	res.status(500).json({
		error:err
	});
};

module.exports = {

	list: (req,res,next) => {

		Shift.find()
			.populate('health_center','_id name')
			.populate('doctor','_id name')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					records: docs.map( doc => {
						return {
								_id: doc._id,
								health_center: doc.health_center,
								doctor: doc.doctor,
								start: doc.start,
								end: doc.end,
								patient_limit: doc.patient_limit
							}
					})
				};

				res.status(200).json(response);
			})
			.catch( err => errorHandler(res, err) );

	},
	create: (req,res,next) => {

		const shifts = req.body.shifts;

		let shiftPromises = shifts.map( (item, index) => {

			let itemPromise = new Promise(
											( resolve, reject ) => {

												const shift = new Shift({
													_id: new mongoose.Types.ObjectId(),
													health_center: item.health_center,
													doctor: item.doctor,
													start: item.start,
													end: item.end,
													patient_limit: item.patient_limit
												});

												shift.save().then( result => {

													resolve();

												}).catch( err => reject(err) );
												
											});

			return itemPromise.then( () => { return true } ).catch( (err) => { console.log(err); return false; } );
		
		});

		Promise.all(shiftPromises).then(arrayOfResponses => {
			
			if( arrayOfResponses.every( (e) => e ) ){
				res.status(201).json({
					message: 'Shifts succesfully created'
				});
			}else{
				errorHandler(res, 'Not all shifts created succesfully');
			}

		}).catch( err => errorHandler(res, err) );

	},
	
	find: (req,res,next) => {

		const id = req.query.id;

		Shift.findById(id)
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

		const shiftUpdate = {
			health_center: item.health_center,
			doctor: item.doctor,
			start: item.start,
			end: item.end,
			patient_limit: item.patient_limit
		};

		Shift.findOneAndUpdate(filter, shiftUpdate, { new: true })
		.then( (doc) => {
			
			res.status(200).json({
				message: 'Shift updated'
			});		

		}).catch( err => errorHandler(res, err) );

	},
	delete: (req,res,next) => {

		const id = req.query.id;
			
		Shift.findById(id)
			.select('_id')
			.exec()
			.then( doc =>{
				
				if (!doc) {

					return res.status(404).json({
						message: "Specialty not found"
					});
				
				}else{

					Shift.deleteOne({ _id: id })
							.exec()
							.then( result =>{

								res.status(200).json({
									message: 'Shift deleted',
								});

							})
							.catch( err => errorHandler(res, err) );
				}

			})
			.catch( err => errorHandler(res, err) );

	},

	findByFilter: (req,res,next) => {

		let filter = {};

		if( req.body.hospital !== null && typeof req.body.hospital !== 'undefined' ){
			filter.hospital = req.body.hospital;
		}
		if( req.body.specialty !== null && typeof req.body.specialty !== 'undefined' ){
			filter.specialty = req.body.specialty;
		}
		if( req.body.doctor !== null && typeof req.body.doctor !== 'undefined' ){
			filter.doctor = req.body.doctor;
		}

		Shift.find(filter)
			.populate('health_center','_id name')
			.populate('doctor','_id name')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					records: docs.map( doc => {
						return {
								_id: doc._id,
								health_center: doc.health_center,
								doctor: doc.doctor,
								start: doc.start,
								end: doc.end,
								patient_limit: doc.patient_limit
							}
					})
				};

				res.status(200).json(response);
			})
			.catch( err => errorHandler(res, err) );

	}

};