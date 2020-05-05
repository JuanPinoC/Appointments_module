const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Person = require('../models/person');
const Doctor = require('../models/doctor');
const jwt = require('jsonwebtoken');


const errorHandler = ( res, err ) => {
	res.status(500).json({
		error:err
	});
};

module.exports = {

	list: (req,res,next) => {

		User.find()
			.select('email type person')
			.populate('person','name lastname')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					records: docs.map( doc => {
						return {
								_id: doc._id,
								email: doc.email,
								type: doc.type,
								person: doc.person
							}
					})
				};

				res.status(200).json(response);
			})
			.catch( err => errorHandler(res, err) );

	},
	create: (req,res,next) => {

		User.find({ email: req.body.email })
			.exec()
			.then(user => {
				if( user.length >= 1) {
					return res.status(409).json({
						message: 'Mail exists'
					});
				}
				else{

					bcrypt.hash(req.body.password, 10, (err, hash) => {
						if( err ) {
							return res.status(500).json({
								error: err
							});
						}
						else{

							const person = new Person({
								_id: new mongoose.Types.ObjectId(),
								dni: req.body.dni,
								name: req.body.name,
								lastname: req.body.lastname,
								gender: req.body.gender,
								birthdate: req.body.birthdate,
								cellphone: req.body.cellphone,
								telephone: req.body.telephone
							});

							person.save()
								.then( resultPerson => {

									const user = new User({
										_id: new mongoose.Types.ObjectId(),
										email: req.body.email,
										password: hash
										type: req.body.type,
										person: resultPerson._id
									});

									user.save()
										.then( resultUser => {
											
											if( req.body.type === 'doctor' ){
												const doctor = new Doctor({
													worker_code: req.body.worker_code,
													health_centers: req.body.health_centers,
													specialty: req.body.specialty,
													person: resultPerson._id
												});

												doctor.save().then( resultDoctor => {

													res.status(201).json({
														message: 'Succesfully created',
														createdUser: {
															_id: resultUser._id,
															email: resultUser.email,
															password: resultUser.password
														}
													});													

												}).catch( err => errorHandler(res, err) );

											}

										}).catch( err => errorHandler(res, err) );

								}).catch( err => errorHandler(res, err) );

						}
					})
				}
			});
			
	},
	
	find: (req,res,next) => {

		const id = req.query.id;

		User.findById(id)
			.select('email type person')
			.populate('person','dni name lastname')
			.exec()
			.then(doc => {
				
				if (doc) {
				
					if( doc.type === 'doctor' ){

						Doctor.findOne({ person: doc.person._id })
								.exec()
								.then( doctor => {
									res.status(200).json( { user: doc, doctor: doctor } );
								});

					}else{

						res.status(200).json( doc );	

					}

				}else{
					res.status(404).json({message:'No valid entry found for provided ID'});
				}
			})
			.catch( err => errorHandler(res, err) );

	},
	findOwn: (req,res,next) => {

		User.findById(req.userData._id)
			.select('_id email type person')
			.populate('person','dni name lastname gender birthdate cellphone telephone')
			.exec()
			.then(doc => {

				if (doc) {
					
					if( doc.type === 'doctor' ){

						Doctor.findOne({ person: doc.person._id })
								.exec()
								.then( doctor => {
									res.status(200).json( { user: doc, doctor: doctor } );
								});

					}else{

						res.status(200).json( doc );	

					}

				}else{
					res.status(404).json({message:'No valid entry found for provided ID'});
				}
			})
			.catch( err => errorHandler(res, err) );

	},
	update: (req,res,next) => {

		if( req.body.password !== null && req.body.password !== '' ){

			bcrypt.hash(req.body.password, 10, (err, hash) => {

				if( err ) {
					return res.status(500).json({
						error: err
					});
				}
				else{

					const filter = { _id: req.body.id };

					const userUpdate = {
						email: req.body.email,
						password: hash,
						type: req.body.type
					};

					const personUpdate = {
						dni: req.body.dni,
						name: req.body.name,
						lastname: req.body.lastname,
						gender: req.body.gender,
						birthdate: req.body.birthdate,
						cellphone: req.body.cellphone,
						telephone: req.body.telephone
					};

					User.findOneAndUpdate(filter, userUpdate, { new: true })
						.then( (userDoc) => {

							Person.findOneAndUpdate({ _id: userDoc.person }, personUpdate, { new: true })
							.then( (personDoc) => {


								if( userDoc.type === 'doctor' ){

									const doctorUpdate = {
										worker_code: req.body.worker_code,
										health_centers: req.body.health_centers,
										specialty: req.body.specialty
									};

									Doctor.findOneAndUpdate({ person: userDoc.person }, doctorUpdate, { new: true })
									.then( (doctorDoc) => {
										
										res.status(200).json({
											message: 'User updated.'
										});		

									}).catch( err => errorHandler(res, err) );

								} else {

									res.status(200).json({
										message: 'User updated.'
									});

								}

							}).catch( err => errorHandler(res, err) );

						})
						.catch( err => errorHandler(res, err) );

				}

			});

		}else{

			const filter = { _id: req.body.id };

			const userUpdate = {
				type: req.body.type,
				email: req.body.email
			};

			const personUpdate = {
				dni: req.body.dni,
				name: req.body.name,
				lastname: req.body.lastname,
				gender: req.body.gender,
				birthdate: req.body.birthdate,
				cellphone: req.body.cellphone,
				telephone: req.body.telephone
			};

			User.findOneAndUpdate(filter, userUpdate, { new: true })
				.then( (userDoc) => {
					
					Person.findOneAndUpdate({ _id: userDoc.person }, personUpdate, { new: true })
					.then( (personDoc) => {

						if( userDoc.type === 'doctor' ){

							const doctorUpdate = {
								worker_code: req.body.worker_code,
								health_centers: req.body.health_centers,
								specialty: req.body.specialty
							};

							Doctor.findOneAndUpdate({ person: userDoc.person }, doctorUpdate, { new: true })
							.then( (doctorDoc) => {
								
								res.status(200).json({
									message: 'User updated.'
								});		

							}).catch( err => errorHandler(res, err) );

						} else {

							res.status(200).json({
								message: 'User updated.'
							});

						}

					}).catch( err => errorHandler(res, err) );

				})
				.catch( err => errorHandler(res, err) );

		}

	},
	delete: (req,res,next) => {

		const id = req.query.id;
			
		User.findById(id)
			.select('_id person type')
			.exec()
			.then( doc =>{
				
				if (!doc) {

					return res.status(404).json({
						message: "User not found"
					});
				
				}else{

					User.deleteOne({ _id: id })
						.exec()
						.then( result => {

							Person.deleteOne({ person: doc.person })
								.exec()
								.then( result1 => {

									if( doc.type === 'doctor' ){

										Doctor.deleteOne({ doc.person })
												.exec()
												.then( result3 =>{

													res.status(200).json({
														message: 'User deleted',
													});

												})
												.catch( err => errorHandler(res, err) );

									}else{

										res.status(200).json({
											message: 'User deleted',
										});

									}

								})
								.catch( err => errorHandler(res, err) );

						})
						.catch( err => errorHandler(res, err) );		
				}

			})
			.catch( err => errorHandler(res, err) );

	},
	login: (req,res,next) => {

		User.findOne( { email: req.body.email } )
			.populate('person')
			.exec()
			.then( user => {

				if (typeof user !== 'undefined') {

					bcrypt.compare(req.body.password, user.password, (err, result) => {

						if (err) {
							return res.status(401).json({
								message: 'Auth failed'
							});
						}
						else if (result) {
							
							const token = jwt.sign(
								{
									_id: user._id,
									email: user.email,
									type: user.type
								},
								//process.env.JWT_KEY,
								'secret',
								{
									expiresIn: "1h"
								}
							);

							return res.status(200).json({
								message: 'Auth succesful',
								token: token,
								person: user.person,
								email: user.email,
								type: user.type
							});
						}

					});
					
				}

			})
			.catch( err => errorHandler(res, err) );
	
	},

	findDoctorsByFilter: (req,res,next) => {

		let filter = { type: 'doctor' };

		if( req.body.hospital !== null && typeof req.body.hospital !== 'undefined' ){
			filter.hospital = req.body.hospital;
		}
		if( req.body.specialty !== null && typeof req.body.specialty !== 'undefined' ){
			filter.specialty = req.body.specialty;
		}

		User.find(filter)
			.select('email type person')
			.populate('person','name lastname')
			.exec()
			.then( docs => {
				const response = {
					count: docs.length,
					records: docs.map( doc => {
						return {
								_id: doc._id,
								email: doc.email,
								type: doc.type,
								person: doc.person
							}
					})
				};

				res.status(200).json(response);
			})
			.catch( err => errorHandler(res, err) );

	}

};