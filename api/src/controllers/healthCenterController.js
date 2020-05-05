const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const HealthCenter = require('../models/healthCenter');
const jwt = require('jsonwebtoken');

const errorHandler = ( res, err ) => {
	res.status(500).json({
		error:err
	});
};

module.exports = {

	list: (req,res,next) => {

		HealthCenter.find()
			.select('ruc name city district specialties')
			.populate('specialties')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					records: docs.map( doc => {
						return {
								_id: doc._id,
								ruc: doc.ruc,
								name: doc.name,
								city: doc.city,
								district: doc.district,
								specialties: doc.specialties
							}
					})
				};

				res.status(200).json(response);
			})
			.catch( err => errorHandler(res, err) );

	},
	create: (req,res,next) => {

		HealthCenter.find({ ruc: req.body.ruc })
			.exec()
			.then( healthCenters => {
				if( healthCenters.length >= 1) {
					return res.status(409).json({
						message: 'RUC exists'
					});
				}
				else{

					const center = new HealthCenter({
						_id: new mongoose.Types.ObjectId(),
						ruc: req.body.ruc,
						name: req.body.name,
						city: req.body.city,
						district: req.body.district,
						specialties: req.body.specialties
					});

					center.save().then( resultCenter => {

						res.status(201).json({
							message: 'Succesfully created',
							createdRecord: {
								_id: resultCenter._id,
								ruc: resultCenter.ruc,
								name: resultUser.name
							}
						});													

					}).catch( err => errorHandler(res, err) );
				}
			}).catch( err => errorHandler(res, err) );
			
	},
	
	find: (req,res,next) => {

		const id = req.query.id;

		HealthCenter.findById(id)
			.populate('specialties')
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

		const centerUpdate = {
			ruc: req.body.ruc,
			name: req.body.name,
			city: req.body.city,
			district: req.body.district,
			specialties: req.body.specialties
		};

		HealthCenter.findOneAndUpdate(filter, centerUpdate, { new: true })
		.then( (doc) => {
			
			res.status(200).json({
				message: 'Health center updated.'
			});		

		}).catch( err => errorHandler(res, err) );

	},
	delete: (req,res,next) => {

		const id = req.query.id;
			
		HealthCenter.findById(id)
			.select('_id')
			.exec()
			.then( doc =>{
				
				if (!doc) {

					return res.status(404).json({
						message: "Health center not found"
					});
				
				}else{

					HealthCenter.deleteOne({ _id: id })
							.exec()
							.then( result =>{

								res.status(200).json({
									message: 'Health center deleted',
								});

							})
							.catch( err => errorHandler(res, err) );	
				}

			})
			.catch( err => errorHandler(res, err) );

	}

};