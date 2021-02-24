const jwt = require('jsonwebtoken');

const { jwt_key } = require('../config');

exports.requireAuth = (req, res, next) => {
	if (!req.session.jwt) {
		throw new Error('Not logged in 1');
	}

	try {
		const req.currentUser = jwt.verify(req.session.jwt, jwt_key);
		res.send({ currentUser });
	} catch (err) {
		console.log(err);
	}

	next();
};
