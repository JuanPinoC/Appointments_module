const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./src/routes/user');
const appointmentRoutes = require('./src/routes/appointment');
const healthCenterRoutes = require('./src/routes/healthCenter');
const shiftRoutes = require('./src/routes/shift');
const specialtyRoutes = require('./src/routes/specialty');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

/*
Replace update() with updateOne(), updateMany(), or replaceOne()
Replace remove() with deleteOne() or deleteMany().
Replace count() with countDocuments(), unless you want to count how many documents are
 in the whole collection (no filter). In the latter case, use estimatedDocumentCount().
*/

/*

mongodump -d <database_name> -o <directory_backup>

mongorestore -d <database_name> <directory_backup>

*/

mongoose.connect('mongodb://localhost:27017/appointments_module');
mongoose.Promise = global.Promise;

app.set('view engine', 'jade');

app.get('/', (req, res) => {
	res.render('main');
});

app.use(morgan('dev'));
//app.use('/uploads', express.static('Uploads'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use( (req, res, next) => {
	
	res.header('Access-Control-Allow-Origin','*');
	res.header(	'Access-Control-Allow-Headers',
				'Origin, X-Requested-Width, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');

	next();

});

app.options('/*', (req, res, next) => {
	res.sendStatus(200);
});

app.use('/user', userRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/healthCenter', healthCenterRoutes);
app.use('/shift', shiftRoutes);
app.use('/specialty', specialtyRoutes);

app.use( (req, res, next) => {
	const err = new Error('Page Not found');
	error.status = 404;
	next( error );
});

app.use( (error, req, res, next) => {
	res.status( error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});


module.exports = app;
