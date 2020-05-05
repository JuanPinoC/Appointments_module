const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Specialty = require('../models/specialty');
const jwt = require('jsonwebtoken');

const errorHandler = ( res, err ) => {
	res.status(500).json({
		error:err
	});
};

module.exports = {

	list: (req,res,next) => {

		Specialty.find()
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					records: docs.map( doc => {
						return {
								_id: doc._id,
								name: doc.name
							}
					})
				};

				res.status(200).json(response);
			})
			.catch( err => errorHandler(res, err) );

	},
	create: (req,res,next) => {

		Specialty.find({ name: req.body.name })
			.exec()
			.then( specialties => {
				if( specialties.length >= 1) {
					return res.status(409).json({
						message: 'Specialty exists'
					});
				}
				else{

					const specialty = new Specialty({
						_id: new mongoose.Types.ObjectId(),
						name: req.body.name
					});

					specialty.save().then( result => {

						res.status(201).json({
							message: 'Succesfully created',
							createdRecord: {
								_id: result._id,
								name: result.name
							}
						});													

					}).catch( err => errorHandler(res, err) );
				}
			}).catch( err => errorHandler(res, err) );
			
	},
	
	find: (req,res,next) => {

		const id = req.query.id;

		Specialty.findById(id)
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

		const specialtyUpdate = {
			name: req.body.name
		};

		Specialty.findOneAndUpdate(filter, specialtyUpdate, { new: true })
		.then( (doc) => {
			
			res.status(200).json({
				message: 'Specialty updated.'
			});		

		}).catch( err => errorHandler(res, err) );

	},
	delete: (req,res,next) => {

		const id = req.query.id;
			
		Specialty.findById(id)
			.select('_id')
			.exec()
			.then( doc =>{
				
				if (!doc) {

					return res.status(404).json({
						message: "Specialty not found"
					});
				
				}else{

					Specialty.deleteOne({ _id: id })
							.exec()
							.then( result =>{

								res.status(200).json({
									message: 'Specialty deleted',
								});

							})
							.catch( err => errorHandler(res, err) );
				}

			})
			.catch( err => errorHandler(res, err) );

	}

};