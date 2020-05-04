const jwt = require('jsonwebtoken');

const can = ( userType = null, action = null ) => {

	/* do something...*/

	return true;

}

module.exports = (req, res, next) => {
	try{
		if( can() ){
			next();
		}
		else {
			res.status(403).end();
		}

	}
	catch (error) {
		return res.status(401).json({
			message: 'Access Denied'
		});
	}
};